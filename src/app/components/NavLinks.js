"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaMoon } from "react-icons/fa6";
import { IoSunny, IoMenu } from "react-icons/io5";
import { TbSquareLetterXFilled } from "react-icons/tb";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Cart", href: "/cart" },
];

export default function NavLinks() {
  const pathname = usePathname();

  const [theme, setTheme] = useState("winter");
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const changeTheme = () => {
    const nextTheme = theme === "winter" ? "dracula" : "winter";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  useEffect(() => {
    setIsMounted(true);

    const storedTheme = localStorage.getItem("theme") || "winter";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="bg-base-200">
      <div className="mx-auto! max-w-6xl px-8! py-2! flex justify-between items-center min-h-16 w-full">
        <div className="bg-primary hover:brightness-88 duration-300 ease-in border-[0.8px] border-solid border-primary rounded-lg px-4! nav-links-logo cursor-pointer max-lg:hidden">
          <Link href="/">
            <span className="uppercase text-[#dbe1ff] text-3xl leading-[46.4px] font-bold">
              C
            </span>
          </Link>
        </div>

        <button
          className="lg:hidden p-2 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu">
          {isMenuOpen ? (
            <TbSquareLetterXFilled size={24} />
          ) : (
            <IoMenu size={24} />
          )}
        </button>

        <div>
          <ul className="hidden lg:flex space-x-2">
            {navigationLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-[14px]/[20px] py-2! px-4! rounded-lg transition-colors inline-block ${
                      isActive
                        ? "bg-base-300 font-semibold active"
                        : "hover:bg-base-300/50"
                    }`}>
                    {link.name}
                  </Link>
                </li>
              );
            })}

            {isMounted && user && (
              <li>
                <Link
                  href="/checkout"
                  className={`text-[14px]/[20px] py-2! px-4! rounded-lg transition-colors inline-block ${
                    pathname === "/checkout"
                      ? "bg-base-300 font-semibold active"
                      : "hover:bg-base-300/50"
                  }`}>
                  Checkout
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="flex items-center">
          <div>
            <button
              className="cursor-pointer p-2 hover:bg-base-300 rounded-full transition-colors"
              aria-label="Toggle theme"
              onClick={changeTheme}>
              {isMounted &&
                (theme === "winter" ? (
                  <FaMoon size={20} />
                ) : (
                  <IoSunny size={20} />
                ))}
            </button>
          </div>

          <div className="ml-4!">
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="hover:text-primary transition-colors">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-base-200 border-t border-base-300 p-4 flex flex-col gap-2">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block p-2 rounded-lg ${
                pathname === link.href ? "bg-base-300 font-semibold active" : ""
              }`}>
              {link.name}
            </Link>
          ))}

          {isMounted && user && (
            <Link
              href="/checkout"
              onClick={() => setIsMenuOpen(false)}
              className={`block p-2 rounded-lg ${
                pathname === "/checkout"
                  ? "bg-base-300 font-semibold active"
                  : ""
              }`}>
              Checkout
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
