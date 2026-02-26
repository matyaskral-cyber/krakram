"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AgeGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const confirmed = sessionStorage.getItem("age-confirmed");
    if (!confirmed) setVisible(true);
  }, []);

  const confirm = () => {
    sessionStorage.setItem("age-confirmed", "1");
    setVisible(false);
  };

  const deny = () => {
    window.location.href = "https://www.google.com";
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/80 backdrop-blur-sm px-4">
      <div className="bg-green-bg rounded-2xl shadow-2xl max-w-md w-full p-10 flex flex-col items-center text-center">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="KraKrám"
          width={160}
          height={80}
          className="h-20 w-auto object-contain mb-8"
          priority
        />

        <h2 className="text-2xl font-bold text-ink mb-3">
          Ověření věku
        </h2>
        <p className="text-ink-soft leading-relaxed mb-2">
          Tento web je určen výhradně pro osoby starší <strong>18 let</strong>.
        </p>
        <p className="text-ink-muted text-sm mb-10">
          Pokračováním potvrzujete, že jste dovršili 18 let věku.
        </p>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={confirm}
            className="w-full bg-forest text-cream font-semibold py-4 rounded-full hover:bg-forest-light transition-colors text-base"
          >
            Je mi 18 nebo více let
          </button>
          <button
            onClick={deny}
            className="w-full border border-border-green text-ink-muted font-medium py-4 rounded-full hover:border-forest hover:text-forest transition-colors text-base"
          >
            Je mi méně než 18 let
          </button>
        </div>
      </div>
    </div>
  );
}
