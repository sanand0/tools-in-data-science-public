# Base 64 Encoding

Base64 is a method to convert binary data into ASCII text. It's essential when you need to transmit binary data through text-only channels or embed binary content in text formats.

Watch this quick explanation of how Base64 works (3 min):

[![What is Base64? (3 min)](https://i.ytimg.com/vi_webp/8qkxeZmKmOY/sddefault.webp)](https://youtu.be/8qkxeZmKmOY)

Here's how it works:

- It takes 3 bytes (24 bits) and converts them into 4 ASCII characters
- ... using 64 characters: A-Z, a-z, 0-9, + and / (padding with `=` to make the length a multiple of 4)
- There's a URL-safe variant of Base64 that replaces + and / with - and \_ to avoid issues in URLs
- Base64 adds ~33% overhead (since every 3 bytes becomes 4 characters)

Common Python operations with Base64:

```python
import base64

# Basic encoding/decoding
text = "Hello, World!"
# Convert text to base64
encoded = base64.b64encode(text.encode()).decode()  # SGVsbG8sIFdvcmxkIQ==
# Convert base64 back to text
decoded = base64.b64decode(encoded).decode()        # Hello, World!
# Convert to URL-safe base64
url_safe = base64.urlsafe_b64encode(text.encode()).decode()  # SGVsbG8sIFdvcmxkIQ==

# Working with binary files (e.g., images)
with open('image.png', 'rb') as f:
    binary_data = f.read()
    image_b64 = base64.b64encode(binary_data).decode()

# Data URI example (embed images in HTML/CSS)
data_uri = f"data:image/png;base64,{image_b64}"
```

Data URIs allow embedding binary data directly in HTML/CSS. This reduces the number of HTTP requests and also works offline. But it increases the file size.

For example, here's an SVG image embedded as a data URI:

```html
<img
  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTUiIGZpbGw9IiMyNTYzZWIiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJtMTYgNyAyIDcgNyAyLTcgMi0yIDctMi03LTctMiA3LTJaIi8+PC9zdmc+"
/>
```

Base64 is used in many places:

- JSON: Encoding binary data in JSON payloads
- Email: MIME attachments encoding
- Auth: HTTP Basic Authentication headers
- JWT: Encoding tokens in web authentication
- SSL/TLS: PEM certificate format
- SAML: Encoding assertions in SSO
- Git: Encoding binary files in patches

Tools for working with Base64:

- [Base64 Decoder/Encoder](https://www.base64decode.org/) for online encoding/decoding
- [data: URI Generator](https://dopiaza.org/tools/datauri/index.php) converts files to Data URIs
