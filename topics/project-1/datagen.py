# DISCLAIMER: THIS SCRIPT WILL CHANGE BEFORE THE EVALUATION. TREAT THIS AS A GUIDE.

# Usage: uv run datagen.py <email>

# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "faker",
#     "pillow",
# ]
# ///

import datetime
import hashlib
import json
import os
import random
import sqlite3
import time
from PIL import Image, ImageDraw, ImageFont
from faker import Faker

config = {"root": "/data"}


def num(str):
    return int(hashlib.sha256(str.encode()).hexdigest(), 16) % (2**32)


def write_file(path, content):
    with open(os.path.join(config["root"], path), "w", encoding="utf-8") as f:
        f.write(content)


def get_markdown(email):
    return f"""Header
=====

| Start | Mid | End |
|:--|---|--:|
| 1 | 2 | 3 |

  Paragraph has extra   spaces and trailing whitespace.\u0020\u0020

```py
print("{email}")

```
"""


def a2_format_markdown():
    """Generate a poorly formatted markdown file at format.md.

    This is a tricky file because formatting it _twice_ changes the format!
    """
    write_file("format.md", get_markdown(config["email"]))


def get_dates(email):
    random.seed(f"{email}:A3", version=2)
    start_date = datetime.datetime(2000, 1, 1, tzinfo=datetime.timezone.utc)
    end_date = datetime.datetime(2024, 12, 31, tzinfo=datetime.timezone.utc)
    formats = [
        "%Y-%m-%d",  # 2024-03-14
        "%d-%b-%Y",  # 14-Mar-2024
        "%b %d, %Y",  # Mar 14, 2024
        "%Y/%m/%d",  # 2024/03/14
    ]
    timestamps = random.sample(range(int(start_date.timestamp()), int(end_date.timestamp())), 1000)
    return [
        datetime.datetime.fromtimestamp(ts).strftime(random.choice(formats)) for ts in timestamps
    ]


def a3_dates():
    """Save 1,000 random non-unique dates between 2000-01-01 and 2024-12-31 at datefile.txt

    Generates dates in various unambiguous formats:
    - ISO 8601: yyyy-mm-dd
    - dd-MMM-yyyy
    - MMM dd, yyyy
    - yyyy/mm/dd HH:MM:SS
    """
    dates = get_dates(config["email"])
    write_file("datefile.txt", "\n".join(dates))


def get_contacts(email):
    fake = Faker()
    fake.seed_instance(num(f"{email}:A4"))
    return [
        {"first_name": fake.first_name(), "last_name": fake.last_name(), "email": fake.email()}
        for _ in range(100)
    ]


def a4_contacts():
    """Generate a JSON with 100 contacts with random first_name, last_name, and email"""
    contacts = get_contacts(config["email"])
    write_file("people.json", json.dumps(contacts))


def get_logs(email):
    files = []
    random.seed(f"{email}:A5", version=2)
    fake = Faker()
    fake.seed_instance(num(f"{email}:A5"))
    for i in range(50):
        text = "\n".join([fake.text() for _ in range(10)])
        age = random.randint(1, 24 * 60 * 60 * 365)
        files.append((age, text))
    return files


def a5_logs():
    """Generate 50 log files with 10 lines each of random content at logs/"""
    email = config["email"]
    os.makedirs(os.path.join(config["root"], "logs"), exist_ok=True)
    now = time.time()
    for i, (age, text) in enumerate(get_logs(email)):
        write_file(f"logs/log-{i}.log", text)
        os.utime(os.path.join(config["root"], f"logs/log-{i}.log"), (now - age, now - age))


def get_docs(email):
    files = []
    random.seed(f"{email}:A6", version=2)
    fake = Faker()
    fake.seed_instance(num(f"{email}:A6"))
    for dir in fake.words(10):
        for file in fake.words(10):
            prefix = "\n".join([fake.text() for _ in range(random.randint(0, 10))])
            heading = f"# {fake.sentence()}"
            suffix = "\n".join([fake.text() for _ in range(random.randint(0, 10))])
            text = "\n".join([prefix, heading, suffix])
            files.append((dir, file, text))
    return files


def a6_docs():
    """Generate 10 Markdown files each under 10 random subdirectories with random content."""
    email = config["email"]
    docs = get_docs(email)
    os.makedirs(os.path.join(config["root"], "docs"), exist_ok=True)
    for dir, file, text in docs:
        dirname = os.path.join(config["root"], "docs", dir)
        os.makedirs(dirname, exist_ok=True)
        write_file(os.path.join(dirname, f"{file}.md"), text)


def get_email(email):
    fake = Faker()
    fake.seed_instance(num(f"{email}:A7"))
    email = {
        "recipient": fake.email(),
        "from_name": fake.name(),
        "from_email": fake.email(),
        "date": fake.date_time().strftime("%a, %d %b %Y %H:%M:%S +0000"),
        "subject": fake.sentence(),
        "recipient_name": fake.name(),
        "cc_1_name": fake.name(),
        "cc_1_email": fake.email(),
        "cc_2_name": fake.name(),
        "cc_2_email": fake.email(),
        "cc_3_name": fake.name(),
        "cc_3_email": fake.email(),
        "body": fake.text(),
    }
    return email


