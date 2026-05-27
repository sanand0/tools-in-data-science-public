# Scrapy

Scrapy is the industry standard for large-scale, asynchronous web crawling in Python.

## Architecture
- **Spiders:** Define how to navigate a site and extract data.
- **Item Pipelines:** Process the extracted data (clean it, save to DB).
- **Middlewares:** Intercept requests/responses to add headers, handle proxies, or bypass captchas.

## Example Spider
```python
import scrapy

class BlogSpider(scrapy.Spider):
    name = 'blogspider'
    start_urls = ['https://blog.example.com']

    def parse(self, response):
        for title in response.css('.post-title ::text').getall():
            yield {'title': title}

        for next_page in response.css('a.next-page ::attr(href)').getall():
            yield response.follow(next_page, self.parse)
```

---

