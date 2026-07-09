"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Register() {
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        "https://comfystorebackend-production.up.railway.app/api/auth/local/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Account created! Please login.");
        setTimeout(() => navigate.push("/login"), 1000);
      } else if (response.status === 429) {
        const unbannedAt = result.unbannedAt
          ? new Date(result.unbannedAt).toLocaleString()
          : "later";
        toast.error(
          `Too many registration attempts. Try again after ${unbannedAt}`,
          { autoClose: 5000 },
        );
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Server is offline. Try again later.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-300 p-4">
      <div className="w-full max-w-105 bg-card border border-base-content/5 rounded-3xl shadow-2xl p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center text-base-content mb-10">
          Register
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-base-content/60 mb-1">
              Username
            </label>
            <input
              {...register("username")}
              type="text"
              placeholder="Enter your username"
              disabled={isSubmitting}
              className={`w-full bg-transparent border-b ${
                errors.username
                  ? "border-error"
                  : "border-base-content/20 focus:border-base-content"
              } py-2 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none transition-colors disabled:opacity-50`}
            />
            {errors.username && (
              <span className="text-error text-[11px] mt-1.5 font-medium">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-base-content/60 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              disabled={isSubmitting}
              className={`w-full bg-transparent border-b ${
                errors.email
                  ? "border-error"
                  : "border-base-content/20 focus:border-base-content"
              } py-2 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none transition-colors disabled:opacity-50`}
            />
            {errors.email && (
              <span className="text-error text-[11px] mt-1.5 font-medium">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-base-content/60 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              disabled={isSubmitting}
              className={`w-full bg-transparent border-b ${
                errors.password
                  ? "border-error"
                  : "border-base-content/20 focus:border-base-content"
              } py-2 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none transition-colors disabled:opacity-50`}
            />
            {errors.password && (
              <span className="text-error text-[11px] mt-1.5 font-medium">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-base-content text-base-100 font-bold tracking-wide py-3.5 rounded-xl transition-all active:scale-[0.98] hover:opacity-90 flex items-center justify-center disabled:opacity-70 shadow-md uppercase text-sm">
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-base-100 border-t-transparent"></div>
            ) : (
              "Register"
            )}
          </button>

          <p className="text-center text-xs text-base-content/60 mt-6">
            Already a member?{" "}
            <Link
              href="/login"
              className="font-bold text-base-content hover:underline underline-offset-4 ml-1">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
