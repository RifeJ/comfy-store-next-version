"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  IoShieldCheckmarkOutline,
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { FaGoogle, FaApple } from "react-icons/fa6";

function Login() {
  const navigate = useRouter();

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const response = await fetch(
        "https://comfystorebackend-production.up.railway.app/api/auth/local",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: data.email,
            password: data.password,
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.jwt);

        toast.success("You successfully logged in");

        window.location.href = "/";
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Server connection failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-300 p-4 md:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-base-300 bg-card">
        <div className="bg-base-200 p-8 md:p-12 flex flex-col justify-between space-y-12">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-base-content text-base-100 flex items-center justify-center font-black text-xl shadow-md transition-all duration-300 hover:brightness-90">
              <Link href="/">c</Link>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight text-base-content">
                ComfyStore
              </h3>
              <p className="text-xs text-base-content/60">Design Studio</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-base-300/60 border border-base-content/5 px-3 py-1.5 rounded-full text-xs font-medium text-base-content/80 backdrop-blur-sm w-fit">
              <IoShieldCheckmarkOutline className="text-success" size={14} />
              Secure member access
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-base-content leading-tight">
              Welcome back to your furniture studio.
            </h1>
            <p className="text-sm text-base-content/70 leading-relaxed max-w-sm">
              Sign in to manage your saved items, continue shopping, and access
              your account with a clean and focused experience.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-base-300/40 border border-base-content/5 rounded-xl p-4 backdrop-blur-xs">
              <p className="text-[10px] uppercase tracking-wider text-base-content/50 font-bold mb-1">
                Experience
              </p>
              <p className="text-sm font-semibold text-base-content">
                Fast checkout
              </p>
            </div>
            <div className="bg-base-300/40 border border-base-content/5 rounded-xl p-4 backdrop-blur-xs">
              <p className="text-[10px] uppercase tracking-wider text-base-content/50 font-bold mb-1">
                Access
              </p>
              <p className="text-sm font-semibold text-base-content">
                Saved favorites
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center bg-base-100">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-widest text-base-content/40 font-bold mb-1">
              Account Login
            </p>
            <h2 className="text-2xl font-bold text-base-content">Sign in</h2>
            <p className="text-sm text-base-content/60 mt-1">
              Enter your details below to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-base-content/70 mb-2">
                Email address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/40">
                  <IoMailOutline size={18} />
                </span>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3 bg-secondary text-base-content border border-base-content/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm placeholder:text-base-content/30 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-base-content/70 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/40">
                  <IoLockClosedOutline size={18} />
                </span>
                <input
                  {...register("password", { required: true })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-12 py-3 bg-secondary text-base-content border border-base-content/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm placeholder:text-base-content/30 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-base-content/40 hover:text-base-content transition-colors">
                  {showPassword ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs rounded-md border-base-content/30 checked:bg-primary"
                />
                <span className="text-xs text-base-content/70">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => toast.info("Password recovery coming soon!")}
                className="text-xs font-medium text-base-content/70 hover:text-base-content transition-colors underline underline-offset-4">
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-content hover:opacity-95 font-semibold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] text-sm mt-2 flex items-center justify-center disabled:opacity-50">
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-content border-t-transparent"></div>
              ) : (
                "Sign In"
              )}
            </button>

            <button
              type="button"
              onClick={() => toast.warning("Guest user not available!")}
              className="w-full bg-secondary text-secondary-content hover:bg-base-300/50 font-semibold py-3.5 rounded-xl transition-all text-sm active:scale-[0.99]">
              Guest User
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-base-content/10"></div>
            </div>
            <span className="relative bg-base-100 px-3 text-[10px] font-bold uppercase tracking-widest text-base-content/40">
              Or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toast.info("Google login coming soon!")}
              className="flex items-center justify-center gap-2 border border-base-content/10 hover:bg-secondary bg-base-100 text-base-content text-xs font-semibold py-3 rounded-xl transition-all active:scale-[0.98]">
              <FaGoogle size={14} />
              Google
            </button>
            <button
              type="button"
              onClick={() => toast.info("Apple login coming soon!")}
              className="flex items-center justify-center gap-2 border border-base-content/10 hover:bg-secondary bg-base-100 text-base-content text-xs font-semibold py-3 rounded-xl transition-all active:scale-[0.98]">
              <FaApple size={14} />
              Apple
            </button>
          </div>

          <p className="text-xs text-center text-base-content/60 mt-8">
            Not a member yet?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline underline-offset-4 ml-1">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
