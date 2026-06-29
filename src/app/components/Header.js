"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <div className="bg-neutral text-neutral-content">
      <div className="flex gap-x-6 justify-end items-center py-2 px-8 mx-auto max-w-6xl min-h-10">
        {isMounted &&
          (user ? (
            <>
              <p className="text-[14px]/[20px]">Hello, {user.username}</p>
              <button
                onClick={handleLogout}
                className="text-[14px]/[20px] hover:underline cursor-pointer">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[14px]/[20px] hover:underline cursor-pointer">
                Sign in / Guest
              </Link>

              <Link
                href="/register"
                className="text-[14px]/[20px] hover:underline cursor-pointer">
                Create Account
              </Link>
            </>
          ))}
      </div>
    </div>
  );
}
