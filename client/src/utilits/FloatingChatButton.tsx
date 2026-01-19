"use client";
import { useState } from "react";
import { FaWhatsapp, FaPhone, FaComments } from "react-icons/fa";

export default function FloatingChatButton() {
  const [open, setOpen] = useState(false);
  const whatsappNumber = "01786330022";
  const callNumber = "01786330011";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-2 flex flex-col gap-2 animate-fade-in">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg flex items-center transition"
            title="WhatsApp"
          >
            <FaWhatsapp size={22} />
          </a>
          <a
            href={`tel:${callNumber}`}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center transition"
            title="Call"
          >
            <FaPhone size={22} />
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-primary cursor-pointer hover:scale-110 transition duration-300 text-white rounded-full p-4 shadow-lg flex items-center"
        title="Chat"
      >
        <FaComments size={24} />
      </button>
    </div>
  );
}
