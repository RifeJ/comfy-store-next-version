"use client";

import { useRouter } from "next/navigation";

export default function ServerErrorBlock() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h1 className="text-3xl font-bold text-base-content">
        Server issues! [500]
      </h1>
      <button
        onClick={() => window.location.reload()}
        className="btn btn-primary btn-md rounded-lg">
        Try Again
      </button>
    </div>
  );
}
