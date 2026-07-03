"use client";

import { useState } from "react";
import { SlSocialFacebook } from "react-icons/sl";
import { SiGmail } from "react-icons/si";
import { FaWhatsapp } from "react-icons/fa";
import { ImEmbed2 } from "react-icons/im";
import { IoMdShare } from "react-icons/io";

interface ShareButtonProps {
  title?: string;
  url?: string;
}

export default function ShareButton({
  title = "Check this out!",
  url,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  const socialShares = [
    { name: "Embed", icon: <ImEmbed2 />, url: ``, isEmbed: true },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: <SlSocialFacebook />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "X",
      icon: "𝕏",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "Email",
      icon: <SiGmail />,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="min-h-11 px-5 py-3 rounded-xl bg-secondary border border-primary/5 font-semibold cursor-pointer text-primary flex items-center justify-center gap-2">
        <IoMdShare />
        Share
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#212121] text-white p-6 rounded-xl shadow-2xl border border-zinc-800 relative mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-normal">Share</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white text-xl p-1 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer">
                ✕
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 mb-6 scrollbar-thin scrollbar-thumb-zinc-700">
              {socialShares.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url || "#"}
                  target={platform.isEmbed ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  onClick={(e) => platform.isEmbed && e.preventDefault()}
                  className="flex flex-col items-center gap-2 min-w-16 group">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-xl group-hover:bg-zinc-700 transition-colors border border-zinc-700">
                    {platform.icon}
                  </div>
                  <span className="text-xs text-zinc-400 group-hover:text-white transition-colors">
                    {platform.name}
                  </span>
                </a>
              ))}
            </div>

            <div className="flex items-center bg-[#121212] border border-zinc-700 rounded-lg p-2 gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent flex-1 text-sm text-zinc-300 outline-none px-2 select-all truncate"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// experimental code use on your risk !
