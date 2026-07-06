"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
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
    <div>
      <section className="h-screen grid place-items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4">
          <h4 className="text-center text-3xl font-bold">Register</h4>

          {/* USERNAME */}
          <div className="form-control">
            <label className="label px-2">
              <span className="label-text capitalize">Username</span>
            </label>
            <input
              {...register("username")}
              type="text"
              className={`input input-bordered ${errors.username ? "input-error" : ""}`}
            />
            {errors.username && (
              <span className="text-error text-sm mt-1">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* EMAIL */}
          <div className="form-control">
            <label className="label px-2">
              <span className="label-text capitalize">Email</span>
            </label>
            <input
              {...register("email")}
              type="email"
              className={`input input-bordered ${errors.email ? "input-error" : ""}`}
            />
            {errors.email && (
              <span className="text-error text-sm mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="form-control">
            <label className="label px-2">
              <span className="label-text capitalize">Password</span>
            </label>
            <input
              {...register("password")}
              type="password"
              className={`input input-bordered ${errors.password ? "input-error" : ""}`}
            />
            {errors.password && (
              <span className="text-error text-sm mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          <button className="btn btn-primary btn-block mt-4 uppercase">
            Register
          </button>

          <p className="text-center">
            Already a member?
            <Link href="/login" className="text-primary ml-3">
              Login
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
