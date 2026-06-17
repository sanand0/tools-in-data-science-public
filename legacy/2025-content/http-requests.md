## HTTP Requests: curl, wget, HTTPie, Postman

Making HTTP requests is essential for interacting with web APIs, downloading data, and testing web services. Whether you're fetching data from a public API, testing your own REST endpoints, or automating data collection, these tools make HTTP interactions simple and efficient.

This guide covers four popular approaches: `curl` (the universal standard), `wget` (for downloads), `HTTPie` (user-friendly alternative), and Postman (GUI-based testing).

Watch these tutorials to understand HTTP requests and API testing (60 min):

[![How to use cURL for API requests (15 min)](https://i.ytimg.com/vi_webp/7XUibDYw4mc/sddefault.webp)](https://youtu.be/7XUibDYw4mc)

[![Postman Beginner's Course - API Testing (45 min)](https://i.ytimg.com/vi_webp/VywxIQ2ZXw4/sddefault.webp)](https://youtu.be/VywxIQ2ZXw4)

### curl

[curl](https://curl.se/) is the universal command-line tool for making HTTP requests. It's pre-installed on most systems and supports all HTTP methods, authentication, headers, and more.

Basic Usage:

```bash
# Get GitHub user data
curl https://api.github.com/users/octocat

# Save to file
curl -o user.json https://api.github.com/users/octocat

# Pretty-print with jq
curl https://api.github.com/users/octocat | jq

# Extract specific field
curl https://api.github.com/users/octocat | jq '.name'

# Show response headers (useful for rate limits)
curl -i https://api.github.com/users/octocat
```

Authentication:

```bash
# Use GitHub token for higher rate limits
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/user

# List your repositories (requires auth)
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/user/repos
```

Common Use Cases:

```bash
# Get repository info
curl https://api.github.com/repos/python/cpython | jq '.stargazers_count'

# List repository contributors
curl https://api.github.com/repos/python/cpython/contributors | jq '.[].login'

# Search repositories
curl "https://api.github.com/search/repositories?q=data+science&sort=stars" \
  | jq '.items[0:5] | .[] | {name, stars: .stargazers_count}'

# Download a file from a repo
curl -O https://raw.githubusercontent.com/user/repo/main/data.csv

# Check API rate limit
curl https://api.github.com/rate_limit | jq '.rate'
```

### HTTPie

[HTTPie](https://httpie.io/) is a modern, user-friendly command-line HTTP client with syntax highlighting, JSON support, and intuitive syntax. It's perfect for API testing and development.

Installation:

```bash
# Install with uv (recommended)
uvx httpie

# Or install via pip
pip install httpie

# Or via package manager (Linux)
sudo apt install httpie  # Debian/Ubuntu
brew install httpie      # macOS
```

Basic Usage:

```bash
# Get GitHub user (colors and formatting by default)
http https://api.github.com/users/octocat

# Search repositories
http https://api.github.com/search/repositories q==python stars:>10000

# With authentication
http https://api.github.com/user \
  Authorization:"token YOUR_GITHUB_TOKEN"
```

The syntax is intuitive:

- `param==value` → Query parameter
- `key=value` → JSON string
- `key:=value` → JSON number/boolean
- `header:value` → Custom header

Practical Examples:

```bash
# Create a GitHub issue
http POST https://api.github.com/repos/owner/repo/issues \
  Authorization:"token YOUR_TOKEN" \
  title="Data quality issue" \
  body="Missing values in column X"

# Get repository statistics
http https://api.github.com/repos/pandas-dev/pandas | \
  jq '{stars: .stargazers_count, forks: .forks_count}'

# Download file
http --download \
  https://raw.githubusercontent.com/user/repo/main/data.csv
```

### Postman

[Postman](https://www.postman.com/) is a powerful GUI application for API development and testing. It's ideal for interactive testing, documentation, and team collaboration.

Download from [postman.com/downloads](https://www.postman.com/downloads/).

Key Features:

1. **Request Builder**

   - Visual interface for all HTTP methods
   - Headers, parameters, and body editor
   - Authentication helper
   - Pre-request scripts

2. **Collections**

   - Group related requests
   - Share with team
   - Run as test suites
   - Export/import for version control

3. **Environments**

   - Define variables (dev, staging, prod)
   - Switch contexts easily
   - Store secrets securely

4. **Testing**

   ```javascript
   // Example test scripts
   pm.test("Status code is 200", function() {
     pm.response.to.have.status(200);
   });

   pm.test("Response time is less than 200ms", function() {
     pm.expect(pm.response.responseTime).to.be.below(200);
   });

   pm.test("Body contains user data", function() {
     const jsonData = pm.response.json();
     pm.expect(jsonData.name).to.eql("Alice");
   });
   ```

5. **Documentation**
   - Auto-generate API docs
   - Include examples
   - Publish to web

Workflows:

```javascript
// Set environment variable from response
const response = pm.response.json();
pm.environment.set("user_id", response.id);

// Use variable in next request
// URL: https://api.example.com/users/{{user_id}}

// Chain requests with Newman (CLI)
newman run collection.json -e environment.json
```

### Comparing Tools

| Feature            | curl   | HTTPie   | Postman  |
| ------------------ | ------ | -------- | -------- |
| Interface          | CLI    | CLI      | GUI      |
| Learning curve     | Medium | Easy     | Easy     |
| JSON support       | Manual | Built-in | Built-in |
| Downloads          | ✓      | ✓        | Limited  |
| Testing            | Manual | Basic    | ✓✓       |
| Scripting          | ✓✓     | ✓        | ✓        |
| Team collaboration | No     | No       | ✓✓       |
| Platform           | All    | All      | All      |

### Best Practices

1. **Use the Right Tool**

   - `curl`: Scripting, automation, universal compatibility
   - `wget`: Bulk downloads, mirroring, interrupted downloads
   - `HTTPie`: Interactive testing, readable output
   - Postman: Team collaboration, complex workflows

2. **Handle API Keys Securely**

   ```bash
   # Store GitHub token in environment
   export GITHUB_TOKEN="your_token_here"

   # Use in requests
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/user/repos

   # Or store in ~/.config/github/token
   curl -H "Authorization: token $(cat ~/.config/github/token)" \
     https://api.github.com/user
   ```

3. **Respect Rate Limits**

   ```bash
   # GitHub allows 60 requests/hour (unauthenticated)
   # Check your rate limit
   curl https://api.github.com/rate_limit | jq '.rate'

   # Add delays between requests
   for repo in (cat repos.txt)
     curl https://api.github.com/repos/$repo
     sleep 1
   end
   ```

4. **Save API Responses**

   ```bash
   # Save with timestamp
   curl https://api.github.com/repos/python/cpython \
     | jq > "python-cpython-$(date +%Y%m%d).json"

   # Log status and time
   curl -w "\nStatus: %{http_code}\nTime: %{time_total}s\n" \
     https://api.github.com/users/octocat
   ```

5. **Handle Errors**

   ```bash
   # Check if request succeeded
   if curl -f https://api.github.com/users/octocat > /dev/null 2>&1
     echo "User exists"
   else
     echo "User not found"
   end

   # Check rate limit before making requests
   curl https://api.github.com/rate_limit \
     | jq -e '.rate.remaining > 10' > /dev/null && echo "OK to proceed"
   ```

### Practical Examples

**Analyze GitHub Repository Data**

```bash
# Get top Python repos
curl "https://api.github.com/search/repositories?q=language:python&sort=stars&per_page=5" \
  | jq '.items[] | {name: .full_name, stars: .stargazers_count}'

# Extract contributor data
curl https://api.github.com/repos/pandas-dev/pandas/contributors \
  | jq '.[0:10] | .[] | {login, contributions}' > contributors.json
```

**Collect Repository Statistics**

```bash
# Get multiple repos data
for repo in torvalds/linux python/cpython microsoft/vscode
  curl https://api.github.com/repos/$repo \
    | jq '{name: .full_name, stars: .stargazers_count, forks: .forks_count}' \
    >> repos.json
  sleep 1
end
```

**Download Datasets from GitHub**

```bash
# Download CSV file
curl -O https://raw.githubusercontent.com/fivethirtyeight/data/master/college-majors/recent-grads.csv

# Download and process in one line
curl https://raw.githubusercontent.com/user/repo/main/data.csv | head -5
```

**Test Your Local API**

```bash
# If you have a local server running on port 8000
http POST localhost:8000/api/data name=test value:=42
http GET localhost:8000/api/data
```

**Create GitHub Issues from Data**

```bash
# Batch create issues from a list
cat issues.txt | while read line
  http POST https://api.github.com/repos/owner/repo/issues \
    Authorization:"token YOUR_TOKEN" \
    title="$line"
end
```

### Tools and Extensions

- [jq](https://jqlang.github.io/jq/): JSON processor for parsing responses
- [Newman](https://www.npmjs.com/package/newman): Run Postman collections from CLI
- [Paw](https://paw.cloud/): macOS native HTTP client
- [Insomnia](https://insomnia.rest/): Open-source alternative to Postman
- [Bruno](https://www.usebruno.com/): Git-friendly API client
- [Hoppscotch](https://hoppscotch.io/): Open-source web-based API testing

Learn more:

- [curl documentation](https://curl.se/docs/)
- [HTTPie documentation](https://httpie.io/docs/cli)
- [Postman Learning Center](https://learning.postman.com/)
- [HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
