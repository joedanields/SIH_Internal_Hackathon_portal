import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Award, Users, BarChart3, Settings, LogOut } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('sih_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sih_user');
    setCurrentUser(null);
    window.location.href = createPageUrl('Landing');
  };

  // Don't show layout for landing page
  if (currentPageName === 'Landing') {
    return children;
  }

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">SIH Internal Hackathon</h1>
                  <p className="text-xs text-slate-500 -mt-1">KGiSL Institute of Technology</p>
                </div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {currentUser?.role === 'judge' && (
                <>
                  <Link
                    to={createPageUrl("JudgeDashboard")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === createPageUrl("JudgeDashboard")
                        ? "bg-blue-100 text-blue-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Users className="w-4 h-4 inline mr-2" />
                    Teams
                  </Link>
                </>
              )}
              
              {isAdmin && (
                <>
                  <Link
                    to={createPageUrl("AdminDashboard")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === createPageUrl("AdminDashboard")
                        ? "bg-blue-100 text-blue-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 inline mr-2" />
                    Leaderboard
                  </Link>
                  <Link
                    to={createPageUrl("ManageTeams")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === createPageUrl("ManageTeams")
                        ? "bg-blue-100 text-blue-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Settings className="w-4 h-4 inline mr-2" />
                    Manage
                  </Link>
                </>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white/50 backdrop-blur-sm border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-600">
                Developed by <span className="font-semibold text-blue-600">IPS Tech Community</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                KGiSL Institute of Technology • Smart India Hackathon Portal
              </p>
            </div>
            <div className="text-xs text-slate-400">
              © 2025 All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}