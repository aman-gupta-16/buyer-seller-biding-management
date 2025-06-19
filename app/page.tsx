"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ArrowRight } from "lucide-react";

interface DecodedToken {
  role: string;
  exp:any;
}

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState("");

useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log(decoded)
      const currentTime = Math.floor(Date.now() / 1000); 
      if (decoded.exp && decoded.exp < currentTime) {
        console.warn("Token expired");
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      setRole(decoded.role.toUpperCase());
    } catch (error) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      router.push("/login");
    }
  } else {
    setRole("");
  }
}, [router]);


  let href = "/login";
  let buttonText = "Go to Login";

  if (role === "BUYER") {
    href = "/buyer/dashboard";
    buttonText = "Go to Buyer Dashboard";
  } else if (role === "SELLER") {
    href = "/seller/dashboard";
    buttonText = "Go to Seller Dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-purple-100 to-white p-8">
      <div className="max-w-3xl bg-white shadow-2xl rounded-3xl p-10 text-center">
        <h1 className="text-4xl font-bold mb-6 text-purple-700">Welcome to Project Bidding Platform</h1>
        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
          Connect buyers and sellers seamlessly. Start bidding, collaborating, and delivering projects efficiently.
        </p>
        <a
          href={href}
          className="group inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        >
          {buttonText}
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}
