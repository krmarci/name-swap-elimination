
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "./LoginDialog";
import { useNames } from "@/context/NameContext";
import { useAuth } from "@/hooks/use-auth";

const NavBar = () => {
  const location = useLocation();
  const { currentGroup } = useNames();
  const { user } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link to="/" className="font-semibold text-lg flex items-center gap-2">
          <span className="text-primary">NameSwap</span>
          {currentGroup && <span className="text-xs bg-primary/20 px-2 py-1 rounded-full">Group Mode</span>}
        </Link>

        <div className="flex gap-1 sm:gap-2 items-center">
          <div className="flex gap-0.5 sm:gap-1 items-center">
            <Button 
              variant={isActive("/") ? "default" : "ghost"} 
              size="sm" 
              asChild
            >
              <Link to="/">Home</Link>
            </Button>
            <Button 
              variant={isActive("/boys") ? "default" : "ghost"} 
              size="sm" 
              asChild
            >
              <Link to="/boys">Boys</Link>
            </Button>
            <Button 
              variant={isActive("/girls") ? "default" : "ghost"} 
              size="sm" 
              asChild
            >
              <Link to="/girls">Girls</Link>
            </Button>
            
            {user && (
              <>
                <Button 
                  variant={isActive("/rankings") ? "default" : "ghost"} 
                  size="sm" 
                  asChild
                >
                  <Link to="/rankings">Rankings</Link>
                </Button>
                <Button 
                  variant={isActive("/groups") ? "default" : "ghost"} 
                  size="sm" 
                  asChild
                >
                  <Link to="/groups">Groups</Link>
                </Button>
              </>
            )}
          </div>
          
          <LoginDialog />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
