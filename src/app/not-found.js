import React from "react";
import Link from "next/link";

function NotFoundPage() {
  return (
    <div className="fixed top-0 h-screen w-screen flex flex-col items-center justify-center gap-2.5">
      <h1 className="text-5xl font-extrabold">Page Not Found</h1>
      <Link href={"/"} className="text-[#057AFF] hover:underline">
        Back To Main Page
      </Link>
    </div>
  );
}

export default NotFoundPage;
