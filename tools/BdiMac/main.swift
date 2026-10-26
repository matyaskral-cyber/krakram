// BdiMac – aplikace v horní liště, která nechá Mac běžet i se zavřeným víkem.
// Zapíná/vypíná `pmset -a disablesleep` a drží `caffeinate`, aby se nic neuspalo.

import Cocoa
import IOKit.ps
import ServiceManagement

final class AppDelegate: NSObject, NSApplicationDelegate, NSMenuDelegate {
    private var statusItem: NSStatusItem!
    private var caffeinate: Process?
    private var watchdog: Timer?
    private var active = false

    private let toggleItem = NSMenuItem(title: "", action: #selector(toggle), keyEquivalent: "")
    private let statusLine = NSMenuItem(title: "", action: nil, keyEquivalent: "")
    private let batteryLine = NSMenuItem(title: "", action: nil, keyEquivalent: "")
    private let loginItem = NSMenuItem(title: "Spouštět po přihlášení", action: #selector(toggleLogin), keyEquivalent: "")
    private let passwordlessItem = NSMenuItem(title: "Zapínat bez hesla (nastavit jednou)…", action: #selector(setupPasswordless), keyEquivalent: "")

    /// Pod tuto hranici na baterii se ochrana sama vypne, aby se Mac v tašce nevybil do nuly.
    private let minBatteryPercent = 15
    private let sudoersPath = "/etc/sudoers.d/bdimac"

    // MARK: - Start

    func applicationDidFinishLaunching(_ notification: Notification) {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)

        let menu = NSMenu()
        menu.delegate = self
        statusLine.isEnabled = false
        batteryLine.isEnabled = false
        menu.addItem(statusLine)
        menu.addItem(batteryLine)
        menu.addItem(.separator())

        toggleItem.target = self
        menu.addItem(toggleItem)

        let displayOff = NSMenuItem(title: "Zhasnout displej Macu", action: #selector(displayOff), keyEquivalent: "")
        displayOff.target = self
        menu.addItem(displayOff)
        menu.addItem(.separator())

        loginItem.target = self
        passwordlessItem.target = self
        menu.addItem(loginItem)
        menu.addItem(passwordlessItem)
        menu.addItem(.separator())

        let quit = NSMenuItem(title: "Ukončit (vrátí normální uspávání)", action: #selector(quit), keyEquivalent: "q")
        quit.target = self
        menu.addItem(quit)

        statusItem.menu = menu

        // Pokud bylo uspávání vypnuté už z minula, navážeme na to.
        active = isSleepDisabledInSystem()
        if active { startCaffeinate() }

        watchdog = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            self?.safetyCheck()
        }
        refreshUI()
    }

    func applicationWillTerminate(_ notification: Notification) {
        if active { _ = setSleepDisabled(false, interactive: true) }
        stopCaffeinate()
    }

    func menuWillOpen(_ menu: NSMenu) {
        active = isSleepDisabledInSystem()
        refreshUI()
    }

    // MARK: - Akce z menu

    @objc private func toggle() {
        if active {
            if setSleepDisabled(false, interactive: true) {
                active = false
                stopCaffeinate()
            }
        } else {
            if setSleepDisabled(true, interactive: true) {
                active = true
                startCaffeinate()
            }
        }
        refreshUI()
    }

    @objc private func displayOff() {
        run("/usr/bin/pmset", ["displaysleepnow"])
    }

    @objc private func toggleLogin() {
        if #available(macOS 13.0, *) {
            let service = SMAppService.mainApp
            do {
                if service.status == .enabled {
                    try service.unregister()
                } else {
                    try service.register()
                }
            } catch {
                showAlert("Nepodařilo se změnit spouštění po přihlášení", error.localizedDescription)
            }
            refreshUI()
        }
    }

    /// Jednorázově povolí `pmset -a disablesleep 0/1` bez hesla jen pro tohoto uživatele.
    /// Díky tomu se ochrana umí sama vypnout i při slabé baterii, kdy na heslo nikdo nekliká.
    @objc private func setupPasswordless() {
        let user = NSUserName()
        let rule = "\(user) ALL=(root) NOPASSWD: /usr/bin/pmset -a disablesleep 0, /usr/bin/pmset -a disablesleep 1\n"
        let tmp = FileManager.default.temporaryDirectory.appendingPathComponent("bdimac-sudoers")
        do {
            try rule.write(to: tmp, atomically: true, encoding: .utf8)
        } catch {
            showAlert("Nepodařilo se připravit nastavení", error.localizedDescription)
            return
        }
        let cmd = "/usr/sbin/visudo -cf '\(tmp.path)' && /usr/bin/install -m 0440 -o root -g wheel '\(tmp.path)' \(sudoersPath)"
        if runAsAdmin(cmd) {
            showAlert("Hotovo", "Zapínání a vypínání už nebude chtít heslo.")
        }
        try? FileManager.default.removeItem(at: tmp)
        refreshUI()
    }

    @objc private func quit() {
        NSApp.terminate(nil)
    }

    // MARK: - Ochrana (baterie, teplota)

    private func safetyCheck() {
        guard active else { return }
        var reason: String?

        if let battery = batteryInfo(), battery.onBattery, battery.percent <= minBatteryPercent {
            reason = "baterie klesla na \(battery.percent) %"
        }
        let thermal = ProcessInfo.processInfo.thermalState
        if thermal == .serious || thermal == .critical {
            reason = "Mac se přehřívá"
        }
        guard let reason else { return }

        // Bez interakce – v tašce nikdo heslo nezadá. Funguje po „Zapínat bez hesla“.
        if setSleepDisabled(false, interactive: false) {
            active = false
            stopCaffeinate()
            refreshUI()
            NSLog("BdiMac: ochrana vypnuta, protože \(reason).")
        } else {
            // Aspoň pustíme caffeinate, ať se Mac může uspat sám, jakmile to systém dovolí.
            stopCaffeinate()
        }
    }

    // MARK: - Systém

    private func setSleepDisabled(_ disabled: Bool, interactive: Bool) -> Bool {
        let value = disabled ? "1" : "0"
        if run("/usr/bin/sudo", ["-n", "/usr/bin/pmset", "-a", "disablesleep", value]).status == 0 {
            return true
        }
        guard interactive else { return false }
        return runAsAdmin("/usr/bin/pmset -a disablesleep \(value)")
    }

    private func isSleepDisabledInSystem() -> Bool {
        let output = run("/usr/bin/pmset", ["-g"]).output
        for line in output.split(separator: "\n") where line.contains("SleepDisabled") {
            return line.split(whereSeparator: { $0 == " " || $0 == "\t" }).last == "1"
        }
        return false
    }

    private func isPasswordlessConfigured() -> Bool {
        FileManager.default.fileExists(atPath: sudoersPath)
    }

    private func startCaffeinate() {
        guard caffeinate == nil else { return }
        let p = Process()
        p.executableURL = URL(fileURLWithPath: "/usr/bin/caffeinate")
        // -i nečinnost, -m disk, -s systém; -w = skonči, až skončí BdiMac.
        p.arguments = ["-ims", "-w", String(ProcessInfo.processInfo.processIdentifier)]
        try? p.run()
        caffeinate = p
    }

    private func stopCaffeinate() {
        caffeinate?.terminate()
        caffeinate = nil
    }

    private func batteryInfo() -> (percent: Int, onBattery: Bool)? {
        guard let blob = IOPSCopyPowerSourcesInfo()?.takeRetainedValue(),
              let sources = IOPSCopyPowerSourcesList(blob)?.takeRetainedValue() as? [CFTypeRef] else { return nil }
        for source in sources {
            guard let desc = IOPSGetPowerSourceDescription(blob, source)?.takeUnretainedValue() as? [String: Any],
                  let current = desc[kIOPSCurrentCapacityKey] as? Int,
                  let max = desc[kIOPSMaxCapacityKey] as? Int, max > 0 else { continue }
            let onBattery = (desc[kIOPSPowerSourceStateKey] as? String) == kIOPSBatteryPowerValue
            return (current * 100 / max, onBattery)
        }
        return nil
    }

    @discardableResult
    private func run(_ path: String, _ args: [String]) -> (status: Int32, output: String) {
        let p = Process()
        p.executableURL = URL(fileURLWithPath: path)
        p.arguments = args
        let out = Pipe()
        p.standardOutput = out
        p.standardError = Pipe()
        do { try p.run() } catch { return (-1, "") }
        let data = out.fileHandleForReading.readDataToEndOfFile()
        p.waitUntilExit()
        return (p.terminationStatus, String(data: data, encoding: .utf8) ?? "")
    }

    private func runAsAdmin(_ command: String) -> Bool {
        let escaped = command
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
        var error: NSDictionary?
        let script = NSAppleScript(source: "do shell script \"\(escaped)\" with administrator privileges")
        _ = script?.executeAndReturnError(&error)
        return error == nil
    }

    // MARK: - UI

    private func refreshUI() {
        let symbol = active ? "cup.and.saucer.fill" : "moon.zzz"
        let image = NSImage(systemSymbolName: symbol, accessibilityDescription: "BdiMac")
        image?.isTemplate = true
        statusItem.button?.image = image
        statusItem.button?.toolTip = active ? "BdiMac: Mac běží i se zavřeným víkem" : "BdiMac: normální uspávání"

        statusLine.title = active ? "● Běží i se zavřeným víkem" : "○ Normální režim (zavřením se uspí)"
        toggleItem.title = active ? "Vypnout – zase uspávat" : "Zapnout – nechat běžet se zavřeným víkem"

        if let battery = batteryInfo() {
            batteryLine.title = "Baterie: \(battery.percent) %" + (battery.onBattery ? "" : " (nabíjí se)")
                + "  · auto-vypnutí pod \(minBatteryPercent) %"
            batteryLine.isHidden = false
        } else {
            batteryLine.isHidden = true
        }

        passwordlessItem.state = isPasswordlessConfigured() ? .on : .off
        if #available(macOS 13.0, *) {
            loginItem.state = SMAppService.mainApp.status == .enabled ? .on : .off
            loginItem.isHidden = false
        } else {
            loginItem.isHidden = true
        }
    }

    private func showAlert(_ title: String, _ text: String) {
        NSApp.activate(ignoringOtherApps: true)
        let alert = NSAlert()
        alert.messageText = title
        alert.informativeText = text
        alert.runModal()
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
