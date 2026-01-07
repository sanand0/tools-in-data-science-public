# Common destination for all students

Regardless of your OS, you need to be able to:
- Open a terminal and run commands.
- Navigate files and folders (`pwd`, `ls`, `cd`).
- Read and search text (`cat`, `less`, `grep`).
- Create/move/delete files (`mkdir`, `cp`, `mv`, `rm`).
- Use help (`man`, `--help`).
- Use pipelines and redirection (`|`, `>`, `>>`).

Canonical beginner references you can use:
- Ubuntu’s “[Command line for beginners](https://ubuntu.com/tutorials/command-line-for-beginners)” tutorial is designed for first-time terminal users. 
- A compact command reference list (with examples) for core Linux commands. [Digital Ocean](https://www.digitalocean.com/community/tutorials/linux-commands)￼

NOTE: Powershell is NOT Linux/bash. Its not a substitute either.  Its a CLI (Command Line Interface) for Windows. There may be equivalent commands for some tasks, but the tool chain availability, scripting syntax, and behavior differ significantly from Linux/bash. We do not cover Powershell in this course, nor recommend it.

---
<details>
<summary><strong>Pathway 1: Windows users</strong></summary>

<details>
<summary><strong>A. Recommended: WSL2 + Ubuntu: Why this is the default recommendation</strong></summary>

If you need a “real Linux environment” on Windows, the normal approach is WSL2. Microsoft’s documented install path sets up WSL and installs Ubuntu with one command. [Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/install)

Setup steps (fast, reliable)
1. Install WSL (Ubuntu default).
   - Run `wsl --install` (in PowerShell as admin), then reboot.  ￼
2. Use WSL as your primary terminal. Work inside Ubuntu (WSL). 
   - Treat it like your “TDS course Linux machine.” [Microsoft Learn - Basic WSL Commands](https://learn.microsoft.com/en-us/windows/wsl/basic-commands)

File location rule (important)
- You can access your Windows files in WSL at `/mnt/c/...`, but Microsoft notes performance is better when you store project files inside the Linux filesystem (the `\\wsl$` location) rather than on mounted Windows drives.  ￼
</details>

#### If WSL is not possible (fallback)
<details>
<summary><strong>B. Dual-boot Linux on a Windows PC (fallback option)</strong></summary>

If WSL2 is not possible (policy restrictions, virtualization disabled, performance constraints), **dual-booting** is a practical fallback: you keep Windows, and install Linux on a separate partition so you can boot into a *real* Linux environment for CLI-heavy work.

Ubuntu provides a dual-boot guide and an end-to-end installer tutorial suitable for beginners.  [help.ubuntu.com](https://help.ubuntu.com/community/WindowsDualBoot)

#### Before you start (do not skip)

#### 1. Back up important data
Dual-booting involves changing disk partitions. Mistakes and power loss can corrupt data. Treat backup as mandatory.  [help.ubuntu.com](https://help.ubuntu.com/community/WindowsDualBoot)

#### 2. Confirm your boot mode (UEFI) and stay consistent
Your Linux installation should use the **same firmware boot mode and partitioning scheme** as Windows (typically **UEFI + GPT** on modern PCs). The Arch Wiki explicitly recommends matching the firmware boot mode and partitioning used by Windows when dual-booting.  [Arch Wiki](https://wiki.archlinux.org/title/Dual_boot_with_Windows)

#### 3. Disable Windows “Fast startup” (recommended for dual-boot)
Fast startup is a hybrid shutdown mode that can cause issues in dual-boot scenarios (e.g., Windows volumes not cleanly unmounted).
A step-by-step method to disable Fast startup via Control Panel is documented by Lenovo Support.  [Lenovo Support](https://support.lenovo.com/us/en/solutions/ht513773-how-to-enable-or-disable-fast-startup-on-windows-11). This may vary according to your Windows version and manufacturer.

#### 4. If BitLocker / Device Encryption is enabled, prepare for it
On many Windows 11 systems, drive encryption is enabled by default or commonly enabled. This can interact poorly with firmware/boot changes (you may be prompted for a recovery key).

- Microsoft documents that firmware/TPM-related changes can trigger BitLocker recovery prompts.  [Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/devices/prompted-bitlocker-recovery-key-installing-updates-surface-uefi-tpm-firmware-surface-device)  
- Microsoft’s security blog also describes suspending BitLocker prior to BIOS-level changes to avoid recovery prompts.  [techcommunity.microsoft.com](https://techcommunity.microsoft.com/blog/coreinfrastructureandsecurityblog/bitlocker-is-not-resuming-after-reboot-count-has-been-reached/3794509)  
- Dell documents how to turn off BitLocker / device encryption (including using `manage-bde`).  [Dell](https://www.dell.com/support/kbdoc/en-ed/000124701/automatic-windows-device-encryption-bitlocker-on-dell-systems)

Practical minimum:
- Ensure you can access your BitLocker recovery key before you proceed.
- Consider suspending BitLocker temporarily during the install steps if you are required to change firmware settings.

---

#### Recommended choices (keep it simple)

#### Choose a beginner-friendly distro
- **Ubuntu Desktop (LTS)** is a common default for courses and general compatibility. Ubuntu provides an official install tutorial.  [Ubuntu](https://ubuntu.com/tutorials/install-ubuntu-desktop)

### Prefer “Install alongside Windows”
Ubuntu’s installer flow includes a guided path to install Ubuntu and keep Windows.  [Ubuntu](https://ubuntu.com/tutorials/install-ubuntu-desktop)

---

### Basic steps (Windows → Dual-boot Linux)

### Step 1: Download a Linux ISO
- Download an Ubuntu Desktop image from Ubuntu’s “Install Ubuntu Desktop” tutorial flow.  [Ubuntu](https://ubuntu.com/tutorials/install-ubuntu-desktop)

### Step 2: Create a bootable USB installer
Ubuntu documents creating a bootable USB on Windows (including use of Rufus).  [Ubuntu](https://ubuntu.com/tutorials/create-a-usb-stick-on-windows)  
Rufus is the standard Windows tool for creating bootable USB drives.  [rufus.ie](https://rufus.ie/)

### Step 3: Shrink your Windows partition to make space
Create unallocated space for Linux (typically **50–150 GB** depending on your needs).

Guideline: shrink Windows from within Windows (Disk Management) rather than resizing NTFS from Linux tools, especially if encryption is involved. Ubuntu dual-boot guidance strongly emphasizes safe preparation steps and cautions.  [help.ubuntu.com](https://help.ubuntu.com/community/WindowsDualBoot)

### Step 4: Boot from the USB (UEFI boot)
- Reboot and use your PC’s boot menu key (varies by manufacturer).
- Choose the USB entry that indicates **UEFI** boot (if shown).
Consistency matters: match Windows’ mode (UEFI).  [Arch Wiki](https://wiki.archlinux.org/title/Dual_boot_with_Windows)

### Step 5: Install Linux “alongside Windows”
In the Ubuntu installer, choose the guided option to install alongside Windows (wording may appear as “Install Ubuntu alongside Windows Boot Manager”).

Ubuntu’s official installer tutorial documents the overall flow, including the “Type of installation” step.  [Ubuntu](https://ubuntu.com/tutorials/install-ubuntu-desktop)  
Ubuntu’s WindowsDualBoot page also covers dual-boot setup and cautions.  [help.ubuntu.com](https://help.ubuntu.com/community/WindowsDualBoot)

### Step 6: Boot selection (GRUB / Boot Manager)
After installation, your machine typically boots to a menu where you can choose Linux or Windows.

If something goes wrong, the Arch Wiki dual-boot page is a useful troubleshooting reference (boot modes, EFI entries, Windows boot manager interactions).  [Arch Wiki](https://wiki.archlinux.org/title/Dual_boot_with_Windows)

---

## Common pitfalls (and how to avoid them)

### Pitfall: Secure Boot / BitLocker recovery loops
Changing Secure Boot policy or boot configuration can trigger BitLocker recovery prompts on some systems. Microsoft documents recovery prompts in firmware/TPM-change scenarios.  [Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/devices/prompted-bitlocker-recovery-key-installing-updates-surface-uefi-tpm-firmware-surface-device)

Mitigation:
- Do not change firmware settings unless necessary.
- If you must, ensure you have the recovery key and consider suspending BitLocker temporarily.

### Pitfall: Installing Linux in the wrong boot mode
If Windows is installed in UEFI mode, install Linux in UEFI mode too. The Arch Wiki explicitly advises matching the firmware boot mode and partitioning scheme.  [Arch Wiki](https://wiki.archlinux.org/title/Dual_boot_with_Windows)

### Pitfall: “Fast startup” causing filesystem inconsistencies
Disable Fast startup before dual-booting. Lenovo documents the required steps.  [Lenovo Support](https://support.lenovo.com/us/en/solutions/ht513773-how-to-enable-or-disable-fast-startup-on-windows-11)

---

## After installation (first 15 minutes)

1. Boot into Linux.
2. Run system updates.
3. Confirm you can reboot and still boot into Windows.

Ubuntu’s install tutorial ends with an explicit “Don’t forget to update” step.  [Ubuntu](https://ubuntu.com/tutorials/install-ubuntu-desktop)

</details>

---

<details>
<summary>Alternative (Not really... but every term someone asks): Git Bash or similar (NOT RECOMMENDED)</summary>
Git Bash (comes with Git for Windows) provides a bash emulation layer and is useful for basic shell familiarity.

**Important Limitations**: Git Bash is not a full Linux environment; some tooling and package availability will differ.

We do NOT recommend Git Bash, Cygwin, or MSYS2 or other emulation layers for DS/MLOps workflows that expect Linux. At best they are a stopgap for learning basic shell skills.
Several Linux-native tools and workflows will not work as expected in these environments.

</details>

</details>

---

<details>
<summary>Pathway 2: macOS users (Terminal + zsh; bash is optional)</summary>

What you start with on macOS
	•	macOS includes a built-in Terminal app (you can open it from Applications/Utilities or Spotlight).  ￼
	•	Apple states the default shell in Terminal is zsh.  ￼

For beginner work, zsh is fine (most day-to-day commands and patterns match bash closely). If you need bash specifically, you can run bash for that session or change your default shell. Apple documents how to change the default shell in Terminal settings.  ￼

Install a package manager (strongly recommended)

Many course/tooling workflows assume you can install CLI utilities easily. On macOS, the standard is Homebrew.
	•	Homebrew’s official install command is published on its homepage.  ￼
	•	Homebrew’s docs also clarify that the one-liner installer runs under /bin/bash (i.e., it expects bash for the installer).  ￼

After Homebrew is installed, students can install common CLI utilities used in typical DS workflows (e.g., git, wget, jq, ripgrep, etc.) using brew install ….
</details>

---

<details>
<summary>Pathway 3: Linux desktop users (never used bash before)</summary>

What you start with on Linux

You already have the target OS. You just need to build terminal muscle memory.
	•	Most Linux desktops provide a Terminal app; Ubuntu’s beginner tutorial notes that many Linux systems use Ctrl+Alt+T to open it.  ￼

Learn using an actual beginner terminal walkthrough

Use Ubuntu’s beginner CLI tutorial as the starting ramp (it is explicitly written for people who have never used the command line).  ￼

Install essentials using your distro’s package manager

The exact command varies by distro (Ubuntu/Debian uses apt). The key point is to get comfortable installing tools from the CLI early.
</details>