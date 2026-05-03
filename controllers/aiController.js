const asyncHandler = require('express-async-handler');
const Leave = require('../models/Leave');

// ─── Helper: decide if we're in mock mode ─────────────────────────────────────
const isMock = () =>
    !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'mock';

// ─── Smart mock: deterministic urgency from leave data ───────────────────────
const mockSummarise = (leave) => {
    const days =
        Math.ceil(
            (new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)
        ) + 1;

    const sickKeywords = ['sick', 'ill', 'fever', 'hospital', 'surgery', 'medical', 'health'];
    const isSick =
        leave.leaveType === 'Sick' ||
        sickKeywords.some((k) => leave.reason?.toLowerCase().includes(k));

    let urgency, score;
    if (isSick || days >= 7) { urgency = 'High'; score = Math.min(9, 6 + Math.floor(days / 3)); }
    else if (days >= 3) { urgency = 'Medium'; score = 5; }
    else { urgency = 'Low'; score = 3; }

    const text = `${leave.user?.name || 'Employee'} requests ${days}-day ${leave.leaveType} leave (${new Date(leave.fromDate).toDateString()} – ${new Date(leave.toDate).toDateString()}): "${leave.reason || 'No reason provided'}". Urgency assessed as ${urgency}.`;
    return { text, urgency, score };
};

// ─── Smart mock: bulk priority ranking ───────────────────────────────────────
const mockRankAll = (leaves) => {
    return leaves
        .map((l) => {
            const { urgency, score } = mockSummarise(l);
            const days =
                Math.ceil(
                    (new Date(l.toDate) - new Date(l.fromDate)) / (1000 * 60 * 60 * 24)
                ) + 1;
            return {
                _id: l._id,
                name: l.user?.name || 'Employee',
                department: l.user?.department || '—',
                leaveType: l.leaveType,
                fromDate: l.fromDate,
                toDate: l.toDate,
                reason: l.reason,
                urgency,
                score,
                priorityReason: `${days}-day ${l.leaveType} leave – urgency derived from duration and leave category.`,
            };
        })
        .sort((a, b) => b.score - a.score);
};

// ─── Real OpenAI call: single leave ─────────────────────────────────────────
const openAISummarise = async (leave) => {
    const { OpenAI } = require('openai');
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const days =
        Math.ceil(
            (new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)
        ) + 1;

    const prompt = `You are an HR assistant. Analyse this leave request and respond with ONLY valid JSON (no markdown).

Employee: ${leave.user?.name || 'Unknown'} (${leave.user?.department || 'Unknown Dept'})
Leave Type: ${leave.leaveType}
Duration: ${days} day(s) — ${new Date(leave.fromDate).toDateString()} to ${new Date(leave.toDate).toDateString()}
Reason: ${leave.reason || 'Not provided'}

Return exactly:
{
  "text": "<one sentence summary>",
  "urgency": "<High|Medium|Low>",
  "score": <integer 1-10>
}`;

    const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 150,
    });

    const raw = response.choices[0].message.content.trim();
    return JSON.parse(raw);
};

// ─── Real OpenAI call: all pending ───────────────────────────────────────────
const openAIRankAll = async (leaves) => {
    const { OpenAI } = require('openai');
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const items = leaves.map((l, i) => {
        const days =
            Math.ceil(
                (new Date(l.toDate) - new Date(l.fromDate)) / (1000 * 60 * 60 * 24)
            ) + 1;
        return `${i + 1}. ID:${l._id} | ${l.user?.name} (${l.user?.department || 'N/A'}) | ${l.leaveType} | ${days} days | Reason: ${l.reason}`;
    });

    const prompt = `You are an HR assistant. Rank these pending leave requests by urgency. Respond ONLY with valid JSON array (no markdown).

Leaves:
${items.join('\n')}

For each leave return:
{
  "_id": "<id>",
  "urgency": "<High|Medium|Low>",
  "score": <integer 1-10>,
  "priorityReason": "<one short sentence>"
}`;

    const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
    });

    const raw = response.choices[0].message.content.trim();
    const ranked = JSON.parse(raw);

    // Merge with original leave data
    return ranked
        .map((r) => {
            const leave = leaves.find((l) => String(l._id) === String(r._id));
            if (!leave) return null;
            return {
                _id: leave._id,
                name: leave.user?.name || 'Employee',
                department: leave.user?.department || '—',
                leaveType: leave.leaveType,
                fromDate: leave.fromDate,
                toDate: leave.toDate,
                reason: leave.reason,
                urgency: r.urgency,
                score: r.score,
                priorityReason: r.priorityReason,
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score);
};

// ─── CONTROLLER: GET /api/ai/summarize/:id ───────────────────────────────────
const summarizeLeave = asyncHandler(async (req, res) => {
    const leave = await Leave.findById(req.params.id).populate('user', 'name department');

    if (!leave) {
        res.status(404);
        throw new Error('Leave not found');
    }

    // Return cached result if fresh (< 24 h)
    if (
        leave.aiSummary?.text &&
        leave.aiSummary?.generatedAt &&
        Date.now() - new Date(leave.aiSummary.generatedAt).getTime() < 24 * 60 * 60 * 1000
    ) {
        return res.json({ success: true, aiSummary: leave.aiSummary, cached: true });
    }

    let result;
    if (isMock()) {
        result = mockSummarise(leave);
    } else {
        result = await openAISummarise(leave);
    }

    // Persist result on the leave document
    leave.aiSummary = {
        text: result.text,
        urgency: result.urgency,
        score: result.score,
        generatedAt: new Date(),
    };
    await leave.save();

    res.json({ success: true, aiSummary: leave.aiSummary, cached: false, mock: isMock() });
});

// ─── CONTROLLER: GET /api/ai/summary-all ─────────────────────────────────────
const summarizeAllPending = asyncHandler(async (req, res) => {
    const leaves = await Leave.find({ status: 'Pending' }).populate('user', 'name department');

    if (!leaves.length) {
        return res.json({ success: true, ranked: [], message: 'No pending leaves found.' });
    }

    let ranked;
    if (isMock()) {
        ranked = mockRankAll(leaves);
    } else {
        ranked = await openAIRankAll(leaves);
    }

    res.json({ success: true, ranked, mock: isMock(), total: ranked.length });
});

module.exports = { summarizeLeave, summarizeAllPending };
