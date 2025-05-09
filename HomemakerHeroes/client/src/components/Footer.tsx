import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <i className="ri-seedling-line text-white text-sm"></i>
              </div>
              <span className="text-lg font-headings font-bold text-neutral-800">SkillBloom</span>
            </Link>
            <p className="text-sm text-neutral-600 mb-4">
              Empowering homemakers to transform their talents into thriving businesses.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-neutral-500 hover:text-primary" aria-label="Facebook">
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary" aria-label="Instagram">
                <i className="ri-instagram-line text-lg"></i>
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary" aria-label="Twitter">
                <i className="ri-twitter-fill text-lg"></i>
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary" aria-label="Pinterest">
                <i className="ri-pinterest-fill text-lg"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-headings font-semibold text-neutral-800 mb-4">For Homemakers</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-neutral-600 hover:text-primary">How It Works</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Create a Listing</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Find Mentors</a></li>
              <li><Link href="/success-stories" className="text-neutral-600 hover:text-primary">Success Stories</Link></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Funding Options</a></li>
              <li><Link href="/skill-assessment" className="text-neutral-600 hover:text-primary">Skill Assessment</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-headings font-semibold text-neutral-800 mb-4">For Customers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/marketplace" className="text-neutral-600 hover:text-primary">Browse Services</Link></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Gift Cards</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">SkillBloom Guarantee</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Customer Reviews</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Support Local Homemakers</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-headings font-semibold text-neutral-800 mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-neutral-600 hover:text-primary">Help Center</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Business Guides</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Accessibility</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 mt-8 pt-6 flex flex-col md:flex-row md:items-center justify-between">
          <p className="text-sm text-neutral-500">© {new Date().getFullYear()} SkillBloom. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-neutral-500 hover:text-neutral-700">Privacy</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-neutral-700">Terms</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-neutral-700">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
