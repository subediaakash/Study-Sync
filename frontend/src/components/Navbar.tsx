import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Clock, User, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom, api } from "../auth/atom";
import Cookies from "js-cookie";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  type User = {
    name: string;
    email: string;
  };

  const [user, setUser] = useAtom(authAtom) as [
    User | null,
    React.Dispatch<React.SetStateAction<User | null>>
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      setUser(null);
      Cookies.remove("auth_token");

      navigate("/signup");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const capitalizedName = user?.name
    ? capitalizeFirstLetter(user.name.split(" ")[0])
    : "";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 shadow-md backdrop-blur-md py-2"
          : "bg-white/80 backdrop-blur-sm py-3"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Clock className="h-6 w-6 text-theme-blue-dark transition-transform group-hover:rotate-12" />
          <span className="text-xl font-bold bg-gradient-to-r from-theme-blue-dark to-theme-blue-medium bg-clip-text text-transparent">
            Study Sync
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-8">
          {!user && (
            <>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How It Works</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
            </>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-theme-blue-medium text-theme-blue-medium hover:bg-theme-blue-medium hover:text-white transition-colors"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-theme-blue-medium hover:bg-theme-blue-dark text-white transition-all hover:shadow-lg">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-theme-blue-dark hover:bg-theme-blue-light/30 transition"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">{capitalizedName}</span>
                </Button>
              </Link>
              <LogoutConfirmDialog handleLogout={handleLogout} />
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-theme-blue-light"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-[64px] bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-96 border-t" : "max-h-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            {!user && (
              <>
                <MobileNavLink
                  href="#features"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </MobileNavLink>
                <MobileNavLink
                  href="#how-it-works"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </MobileNavLink>
                <MobileNavLink
                  href="#pricing"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </MobileNavLink>
              </>
            )}
          </div>

          <div className="flex flex-col space-y-3 pt-2 border-t border-gray-100">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-theme-blue-medium text-theme-blue-medium hover:bg-theme-blue-medium hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-theme-blue-medium hover:bg-theme-blue-dark text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center gap-2 text-theme-blue-dark hover:bg-theme-blue-light/30 transition"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">{capitalizedName}</span>
                  </Button>
                </Link>
                <LogoutConfirmDialog
                  handleLogout={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  fullWidth
                />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-sm font-medium text-gray-700 hover:text-theme-blue-medium transition-colors relative py-2 px-3 rounded-md hover:bg-gray-50 group"
  >
    {children}
    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-theme-blue-medium transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
  </a>
);

const MobileNavLink = ({ href, onClick, children }) => (
  <a
    href={href}
    onClick={onClick}
    className="flex items-center justify-between p-3 text-gray-700 hover:text-theme-blue-medium hover:bg-blue-50/50 rounded-lg transition-colors"
  >
    <span className="font-medium">{children}</span>
    <ChevronDown className="h-4 w-4 opacity-70" />
  </a>
);
const LogoutConfirmDialog = ({ handleLogout, fullWidth = false }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="destructive"
        className={`flex items-center gap-2 ${
          fullWidth ? "w-full" : "rounded-full px-4 py-2"
        } bg-red-500 hover:bg-red-600 text-white`}
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default Navbar;
