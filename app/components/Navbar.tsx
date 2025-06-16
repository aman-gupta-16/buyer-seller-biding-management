"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const isBuyer = pathname.startsWith("/buyer");
  const isSeller = pathname.startsWith("/seller");

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Link href="/" className="text-xl font-bold">Project Bidding</Link>
      <div className="flex gap-4">
        {isBuyer && (
          <>
            <Link href="/buyer/dashboard">Dashboard</Link>
          </>
        )}
        {isSeller && (
          <>
            <Link href="/seller/dashboard">Dashboard</Link>
          </>
        )}
        <Link href="/">Home</Link>
      </div>
    </nav>
  );
};

export default Navbar;
