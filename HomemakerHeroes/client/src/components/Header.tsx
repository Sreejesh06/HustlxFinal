import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";


export default function Header() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  const navItems = [
    { label: "Marketplace", href: "/marketplace", icon: "ri-store-2-line" },
    { label: "Find Mentors", href: "/find-mentors", icon: "ri-user-star-line" },
    { label: "Learn", href: "#", icon: "ri-book-open-line" },
    { label: "Success Stories", href: "/success-stories", icon: "ri-award-line" },
    { label: "Resources", href: "#", icon: "ri-folder-info-line" }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-headings font-bold text-primary">Hustlx</span>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-1">
          {navItems.map(item => (
            <Link 
              key={item.label}
              href={item.href} 
              className="px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100 font-medium text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative hidden md:block">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="w-40 lg:w-52 pl-8 pr-4 py-1.5 rounded-full text-sm"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"></i>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="text-neutral-600 hover:bg-neutral-100 rounded-full">
                <i className="ri-notification-3-line text-xl"></i>
              </Button>
              <Button variant="ghost" size="icon" className="text-neutral-600 hover:bg-neutral-100 rounded-full">
                <i className="ri-message-3-line text-xl"></i>
              </Button>
              <Link href="/dashboard">
                <Avatar className="w-9 h-9 border-2 border-primary cursor-pointer">
                  <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                  <AvatarFallback className="bg-primary-light text-primary font-medium">
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                className="hidden md:flex text-neutral-700 hover:bg-neutral-100"
                onClick={() => navigate("/login")}
              >
                Log In
              </Button>
              <Button 
                className="bg-primary hover:bg-primary-dark text-white"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </div>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-neutral-600 hover:bg-neutral-100 rounded-md">
                <i className="ri-menu-line text-xl"></i>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-4/5 max-w-xs p-0">
              <div className="flex justify-between items-center py-5 px-4 border-b border-neutral-200">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-headings font-bold text-primary">Hustlx</span>
                </Link>
              </div>
              
              <div className="py-4">
                {navItems.map(item => (
                  <Link 
                    key={item.label}
                    href={item.href} 
                    className="flex items-center p-3 rounded-md hover:bg-neutral-100"
                  >
                    <i className={`${item.icon} text-neutral-600 mr-3 text-lg`}></i>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                {isAuthenticated ? (
                  <>
                    <div className="border-t border-neutral-200 pt-4 mt-2">
                      <Link href="/dashboard" className="flex items-center p-3 rounded-md hover:bg-neutral-100">
                        <i className="ri-dashboard-line text-neutral-600 mr-3 text-lg"></i>
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      <Link href="/profile-setup" className="flex items-center p-3 rounded-md hover:bg-neutral-100">
                        <i className="ri-settings-3-line text-neutral-600 mr-3 text-lg"></i>
                        <span className="font-medium">Account Settings</span>
                      </Link>
                      <button 
                        className="w-full flex items-center p-3 rounded-md hover:bg-neutral-100"
                        onClick={logout}
                      >
                        <i className="ri-logout-box-line text-neutral-600 mr-3 text-lg"></i>
                        <span className="font-medium">Log Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-neutral-200 pt-4 mt-2 px-3 space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate("/login")}
                    >
                      Log In
                    </Button>
                    <Button 
                      className="w-full bg-primary hover:bg-primary-dark text-white"
                      onClick={() => navigate("/register")}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Mobile progress bar for authenticated users */}
      {isAuthenticated && (
        <div className="md:hidden w-full px-4 py-2 bg-neutral-50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-neutral-600">Profile Completion</span>
            <span className="text-xs font-medium text-primary">{user?.profileCompletionPercentage || 65}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${user?.profileCompletionPercentage || 65}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
