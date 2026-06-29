"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function Login() {
  const navigate = useRouter();
  const [theme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const { register, handleSubmit } = useForm();

  const handleLogin = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          identifier: data.email,
          password: data.password,
        }),
      });

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
    <section className="h-screen grid place-items-center">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4">
        <h4 className="text-center text-3xl font-bold">Login</h4>

        <div className="form-control">
          <label className="label px-2">
            <span className="label-text capitalize">Email</span>
          </label>

          <input
            {...register("email", { required: true })}
            type="text"
            className="input input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label px-2">
            <span className="label-text capitalize">Password</span>
          </label>

          <input
            {...register("password", { required: true })}
            type="password"
            className="input input-bordered"
          />
        </div>

        <button
          type="submit"
          className="btn btn-lg btn-primary btn-block mt-4 uppercase text-[14px]">
          login
        </button>

        <button
          type="button"
          onClick={() => toast.warning("Guest user not available!")}
          className="btn btn-lg btn-secondary btn-block uppercase text-[14px]">
          guest user
        </button>

        <p className="text-center">
          Not a member yet?
          <Link href="/register" className="text-primary ml-3">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
