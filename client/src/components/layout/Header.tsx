import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Settings } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, setShowLoginModal, setShowSignUpModal } = useAuth();
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 w-full z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <Link href="/">
            <div className="text-primary font-bold text-xl cursor-pointer">
              <span className="font-heading">Empower<span className="text-accent">Her</span></span>
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-gray-700">
          <Link href="/">
            <a className={`hover:text-primary transition font-medium ${location === "/" ? "text-primary" : ""}`}>Home</a>
          </Link>
          <Link href="/marketplace">
            <a className={`hover:text-primary transition font-medium ${location === "/marketplace" ? "text-primary" : ""}`}>Browse Services</a>
          </Link>
          <Link href="/skill-verification">
            <a className={`hover:text-primary transition font-medium ${location === "/skill-verification" ? "text-primary" : ""}`}>Skill Verification</a>
          </Link>
          <a href="#success-stories" className="hover:text-primary transition font-medium">Success Stories</a>
          <a href="#about" className="hover:text-primary transition font-medium">About</a>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="hidden md:inline-flex">
                  Dashboard
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback className="bg-primary text-white">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>{user?.username}</div>
                    <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <div className="hidden md:block">
                <Button
                  variant="outline"
                  onClick={() => setShowLoginModal(true)}
                  className="text-primary border border-primary hover:bg-primary-light hover:text-white transition duration-200"
                >
                  Log in
                </Button>
              </div>
              <Button
                onClick={() => setShowSignUpModal(true)}
                className="bg-primary text-white hover:bg-primary-dark transition duration-200"
              >
                Sign up
              </Button>
            </>
          )}
          <button 
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4">
          <div className="flex flex-col space-y-3">
            <Link href="/">
              <a 
                className={`px-3 py-2 rounded-md ${location === "/" ? "bg-primary-light text-white" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
            </Link>
            <Link href="/marketplace">
              <a 
                className={`px-3 py-2 rounded-md ${location === "/marketplace" ? "bg-primary-light text-white" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Services
              </a>
            </Link>
            <Link href="/skill-verification">
              <a 
                className={`px-3 py-2 rounded-md ${location === "/skill-verification" ? "bg-primary-light text-white" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Skill Verification
              </a>
            </Link>
            <a 
              href="#success-stories"
              className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Success Stories
            </a>
            <a 
              href="#about"
              className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            {!isAuthenticated && (
              <Button
                onClick={() => {
                  setShowLoginModal(true);
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full justify-center"
              >
                Log in
              </Button>
            )}
            {isAuthenticated && (
              <Link href="/dashboard">
                <Button 
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
