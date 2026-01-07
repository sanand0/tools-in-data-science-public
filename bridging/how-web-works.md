# How the Web Works (Beginner Guide)

This note explains:

- The big idea: clients and servers
- What happens when you open a website
- How computers communicate on the web (DNS, IP, HTTP, HTTPS)
- How to open the diagrams in draw.io / diagrams.net

---

## Big picture: the web vs the internet

The internet is the global network of computers.
The web is a service that runs on top of the internet to share pages, files, and apps.

On the web, your **browser** is the **client** and a **web server** is the **server**.

---

## Step by step: what happens when you visit a website

Example: you type `https://example.com` and press Enter.

1. Your browser checks its cache. If it already has the files, it can reuse them.
2. The browser asks **DNS** for the IP address of `example.com`.
3. DNS replies with an IP address (a numeric address like `93.184.216.34`).
4. The browser opens a connection to that IP address.
5. The browser sends an **HTTP request** (like `GET /`).
6. The server runs code, reads files, or queries a database.
7. The server sends an **HTTP response** with HTML, CSS, JavaScript, images, or data.
8. The browser downloads those files and renders the page. It may make extra requests for images, fonts, or API calls.

---

## How computers communicate on the web (simple model)

- **DNS** translates names to IP addresses.
- **IP addresses** tell the network where to deliver data.
- **HTTP** is the conversation format (request and response).
- **Packets** are small chunks of data that travel across routers.
- **TCP** makes sure packets arrive and are reassembled in order.
- **HTTPS** encrypts the HTTP traffic so others cannot read it in transit.

---

## Quick glossary

- **Client**: the device asking for data (usually your browser).
- **Server**: the computer providing data (a website or API).
- **URL**: the address you type into the browser.
- **DNS**: the system that maps names to IP addresses.
- **IP address**: the numeric address of a device on a network.
- **HTTP / HTTPS**: the web's request and response rules.

