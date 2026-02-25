import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar title={title} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
