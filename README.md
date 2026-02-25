<div align="center">

<img src="https://img.shields.io/badge/LeaveLoop-HR%20Management-7c3aed?style=for-the-badge&logo=zap&logoColor=white" alt="LeaveLoop" />

# 🔁 LeaveLoop

### Modern HR Management, Simplified.

**Manage employee leaves, expense reimbursements, and team approvals — all in one beautiful, role-aware platform.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure, stateless authentication with auto-expiry |
| 👥 **Role-Based Access Control** | Three roles: Admin, Manager, Employee — each with tailored dashboards |
| 🗓️ **Leave Management** | Apply, track, approve or reject leaves with rejection reasons |
| 💸 **Expense Reimbursements** | Submit and track expense claims with full approval workflow |
| 🧑‍💼 **User Management** | Admin can create, edit, and delete users of any role |
| 🏢 **Employee Directory** | Browse team members, departments, and designations |
| 🌐 **Animated Landing Page** | Professional entry point with the LeaveLoop brand |

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JSON Web Tokens (JWT) + bcryptjs
- **Middleware**: Custom `protect` (auth) and `authorize` (RBAC) middleware

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (custom theme / design system)
- **Routing**: React Router v6
- **HTTP Client**: Axios (with request/response interceptors)
- **State**: React Context API (`AuthContext`)
- **Icons**: Lucide React
- **Notifications**: react-hot-toast

---

## 📁 Project Structure

```
LeaveLoop/
├── 📂 config/
│   └── db.js                  # MongoDB Atlas connection
├── 📂 controllers/
│   ├── authController.js      # Register, Login, Profile
│   ├── leaveController.js     # Leave CRUD + status update
│   ├── reimbursementController.js
│   └── userController.js      # Admin user management
├── 📂 middleware/
│   ├── authMiddleware.js      # JWT verify (protect)
│   └── roleMiddleware.js      # RBAC (authorize)
├── 📂 models/
│   ├── User.js
│   ├── Leave.js
│   └── Reimbursement.js
├── 📂 routes/
│   ├── authRoutes.js
│   ├── leaveRoutes.js
│   ├── reimbursementRoutes.js
│   └── userRoutes.js
├── server.js                  # Express entry point
├── .env                       # Environment variables
│
└── 📂 client/                 # Vite React App
    └── 📂 src/
        ├── 📂 api/            # Axios instance + interceptors
        ├── 📂 context/        # AuthContext (global state)
        ├── 📂 components/     # Sidebar, Navbar, StatusBadge, ProtectedRoute
        ├── 📂 pages/
        │   ├── Landing.jsx    # Animated landing page
        │   ├── 📂 auth/       # Login, Register
        │   ├── 📂 employee/   # Dashboard, Profile, Leaves, Expenses
        │   ├── 📂 manager/    # Dashboard, Approvals, Directory
        │   └── 📂 admin/      # Dashboard, User Management
        └── App.jsx            # Route tree
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/leaveloop.git
cd leaveloop
```

### 2. Backend Setup
```bash
# Install server dependencies
npm install

# Create your .env file
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/hr_management
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

```bash
# Start the backend
node server.js
# or with auto-reload:
npx nodemon server.js
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

> The frontend runs on **http://localhost:5173** and the API on **http://localhost:5000**

---

## 🔐 User Roles & Permissions

| Permission | Employee | Manager | Admin |
|---|:---:|:---:|:---:|
| Apply for Leave | ✅ | ✅ | ✅ |
| Submit Expense Claim | ✅ | ✅ | ✅ |
| View Own History | ✅ | ✅ | ✅ |
| Approve / Reject Leaves | ❌ | ✅ | ✅ |
| Approve / Reject Expenses | ❌ | ✅ | ✅ |
| View Employee Directory | ❌ | ✅ | ✅ |
| Create / Edit / Delete Users | ❌ | ❌ | ✅ |
| System-Wide Analytics | ❌ | ❌ | ✅ |

---

## 🌐 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login and receive JWT |
| GET | `/me` | Private | Get current user |
| PUT | `/profile` | Private | Update profile |

### Leaves — `/api/leaves`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Employee | Apply for leave |
| GET | `/my` | Employee | My leave history |
| GET | `/` | Manager/Admin | All leave requests |
| PUT | `/:id/status` | Manager/Admin | Approve or reject with reason |
| DELETE | `/:id` | Employee | Delete pending request |

### Reimbursements — `/api/reimbursements`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Employee | Submit expense claim |
| GET | `/my` | Employee | My expense history |
| GET | `/` | Manager/Admin | All expense claims |
| PUT | `/:id/status` | Manager/Admin | Approve or reject with reason |
| DELETE | `/:id` | Employee | Delete pending claim |

### Users — `/api/users`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Manager/Admin | List all users |
| POST | `/` | Admin | Create a user |
| PUT | `/:id` | Admin | Update a user |
| DELETE | `/:id` | Admin | Delete a user |

---

## 📸 Pages Overview

| Page | Role |
|---|---|
| 🌐 Landing Page | Public |
| 🔑 Login / Register | Public |
| 📊 Employee Dashboard | Employee |
| 🗓️ Apply Leave / Leave History | Employee |
| 💸 Submit Expense / Expense History | Employee |
| 👔 Manager Dashboard | Manager |
| ✅ Leave & Expense Approvals | Manager |
| 👥 Employee Directory | Manager |
| 🛡️ Admin Dashboard | Admin |
| ⚙️ User Management (CRUD) | Admin |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">

**Built with ❤️ for modern teams.**

[⬆ Back to top](#-leaveloop)

</div>
