"use client";
import { useState, useEffect } from "react";

type Prefs = { necessary: true; analytics: boolean; marketing: boolean };

const KEY = "krakram_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [detail, setDetail]   = useState(false);
  const [prefs, setPrefs]     = useState<Prefs>({ necessary: true, analytics: false, marketing: false });

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  function save(p: Prefs) {
    localStorage.setItem(KEY, JSON.stringify(p));
    setVisible(false);
    // Zde aktivuj analytiku / marketing podle p.analytics / p.marketing
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end md:items-end justify-center pointer-events-none">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" />

      <div className="relative pointer-events-auto w-full max-w-2xl mx-auto mb-0 md:mb-6 bg-white rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-forest px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">🍪</span>
          <div>
            <p className="text-cream font-bold text-lg leading-tight">Soubory cookies</p>
            <p className="text-cream/60 text-xs">Vyberte, které cookies povolujete</p>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-ink-soft text-sm leading-relaxed mb-4">
            Používáme cookies ke zlepšení vašeho zážitku na webu. Nezbytné cookies jsou
            vždy aktivní. Analytické a marketingové cookies zapínáte dobrovolně.
            Svůj výběr můžete kdykoliv změnit.{" "}
            <a href="/zasady-cookies" className="underline text-forest">Zásady cookies</a>
          </p>

          {/* Kategorie */}
          {detail && (
            <div className="flex flex-col gap-3 mb-5 border border-border-green rounded-xl p-4">
              {/* Nezbytné */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-ink text-sm">Nezbytné cookies</p>
                  <p className="text-ink-muted text-xs mt-0.5">Zajišťují základní funkce webu (věková brána, formuláře). Nelze vypnout.</p>
                </div>
                <div className="shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-forest bg-forest/10 px-2 py-1 rounded-full">Vždy zapnuto</span>
                </div>
              </div>

              <div className="border-t border-border-green" />

              {/* Analytické */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-ink text-sm">Analytické cookies</p>
                  <p className="text-ink-muted text-xs mt-0.5">Pomáhají nám pochopit, jak návštěvníci web používají (Google Analytics).</p>
                </div>
                <button
                  onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                  className={`shrink-0 mt-0.5 w-11 h-6 rounded-full transition-colors relative ${prefs.analytics ? "bg-forest" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${prefs.analytics ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>

              <div className="border-t border-border-green" />

              {/* Marketingové */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-ink text-sm">Marketingové cookies</p>
                  <p className="text-ink-muted text-xs mt-0.5">Umožňují cílenou reklamu (Meta Pixel, Google Ads).</p>
                </div>
                <button
                  onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                  className={`shrink-0 mt-0.5 w-11 h-6 rounded-full transition-colors relative ${prefs.marketing ? "bg-forest" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${prefs.marketing ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          )}

          {/* Tlačítka */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => save({ necessary: true, analytics: true, marketing: true })}
              className="flex-1 bg-forest text-cream font-bold py-3 px-4 rounded-xl hover:bg-forest-light transition-colors text-sm"
            >
              Přijmout vše
            </button>
            <button
              onClick={() => save({ necessary: true, analytics: false, marketing: false })}
              className="flex-1 border-2 border-forest text-forest font-bold py-3 px-4 rounded-xl hover:bg-forest/5 transition-colors text-sm"
            >
              Odmítnout vše
            </button>
            {detail ? (
              <button
                onClick={() => save(prefs)}
                className="flex-1 border-2 border-ink/20 text-ink font-bold py-3 px-4 rounded-xl hover:bg-ink/5 transition-colors text-sm"
              >
                Uložit výběr
              </button>
            ) : (
              <button
                onClick={() => setDetail(true)}
                className="flex-1 border-2 border-ink/20 text-ink font-semibold py-3 px-4 rounded-xl hover:bg-ink/5 transition-colors text-sm"
              >
                Nastavit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
