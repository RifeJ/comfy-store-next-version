"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

const AdminFab = () => {
  const navigate = useRouter();
  const [isGlitching, setIsGlitching] = useState(false);

  const handleAdminEnter = () => {
    setIsGlitching(true);

    setTimeout(() => {
      setIsGlitching(false);
      navigate.push("/admin");
    }, 1500);
  };

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role === "admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error parsing user for AdminFab:", error);
      }
    }
  }, []);

  if (!isAdmin) return null;

  return (
    <>
      {isGlitching && (
        <div className="fixed inset-0 z-9999 glitch-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="scanline"></div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-4">
            ACCESSING SYSTEM...
          </h1>
          <div className="text-xl font-mono">
            {">"} BYPASSING FIREWALLS... <br />
            {">"} ENCRYPTING DATA... <br />
            {">"} WELCOME, ROOT_USER
          </div>
        </div>
      )}

      {!isGlitching && (
        <div
          onClick={handleAdminEnter}
          className="fixed bottom-8 right-8 z-100 group cursor-pointer">
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#FF69B4] text-white px-3 py-1 rounded-md text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg">
            SYSTEM CONTROL
          </span>
          <div className="bg-[#FF69B4] text-white p-4 rounded-full shadow-[0_0_20px_rgba(255,105,180,0.4)] hover:scale-110 transition-all flex items-center justify-center">
            <HiOutlineAdjustmentsHorizontal className="w-7 h-7 stroke-2" />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminFab;
