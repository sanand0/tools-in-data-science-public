# Virtual Machines vs WSL (Windows Subsystem for Linux)

This note explains:

- What a **virtual machine (VM)** is
- How **WSL** is different from a “traditional VM”
- How to open the diagrams in **draw.io / diagrams.net**

---

## What is a Virtual Machine (VM)?

A **virtual machine (VM)** is an **isolated computing environment** that behaves like a computer inside your computer.

A VM typically has:

- Virtual CPU, memory, storage, and networking
- A **guest operating system** (e.g., Linux) installed inside the VM
- Applications running inside that guest OS

Red Hat defines a VM as an isolated computing environment with its own CPU, memory, network interface, and storage, created from a pool of hardware resources.  [Red Hat](https://www.redhat.com/en/topics/virtualization/what-is-a-virtual-machine)

### How does a VM work?

A VM runs on top of a **hypervisor**:

- The **host machine** is the physical computer.
- The **hypervisor** allocates physical resources (CPU/RAM/disk/network) to one or more VMs.
- Each VM runs its own **guest OS** and applications.

Red Hat describes the hypervisor as the software that isolates resources and allows the creation and management of VMs.  [Red Hat](https://www.redhat.com/en/topics/virtualization/what-is-a-virtual-machine)  
VMware similarly describes a hypervisor as software that creates and runs virtual machines.  [VMware](https://www.vmware.com/topics/hypervisor)

### What a “traditional VM experience” feels like (for a student)
Typical VM tools (VirtualBox/VMware) usually require you to manage VM settings yourself:

- RAM/CPU allocation
- Virtual disk size
- Networking mode (NAT / bridged)
- Boot media and installation steps

---

## What is WSL?

**Windows Subsystem for Linux (WSL)** is a Windows feature that lets you run a GNU/Linux environment directly on Windows, including bash and common Linux CLI tools.  [Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/about)

Microsoft describes WSL as allowing a Linux environment “without the need for a separate virtual machine or dual booting.”  [Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/about)

That statement is about the *user experience*: you don’t manually create and manage a VM the way you do in VirtualBox/VMware.

---

## How WSL is different from a traditional VM

### WSL 2: a managed “lightweight utility VM”

WSL 2 uses virtualization to run a **real Linux kernel** inside a **lightweight utility virtual machine (VM)**.  [Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/about)

Key points:

- **You still get a VM**, but it is **managed behind the scenes**
- Linux distributions run inside the WSL 2 managed VM  [Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/compare-versions)
- WSL is designed for developer workflows and has tight Windows integration

Microsoft explicitly contrasts WSL 2 with a traditional VM experience (slow boot, isolated, heavy resource usage, and needing manual management) and says WSL 2 avoids those attributes while still using a VM behind the scenes.  [Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/compare-versions)

In the WSL FAQ, Microsoft highlights practical differences from “traditional production environments,” including:
- WSL has a **lightweight utility VM** that **starts/stops and manages resources automatically**
- The VM can automatically shut down when not in use
- Windows file access is automatically provided  [Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/faq)

### WSL 1: no managed VM, but not a full Linux kernel

Microsoft’s comparison page summarizes the primary differences as:
- WSL 2 uses an **actual Linux kernel inside a managed VM**
- WSL 2 offers **full system call compatibility**
- WSL 1 does **not** have a managed VM or full Linux kernel  [Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/compare-versions)

Practical implication:
- WSL 1 can be useful for some workflows, but WSL 2 behaves more like “real Linux” because it runs a real Linux kernel.  [Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/compare-versions)

---

## Summary: VM vs WSL (simple mental model)

### Traditional VM (VirtualBox/VMware)
- You create and manage a VM explicitly
- You install the guest OS like a separate computer
- Strong isolation, but more “machine administration” overhead

### WSL 2
- A Linux kernel runs inside a VM, **but the VM is managed automatically**
- Faster startup and tighter Windows integration than typical desktop VMs
- Designed primarily for “inner-loop” development workflows  [Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/faq)
