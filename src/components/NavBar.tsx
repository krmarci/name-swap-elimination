
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                NameSwap
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                  isActive("/")
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                Home
              </Link>
              <Link
                to="/boys"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                  isActive("/boys")
                    ? "border-boy text-boy"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                Boy Names
              </Link>
              <Link
                to="/girls"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                  isActive("/girls")
                    ? "border-girl text-girl"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                Girl Names
              </Link>
              <Link
                to="/rankings"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                  isActive("/rankings")
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                My Rankings
              </Link>
              <Link
                to="/groups"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                  isActive("/groups")
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                Groups
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={cn(
              "block pl-3 pr-4 py-2 text-base font-medium",
              isActive("/")
                ? "bg-primary-50 border-l-4 border-primary text-primary"
                : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            )}
          >
            Home
          </Link>
          <Link
            to="/boys"
            className={cn(
              "block pl-3 pr-4 py-2 text-base font-medium",
              isActive("/boys")
                ? "bg-boy-light border-l-4 border-boy text-boy"
                : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            )}
          >
            Boy Names
          </Link>
          <Link
            to="/girls"
            className={cn(
              "block pl-3 pr-4 py-2 text-base font-medium",
              isActive("/girls")
                ? "bg-girl-light border-l-4 border-girl text-girl"
                : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            )}
          >
            Girl Names
          </Link>
          <Link
            to="/rankings"
            className={cn(
              "block pl-3 pr-4 py-2 text-base font-medium",
              isActive("/rankings")
                ? "bg-primary-50 border-l-4 border-primary text-primary"
                : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            )}
          >
            My Rankings
          </Link>
          <Link
            to="/groups"
            className={cn(
              "block pl-3 pr-4 py-2 text-base font-medium",
              isActive("/groups")
                ? "bg-primary-50 border-l-4 border-primary text-primary"
                : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            )}
          >
            Groups
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
