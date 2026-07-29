# OSINT (Open-Source Intelligence)

## What is OSINT?

OSINT is the practice of collecting information from **publicly available sources**. It is commonly used during the **reconnaissance (information gathering)** phase of cybersecurity.

It does **not** involve hacking or unauthorized access.


## Where is it used?

- Reconnaissance before penetration testing
- Bug bounty hunting
- Investigating domains and IP addresses
- Company and infrastructure research
- Threat intelligence
- Digital forensics


# Common OSINT Tools

## Google Dorks

**Purpose:** Find information that is already indexed by Google but difficult to discover through normal searches.

**Example**

```text
site:example.com filetype:pdf
```

Finds PDF files on a website.


## theHarvester

**Purpose:** Collect emails, subdomains, hostnames and IP addresses related to a domain.

**Example**

```bash
theHarvester -d example.com -b all
```


## SpiderFoot

**Purpose:** Automatically gathers OSINT data from many public sources.

It can discover:
- Subdomains
- DNS records
- IP addresses
- Email addresses
- Open ports
- Data leaks

**Example**

```bash
spiderfoot -l 127.0.0.1:5001
```

Then open the web interface and start a scan for a domain.


## Shodan

**Purpose:** Search for devices connected to the Internet instead of web pages.

You can search for:
- Web servers
- Routers
- CCTV cameras
- IoT devices
- Databases

**Example searches**

```text
apache
```

```text
port:22 country:IN
```

```text
nginx
```

---

## Maltego

**Purpose:** Visualize relationships between domains, emails, IP addresses, people and organizations.

Useful for mapping connections during investigations.

**Example**

Start with a domain like:

```text
example.com
```

Run transforms to discover related IPs, DNS records, email addresses and organizations.

---

## Recon-ng

**Purpose:** A modular reconnaissance framework containing many OSINT modules.

**Example**

```bash
recon-ng
```

Load a module and investigate a target domain.

---

These tools are used during the **information gathering** phase of cybersecurity to understand a target using publicly available information.