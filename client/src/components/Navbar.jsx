import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, LogIn, LayoutDashboard } from "lucide-react";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 text-blue-600 hover:opacity-80 transition-opacity">
          <BookOpen className="fill-current" size={24} />
          <span className="hidden sm:inline">MedMastery</span>
          <span className="sm:hidden">MedMastery</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/quiz" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium text-sm sm:text-base">
            Quiz
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium text-sm sm:text-base">
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Admin</span>
              </Link>
              <button onClick={handleLogoutClick} className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium text-sm sm:text-base ml-2">
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
