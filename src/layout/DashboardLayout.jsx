import { Outlet } from 'react-router-dom';
import SupportSidebar from './SupportSidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-900">
      <SupportSidebar />
      <main className="ml-72 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
