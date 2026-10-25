"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "918298922623";

export default function WhatsAppWidget() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi EVWheels! I have a question.")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 sm:bottom-6 right-5 sm:right-6 z-50 w-12 h-12 bg-[#25D366] flex items-center justify-center shadow-lg hover:bg-[#1ebe5d] transition-colors group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={22} className="text-white" />
      <span className="absolute right-full mr-3 bg-white text-neutral-800 text-[12px] font-semibold px-3 py-2 shadow-md border border-neutral-100 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        Chat with us
      </span>
    </a>
  );
}
