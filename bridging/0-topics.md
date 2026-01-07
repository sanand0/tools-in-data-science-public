1. Linux/Unix: Why TDS Uses It

- Most DS/ML work runs on Linux servers and containers
- Core tools and scripts assume Unix-like environments
- Goal: be comfortable working in Linux or a close equivalent

2. Virtual Machines and WSL (what they are)

- VM = a computer inside your computer (host, hypervisor, guest OS)
- WSL 2 uses a lightweight VM with a real Linux kernel
- WSL feels more integrated than a traditional VM

3. macOS Setup (Terminal + Homebrew)

- Use Terminal (zsh) for Unix commands
- Install Homebrew to get common CLI tools
- Treat macOS as your Unix-like dev environment

4. Windows: Why Windows Isn't Unix

- PowerShell and cmd are not bash
- Many tools expect Unix paths and utilities
- A Linux environment avoids course mismatches

5. Windows: Set Up Linux with WSL2

- Recommended path: WSL2 + Ubuntu
- Alternative if WSL2 is blocked: dual-boot or VM
- WSL gives you a real Linux userland

6. Windows: WSL Dev Environment Basics

- Use the WSL terminal as your primary shell
- Store projects inside the Linux filesystem for performance
- Learn core Linux commands early

7. Windows: Why Avoid Git Bash

- Not a full Linux environment
- Tooling differences cause bugs and missing features
- WSL matches real-world Linux workflows

8. Networking Basics: How Computers Communicate

- Packets, IP addresses, ports, and routing
- TCP vs UDP and the TCP/IP layers
- DNS as the "phonebook" of the internet

9. How the Web Works (client/server)

- Browser is the client, server sends responses
- DNS lookup, then HTTP request/response
- HTTPS adds encryption with TLS

10. HTTP Requests and curl

- Methods: GET, POST, PUT, DELETE
- URLs, headers, status codes, and bodies
- Use curl to test APIs and download data

11. HTML Basics (structure)

- Tags, attributes, and nesting
- Head vs body
- Semantic layout elements

12. CSS Basics (style and layout)

- Selectors, rules, and properties
- Box model: margin, border, padding, content
- Cascading and specificity

13. JavaScript Basics (behavior)

- DOM access and events
- How JS modifies HTML and CSS
- Browser console for quick testing

14. How Browsers Actually Work (for scraping & APIs)

- Difference between a webpage and an API response
- "View Source" vs "Inspect Element"
- Role of JavaScript in modern websites
- Using the Network tab to see requests and responses

15. Version Control and Git (local basics)

- Why version control exists
- Commits, history, and diffs
- Git vs copying folders or manual backups

16. Local Git vs GitHub (remotes + collaboration)

- Local repo vs remote repo
- Pull requests and issues (conceptual)
- GitHub CLI basics for terminal workflows

17. Files, Formats, and Encodings

- Text files vs binary files
- Common formats students will encounter early: CSV, JSON, HTML, Markdown
- What encoding means (UTF-8 awareness)
- Why "garbled text" or strange characters appear

18. Mental Model of Tools vs Languages

- Python / JavaScript are languages; Git, curl, Docker, etc. are tools
- Why learning tools feels different from learning programming
- Expectation-setting around documentation-driven learning
- Comfort with using tools without fully "understanding everything inside"

19. Logs vs Outputs vs Errors

- stdout vs stderr
- Why logs are not the same as program results
- Using logs to debug long-running or failing processes
- Importance of timestamps, verbosity levels, and reading logs calmly

20. Automation Mindset

- Difference between doing something once vs doing it repeatedly
- Why manual steps don’t scale
- Thinking in terms of scripts and repeatability
- Early exposure to the idea of "if I do this twice, what breaks?"

21. Security Basics (Just Enough Awareness)

- Why exposing API keys or tokens is dangerous
- Public vs private repositories
- Common beginner mistakes leading to accidental leaks
- Basic idea of separating secrets from code
