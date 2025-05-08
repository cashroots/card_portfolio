import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  HomeIcon,
  LayoutGridIcon,
  BarChartIcon,
  SettingsIcon,
  XIcon
} from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const [location] = useLocation();
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Sidebar for larger screens and mobile (conditionally shown) */}
      <aside className={cn(
        "md:flex md:flex-col w-64 bg-white border-r border-gray-200",
        "fixed inset-y-0 z-30 transition-transform duration-300 ease-in-out transform md:translate-x-0 md:static",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
          <h1 className="text-xl font-semibold text-gray-800">Card Collector</h1>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setMobileOpen(false)}
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-4">
            <li>
              <Link href="/">
                <a className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg",
                  location === "/" 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}>
                  <HomeIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/collection">
                <a className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg",
                  location === "/collection" 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}>
                  <LayoutGridIcon className="h-5 w-5" />
                  <span>My Collection</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg",
                  location === "/analytics" 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}>
                  <BarChartIcon className="h-5 w-5" />
                  <span>Analytics</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg",
                  location === "/settings" 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}>
                  <SettingsIcon className="h-5 w-5" />
                  <span>Settings</span>
                </a>
              </Link>
            </li>
          </ul>
          
          {/* Future eBay API integration section */}
          <div className="mt-8 px-4">
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-sm text-gray-600 mb-3">eBay API integration for price tracking and comparisons</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                In Development
              </span>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