def a7_email():
    """Generate an email file at mail.txt"""
    data = get_email(config["email"])
    write_file(
        "mail.txt",
        f"""Delivered-To: {data["recipient"]}
MIME-Version: 1.0
From: "{data["from_name"]}" <{data["from_email"]}>
Date: {data["date"]}
Subject: {data["subject"]}
To: "{data["recipient_name"]}" <{data["recipient"]}>
Cc: "{data["cc_1_name"]}" <{data["cc_1_email"]}>, "{data["cc_2_name"]}" <{data["cc_2_email"]}>, "{data["cc_3_name"]}" <{data["cc_3_email"]}>
Content-Type: multipart/alternative; boundary="00000000000091a0ba062bcdefca"

--00000000000091a0ba062bcdefca
Content-Type: text/plain; charset="UTF-8"
Content-Transfer-Encoding: quoted-printable

{data["body"]}

--00000000000091a0ba062bcdefca--
""",
    )


def get_credit_card(email):
    fake = Faker()
    fake.seed_instance(num(f"{email}:A8"))
    return {
        "number": fake.credit_card_number(),
        "expiry": fake.credit_card_expire(),
        "security_code": fake.credit_card_security_code(),
        "name": fake.name().upper(),
    }


def a8_credit_card_image():
    """Generate a credit card image at card.jpg that mimics a real credit card layout"""
    data = get_credit_card(config["email"])

    # Create image with credit card proportions (3.375" x 2.125" at 300 DPI)
    WIDTH, HEIGHT = 1012, 638
    image = Image.new("RGB", (WIDTH, HEIGHT), (25, 68, 141))  # Deep blue background
    draw = ImageDraw.Draw(image)

    try:
        # Try to use Arial
        large_font = ImageFont.truetype("arial.ttf", size=60)
        small_font = ImageFont.truetype("arial.ttf", size=30)
    except OSError:
        # Fall back to built-in Pillow font
        large_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size=60)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size=30)

    # Format credit card number with spaces
    cc_number = " ".join([data["number"][i : i + 4] for i in range(0, 16, 4)])

    # Position elements
    draw.text((50, 10), "Dummy sample card (safe to extract card number)", fill=(255, 255, 255), font=small_font)
    draw.text((50, 250), cc_number, fill=(255, 255, 255), font=large_font)
    draw.text((50, 400), "VALID\nTHRU", fill=(255, 255, 255), font=small_font)
    draw.text((50, 480), data["expiry"], fill=(255, 255, 255), font=small_font)
    draw.text((250, 480), data["security_code"], fill=(255, 255, 255), font=small_font)
    draw.text((50, 550), data["name"], fill=(255, 255, 255), font=small_font)

    image.save(os.path.join(config["root"], "card.jpg"))


def get_comments(email):
    fake = Faker()
    fake.seed_instance(num(f"{email}:A9"))
    return [fake.paragraph() for _ in range(100)]


def a9_comments():
    """Generate a comments.txt file with 100 random comments"""
    write_file("comments.txt", "\n".join(get_comments(config["email"])))


def get_tickets(email):
    random.seed(f"{email}:A10", version=2)
    ticket_types = ["Gold", "Silver", "Bronze"]
    return [
        (random.choice(ticket_types), random.randint(1, 10), round(random.uniform(50, 150), 2))
        for _ in range(1000)
    ]


def a10_ticket_sales():
    """Generate ticket-sales.db with a tickets(type, units, price) table. 1 row per ticket"""
    target = os.path.join(config["root"], "ticket-sales.db")
    if os.path.exists(target):
        os.remove(target)
    conn = sqlite3.connect(target)
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS tickets (
            type TEXT NOT NULL,
            units INTEGER NOT NULL,
            price DECIMAL(10,2) NOT NULL
        )
    """
    )
    cursor.executemany("INSERT INTO tickets VALUES (?, ?, ?)", get_tickets(config["email"]))
    conn.commit()
    conn.close()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("email")
    parser.add_argument("--root", default="/data")
    args = parser.parse_args()
    config["email"] = args.email
    config["root"] = os.path.abspath(args.root)

    os.makedirs(config["root"], exist_ok=True)

    print("DISCLAIMER: THIS SCRIPT WILL CHANGE BEFORE THE EVALUATION. TREAT THIS AS A GUIDE.")
    print("Files created at", config["root"])

    a2_format_markdown()
    a3_dates()
    a4_contacts()
    a5_logs()
    a6_docs()
    a7_email()
    a8_credit_card_image()
    a9_comments()
    a10_ticket_sales()

# DISCLAIMER: THIS SCRIPT WILL CHANGE BEFORE THE EVALUATION. TREAT THIS AS A GUIDE.
