# BdiMac

Malá aplikace v horní liště Macu (ikona hrnku ☕ / měsíce 🌙). Když ji zapneš, Mac se **neuspí ani po zavření víka**. Windows App (vzdálená plocha) tak zůstane připojená a Windows PC na druhé straně jede dál.

## Instalace (na Macu, v Terminálu)

```bash
git clone -b claude/relaxed-wozniak-i6r6mv https://github.com/matyaskral-cyber/krakram.git
cd krakram/tools/BdiMac
./build.sh
mv BdiMac.app /Applications/ && open /Applications/BdiMac.app
```

Pokud chybí `swiftc`, nainstaluj ho příkazem `xcode-select --install`.

## Použití

- Klikni na ikonu v liště a vyber **Zapnout – nechat běžet se zavřeným víkem**. Mac si řekne o heslo.
- Doporučuju jednou kliknout na **Zapínat bez hesla**. Pak už heslo chtít nebude a hlavně se ochrana umí sama vypnout v tašce.
- **Pojistky:** na baterii pod 15 % nebo při přehřátí se ochrana sama vypne a Mac se normálně uspí.
- **Ukončit** vrátí normální uspávání.

⚠️ Zavřený, běžící Mac v uzavřené tašce se hřeje. Pokud to jde, nech tašku pootevřenou a nedávej ho k ničemu měkkému.

## Lepší varianta: ať plocha žije na Windows PC i bez Macu

Když se Windows App odpojí, Windows plochu „zhasne“ a programy, které potřebují obrazovku (Claude, který ovládá počítač), přestanou fungovat. Zkopíruj `odpojit-rdp-nechat-plochu.bat` na Windows PC a místo zavírání Windows App ho spusť jako správce. Spojení se ukončí, ale plocha zůstane zapnutá na PC samotném. Mac pak můžeš klidně uspat a zavřít.

Pokud PC nemá připojený monitor, pomůže levná „HDMI dummy“ koncovka, aby plocha měla normální rozlišení.
