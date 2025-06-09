"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BUTTONS = [
  {
    label: "ENCRIPTAR",
    href: "/encrypt",
    key: "convertidor",
  },
  {
    label: "DESENCRIPTAR",
    href: "/decrypt",
    key: "desencriptar",
  },
  {
    label: (
      <>
        CONVERTIR <br /> JSON ↔ XML
      </>
    ),
    href: "/switch",
    key: "switch",
  },
];

export default function HomePage() {
  // Por defecto, el primer botón tiene el w-lg
  const [active, setActive] = useState<string>(BUTTONS[0].key);

  return (
    <div className="bg-[#8AD1BF] flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="font-bold text-6xl text-[#38544D]">CryptGXJ</h1>
      <div className="flex flex-row justify-between mt-10 gap-4 w-full max-w-3xl">
        {BUTTONS.map((btn, idx) => (
          <div
            key={btn.key}
            className={`flex-1 flex ${
              idx === 0
                ? "justify-start"
                : idx === 1
                ? "justify-center"
                : "justify-end"
            }`}
            onMouseEnter={() => setActive(btn.key)}
          >
            <Button asChild className="h-30 w-30 bg-[#548075] text-center shadow-2xl">
              <Link
                href={btn.href}
                className={`text-[#A1F4DF] font-mono ${
                  active === btn.key ? "w-lg" : ""
                } font-extralight`}
              >
                {btn.label}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
