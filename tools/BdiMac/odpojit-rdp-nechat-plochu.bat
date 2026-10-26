@echo off
:: Spusť NA WINDOWS PC (pravým tlačítkem -> Spustit jako správce) místo zavření Windows App.
:: Odpojí vzdálenou plochu, ale plochu přesune na "konzoli" PC, takže zůstane zapnutá
:: a Claude/programy s okny jedou dál, i když Mac zavřeš.
for /f "skip=1 tokens=3" %%s in ('query user %USERNAME%') do (
  %windir%\System32\tscon.exe %%s /dest:console
)
