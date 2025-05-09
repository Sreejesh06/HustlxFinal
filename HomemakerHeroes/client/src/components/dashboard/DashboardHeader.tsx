import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ListingForm from "@/components/forms/ListingForm";

interface DashboardHeaderProps {
  user: User;
  profileCompletion: number;
}

export default function DashboardHeader({ user, profileCompletion }: DashboardHeaderProps) {
  const [, navigate] = useLocation();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-headings font-bold text-neutral-800 mb-2">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-neutral-600">Let's continue building your skills and growing your business.</p>
      </div>
      
      <div className="mt-4 md:mt-0 flex flex-col md:items-end">
        <div className="hidden md:block mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-neutral-600 mr-3">Profile Completion</span>
            <span className="text-sm font-medium text-primary">{profileCompletion}%</span>
          </div>
          <div className="progress-bar w-52">
            <div className="progress-fill" style={{ width: `${profileCompletion}%` }}></div>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-2 md:mt-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md shadow-sm flex items-center">
                <i className="ri-add-line mr-1.5"></i> Add New Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
              <ListingForm userId={user.id} />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline"
            className="px-4 py-2 text-sm font-medium text-secondary border border-secondary hover:bg-secondary hover:text-white rounded-md flex items-center"
            onClick={() => navigate("/profile-setup")}
          >
            <i className="ri-user-settings-line mr-1.5"></i> Complete Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
