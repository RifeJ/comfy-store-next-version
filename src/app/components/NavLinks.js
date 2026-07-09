"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaMoon } from "react-icons/fa6";
import { IoSunny, IoMenu } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { TbSquareLetterXFilled } from "react-icons/tb";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Cart", href: "/cart" },
];

export default function NavLinks() {
  const pathname = usePathname();

  const [theme, setTheme] = useState("layt");
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const changeTheme = () => {
    const nextTheme = theme === "layt" ? "bleck" : "layt";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  useEffect(() => {
    setIsMounted(true);

    const storedTheme = localStorage.getItem("theme") || "layt";
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
    <div className="bg-base-100 border-b border-primary/20 sticky top-0 z-999">
      <div className="mx-auto max-w-7xl px-8! py-5 flex justify-between items-center min-h-16 w-full">
        <div className="flex justify-center items-center gap-2.5 max-lg:hidden">
          <div className="bg-primary hover:brightness-88 duration-300 ease-in border-[0.8px] border-solid border-primary rounded-xl size-10 text-center nav-links-logo cursor-pointer ">
            <Link href="/">
              <span className=" text-primary-content text-2xl font-black">
                c
              </span>
            </Link>
          </div>
          <div>
            <h1 className="font-bold text-sm">ComfyStore</h1>
            <p className="text-[12px]">Design Studio</p>
          </div>
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
          <ul className="hidden lg:flex space-x-2 bg-nav/70 shadow-sm p-1.5 rounded-3xl">
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
            {isMounted && user && (
              <li>
                <Link
                  href="/order"
                  className={`text-[14px]/[20px] py-2! px-4! rounded-lg transition-colors inline-block ${
                    pathname === "/order"
                      ? "bg-base-300 font-semibold active"
                      : "hover:bg-base-300/50"
                  }`}>
                  Orders
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            className="flex items-center justify-center h-10 w-10 cursor-pointer hover:bg-base-300 rounded-full transition-colors"
            aria-label="Toggle theme"
            onClick={changeTheme}>
            {isMounted &&
              (theme === "layt" ? <FaMoon size={20} /> : <IoSunny size={20} />)}
          </button>

          <Link
            href="/favorites"
            className="flex items-center justify-center h-10 w-10 cursor-pointer hover:bg-base-300 rounded-full transition-colors text-current"
            aria-label="Favorites">
            <FaRegStar size={20} />
          </Link>

          <Link
            href="/cart"
            className="flex items-center justify-center h-10 w-10 cursor-pointer hover:bg-base-300 rounded-full transition-colors text-current"
            aria-label="Shopping Cart">
            <FiShoppingCart size={21} />
          </Link>
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
          {isMounted && user && (
            <Link
              href="/order"
              onClick={() => setIsMenuOpen(false)}
              className={`block p-2 rounded-lg ${
                pathname === "/order" ? "bg-base-300 font-semibold active" : ""
              }`}>
              Order
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
