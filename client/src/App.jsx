import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Landing
import Landing from './pages/Landing';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import Profile from './pages/employee/Profile';
import ApplyLeave from './pages/employee/ApplyLeave';
import LeaveHistory from './pages/employee/LeaveHistory';
import SubmitReimbursement from './pages/employee/SubmitReimbursement';
import ReimbursementHistory from './pages/employee/ReimbursementHistory';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import LeaveApproval from './pages/manager/LeaveApproval';
import ReimbursementApproval from './pages/manager/ReimbursementApproval';
import EmployeeList from './pages/manager/EmployeeList';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Employee */}
          <Route path="/employee" element={<ProtectedRoute roles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/employee/profile" element={<ProtectedRoute roles={['employee']}><Profile /></ProtectedRoute>} />
          <Route path="/employee/apply-leave" element={<ProtectedRoute roles={['employee']}><ApplyLeave /></ProtectedRoute>} />
          <Route path="/employee/leave-history" element={<ProtectedRoute roles={['employee']}><LeaveHistory /></ProtectedRoute>} />
          <Route path="/employee/submit-reimbursement" element={<ProtectedRoute roles={['employee']}><SubmitReimbursement /></ProtectedRoute>} />
          <Route path="/employee/reimbursement-history" element={<ProtectedRoute roles={['employee']}><ReimbursementHistory /></ProtectedRoute>} />

          {/* Manager */}
          <Route path="/manager" element={<ProtectedRoute roles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/manager/leave-approval" element={<ProtectedRoute roles={['manager']}><LeaveApproval /></ProtectedRoute>} />
          <Route path="/manager/reimbursement-approval" element={<ProtectedRoute roles={['manager']}><ReimbursementApproval /></ProtectedRoute>} />
          <Route path="/manager/employees" element={<ProtectedRoute roles={['manager']}><EmployeeList /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
