
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Github, Loader2, LogIn, LogOut, User, UserRound } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export function LoginDialog() {
  const { user, login, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = async (provider: "google" | "github") => {
    await login(provider);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {user ? (
            <>
              <UserRound className="h-4 w-4" />
              {user.name || 'User'}
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Login
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {user ? "Account" : "Login to NameSwap"}
          </DialogTitle>
          <DialogDescription>
            {user 
              ? "Manage your account"
              : "Login to save your preferences and rankings across devices."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || "User"}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="text-xs px-2 py-1 rounded bg-gray-100">
                  {user.provider || "Local"}
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={isLoading}
                onClick={() => handleLogin("google")}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
                )}
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={isLoading}
                onClick={() => handleLogin("github")}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                Continue with GitHub
              </Button>
              
              <div className="text-center text-xs text-gray-500 mt-2">
                <p>
                  By logging in, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
