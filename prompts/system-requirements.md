---
agent: Codex CLI
model: gpt-5
---

Ensure `system-requirements.md` documents all software and system permissions required for this course.

- Read each file referenced in `_sidebar.md` and `README.md` files.
- List all URLs linked from these files.
- Document the software and system permissions required based on these.

Then, double-check that:

- All software mentioned is included in the Software section.
- All permissions mentioned are included in the Permissions section.

Use the following output format:

<OUTPUT-FORMAT>

### Software

List any software or applications students must install for this module. For each, specify the name, version (if applicable) and download link (URL). Example:

- [VS Code](https://code.visualstudio.com/)
- [Node.js v18+](https://nodejs.org/)

## System Permissions

Specify any special browser settings, required browser extensions, or access to ports/services that may need administrative or IT support. For each item, specify whether admin/IT support is required (Yes/No) and add any relevant notes. Example:

- Browser extension: "Live Server" (Admin/IT support: No, Notes: Can be installed by user)
- Open port 3000 (Admin/IT support: Yes, Notes: Required for local server)

</OUTPUT-FORMAT>
