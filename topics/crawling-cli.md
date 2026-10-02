## Crawling with the CLI

Since websites are a common source of data, we often download entire websites (crawling) and then process them offline.

Web crawling is essential in many data-driven scenarios:

- **Data mining and analysis**: Gathering structured data from multiple pages for market research, competitive analysis, or academic research
- **Content archiving**: Creating offline copies of websites for preservation or backup purposes
- **SEO analysis**: Analyzing site structure, metadata, and content to improve search rankings
- **Legal compliance**: Capturing website content for regulatory or compliance documentation
- **Website migration**: Creating a complete copy before moving to a new platform or design
- **Offline access**: Downloading educational resources, documentation, or reference materials for use without internet connection

The most commonly used tool for fetching websites is [`wget`](https://www.gnu.org/software/wget/). It is pre-installed in many UNIX distributions and easy to install.

[![Scraping Websites using Wget (8 min)](https://i.ytimg.com/vi/pLfH5TZBGXo/sddefault.jpg)](https://youtu.be/pLfH5TZBGXo)

To crawl the [IIT Madras Data Science Program website](https://study.iitm.ac.in/ds/) for example, you could run:

```bash
wget \
  --recursive \
  --level=3 \
  --no-parent \
  --convert-links \
  --adjust-extension \
  --compression=auto \
  --accept html,htm \
  --directory-prefix=./ds \
  https://study.iitm.ac.in/ds/
```

Here's what each option does:

- `--recursive`: Enables recursive downloading (following links)
- `--level=3`: Limits recursion depth to 3 levels from the initial URL
- `--no-parent`: Restricts crawling to only URLs below the initial directory
- `--convert-links`: Converts all links in downloaded documents to work locally
- `--adjust-extension`: Adds proper extensions to files (.html, .jpg, etc.) based on MIME types
- `--compression=auto`: Automatically handles compressed content (gzip, deflate)
- `--accept html,htm`: Only downloads files with these extensions
- `--directory-prefix=./ds`: Saves all downloaded files to the specified directory

[wget2](https://gitlab.com/gnuwget/wget2) is a better version of `wget` and supports HTTP2, parallel connections, and only updates modified sites. The syntax is (mostly) the same.

```bash
wget2 \
  --recursive \
  --level=3 \
  --no-parent \
  --convert-links \
  --adjust-extension \
  --compression=auto \
  --accept html,htm \
  --directory-prefix=./ds \
  https://study.iitm.ac.in/ds/
```

There are popular free and open-source alternatives to Wget:

### Wpull

[Wpull](https://github.com/ArchiveTeam/wpull) is a wget‐compatible Python crawler that supports on-disk resumption, WARC output, and PhantomJS integration.

```bash
uvx wpull \
  --recursive \
  --level=3 \
  --no-parent \
  --convert-links \
  --adjust-extension \
  --compression=auto \
  --accept html,htm \
  --directory-prefix=./ds \
  https://study.iitm.ac.in/ds/
```

### HTTrack

[HTTrack](https://www.httrack.com/html/fcguide.html) is dedicated website‐mirroring tool with rich filtering and link‐conversion options.

```bash
httrack "https://study.iitm.ac.in/ds/" \
  -O "./ds" \
  "+*.study.iitm.ac.in/ds/*" \
  -r3
```

### Robots.txt

`robots.txt` is a standard file found in a website's root directory that specifies which parts of the site should not be accessed by web crawlers. It's part of the Robots Exclusion Protocol, an ethical standard for web crawling.

**Why it's important**:

- **Server load protection**: Prevents excessive traffic that could overload servers
- **Privacy protection**: Keeps sensitive or private content from being indexed
- **Legal compliance**: Respects website owners' rights to control access to their content
- **Ethical web citizenship**: Shows respect for website administrators' wishes

**How to override robots.txt restrictions**:

- **wget, wget2**: Use `-e robots=off`
- **httrack**: Use `-s0`
- **wpull**: Use `--no-robots`

**When to override robots.txt (use with discretion)**:

Only bypass `robots.txt` when:

- You have explicit permission from the website owner
- You're crawling your own website
- The content is publicly accessible and your crawling won't cause server issues
- You're conducting authorized security testing

Remember that bypassing `robots.txt` without legitimate reason may:

- Violate terms of service
- Lead to IP banning
- Result in legal consequences in some jurisdictions
- Cause reputation damage to your organization

Always use the minimum necessary crawling speed and scope, and consider contacting website administrators for permission when in doubt.
