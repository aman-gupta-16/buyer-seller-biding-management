"use client";

import React, { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";

export default function Navbar() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!!token);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      setIsLogin(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BidConnect</span>
          </a>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isLogin ? (
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-white/10"
              >
                Sign out
              </button>
            ) : (
              <a
                href="/login"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-white/10"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}