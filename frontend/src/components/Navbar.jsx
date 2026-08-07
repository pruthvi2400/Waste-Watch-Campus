import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Trophy, User as UserIcon, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
              <Trash2 className="h-6 w-6 text-emerald-200" />
              <span>Waste Watch Campus</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/leaderboard"
              className="flex items-center space-x-1 hover:text-emerald-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </Link>

            {user && user.user_type === 'cleaning_staff' && (
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 bg-emerald-700 hover:bg-emerald-800 px-3 py-2 rounded-md text-sm font-medium transition-colors font-bold text-amber-200"
              >
                <span>Task Dashboard</span>
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 hover:text-emerald-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Profile ({user.username})</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-emerald-700 hover:bg-emerald-800 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 hover:text-emerald-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 bg-white text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
