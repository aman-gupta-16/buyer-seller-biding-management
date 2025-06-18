import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (

    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Toaster
        position="top-right"
        reverseOrder={false}
      />
        <Navbar />
        <main className="pt-20 px-4">{children}</main>
      </body>
    </html>
  );
}
