"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { WiStars } from "react-icons/wi";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    setUser(null);

    router.push("/");
    window.location.reload();
  };

  return (
    <div className="bg-primary text-neutral-content">
      <div className="flex gap-x-5 justify-between items-center px-6   min-h-10 text-primary">
        <p className="text-[12px]/[20px] flex justify-center items-center text-primary-content">
          <WiStars size={30} fill="orange" />
          Premium Handcrafted Furniture • Free Worldwide Shipping
        </p>
        {isMounted &&
          (user ? (
            <div className="flex justify-center items-center gap-3 text-primary-content">
              <p className="text-[12px]/[20px]">Hello, {user.username}</p>
              <div className="h-3 w-px bg-primary"></div>
              <button
                onClick={handleLogout}
                className="text-[12px]/[20px] hover:underline cursor-pointer flex justify-center items-center gap-2">
                Log out
                <FaArrowRightFromBracket />
              </button>
            </div>
          ) : (
            <div className="flex gap-3 text-primary-content">
              <Link
                href="/login"
                className="text-[12px]/[20px] hover:underline cursor-pointer">
                Sign in / Guest
              </Link>
              <div className="h-3 w-px bg-primary"></div>
              <Link
                href="/register"
                className="text-[12px]/[20px] hover:underline cursor-pointer">
                Create Account
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
