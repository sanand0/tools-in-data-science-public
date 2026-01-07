# Networking basics: how computers communicate

This note explains, in simple terms:

- How computers send data across a network (LAN or Internet)
- What “layers” mean (TCP/IP stack)
- Which protocols are used for common kinds of communication
- Diagrams you can open in draw.io / diagrams.net

---

## 1) The big idea: computers send small chunks of data called packets

When one computer talks to another, it usually does **not** send one huge message. It splits the data into **packets** (small pieces) and sends them across the network. Each packet carries addressing information so it can be delivered.

To make this work at Internet scale, networking is organized into **layers**. The Internet protocol suite is commonly described as link, internet (IP), transport, and application layers.  [IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc1122)

---

## 2) TCP/IP layers (what each layer is responsible for)

### Link layer (local network delivery)
- Moves data **within the local network** (your Wi-Fi or Ethernet segment).
- Examples: **Ethernet**, **Wi-Fi**.
- Uses hardware addresses (often called MAC addresses) on a LAN.

### Internet layer (IP: addressing + routing across networks)
- Uses **IP addresses** and **routes packets** between networks (through routers).
- IP is the Internet’s addressing and delivery system: it moves packets from a source device to a destination device.  [Cloudflare](https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/)
- IP does not guarantee ordering or reliability by itself (it “tries best”).  [Cloudflare](https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/)

### Transport layer (TCP / UDP / QUIC: end-to-end delivery for apps)
This layer provides a “conversation” between two machines for applications.

- **TCP**: reliable, ordered, connection-oriented transport. TCP is intended as a highly reliable host-to-host protocol.  [IETF](https://www.ietf.org/rfc/rfc793.txt)  
- **UDP**: connectionless “datagram mode” transport.  [RFC Editor](https://www.rfc-editor.org/rfc/rfc768.html)  
- **QUIC**: a secure general-purpose transport protocol (built over UDP).  [IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc9000)

Transport layer also introduces **ports**, so many programs can share one computer and one IP address. IANA maintains the registry of service names and port numbers and describes ports as a way to distinguish services over transport protocols (TCP/UDP/etc.).  [iana.org](https://www.iana.org/assignments/service-names-port-numbers)

### Application layer (HTTP, DNS, SSH, SMTP, etc.)
This is where “what you are trying to do” lives: browse web pages, send email, copy files, etc.

- HTTP is the foundation of data exchange on the Web and is a client-server protocol.  [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)

---

## 3) What actually happens when you connect to something

Most real interactions follow this pattern:

1. **Get the destination address** (often via DNS)
2. **Open a transport connection** (TCP or QUIC; or use UDP directly)
3. Optionally **secure it** (TLS encryption)
4. **Send application messages** (HTTP request, SSH session, SMTP commands, etc.)

### Example: opening a website (high-level)
- Your browser uses **DNS** to translate a domain name to an IP address. DNS acts like an “Internet phonebook”.  [Cloudflare Docs](https://developers.cloudflare.com/fundamentals/concepts/how-cloudflare-works/)
- Then it uses HTTP to fetch resources (HTML, CSS, images).  [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- On HTTPS sites, HTTP traffic is protected using **TLS**, which provides privacy and data integrity for Internet communications.  [Cloudflare](https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/)

---

## 4) Main protocols, by what you are trying to do

Below are the most common protocols students will encounter.

### Web browsing and APIs
- **HTTP / HTTPS** (web pages, REST APIs)  [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)  
- **HTTP/3** maps HTTP semantics over QUIC  [RFC Editor](https://www.rfc-editor.org/rfc/rfc9114.html)

### Name lookup (finding IP addresses for names)
- **DNS**: Domain Name System protocol and message formats are specified in RFC 1035  [IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc1035)

### Secure remote login / server administration
- **SSH**: secure remote login and other secure network services over an insecure network  [IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc4253)

### Email transport
- **SMTP**: transfers electronic mail reliably and efficiently  [IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc5321)  
  (Often used between mail servers; clients typically use submission ports and separate retrieval protocols.)

### File transfer
- **FTP**: classic file transfer protocol (older; often replaced by more secure methods)  [RFC Editor](https://www.rfc-editor.org/rfc/rfc959.html)  
- In practice, many teams prefer file transfer over **SSH** (e.g., SFTP/scp), because SSH provides encryption and authentication.  [IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc4253)

### Getting an IP address on a network (especially on Wi-Fi / LANs)
- **DHCP**: provides a framework for passing configuration information to hosts on a TCP/IP network  [RFC Editor](https://www.rfc-editor.org/rfc/rfc2131)

### Time synchronization
- **NTP**: widely used to synchronize computer clocks on the Internet  [IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc5905)

### Diagnostics and error reporting
- **ICMP**: control/diagnostic messages carried using IP  [RFC Editor](https://www.rfc-editor.org/rfc/rfc792.html)  
  Tools like `ping` and `traceroute` rely on ICMP messages in common implementations.  [Wikipedia](https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol)

---

## 5) A simple protocol “map” (cheat sheet)

- **Link:** Ethernet, Wi-Fi  
- **Internet:** IP (IPv4/IPv6), ICMP  
- **Transport:** TCP, UDP, QUIC  
- **Application:** HTTP/HTTPS, DNS, SSH, SMTP, DHCP, NTP, FTP

This layering idea is consistent with the Internet protocol suite described in RFC 1122 (link, IP, transport, and application).  [IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc1122)