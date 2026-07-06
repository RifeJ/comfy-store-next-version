"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FiShield } from "react-icons/fi";

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

  const { register, handleSubmit } = useForm();

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
    <section className="max-w-7xl w-full mx-auto h-screen grid grid-cols-2 justify-center items-center">
      <div className="bg-card flex flex-col justify-center">
        <div className="flex items-center gap-2.5 max-lg:hidden">
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
        <div className="flex items-center bg-primary-content p-2">
          <FiShield />
          Secure member access
        </div>
      </div>
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
