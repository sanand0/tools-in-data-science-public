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
import json
import os
import random
import sqlite3
import time
from PIL import Image, ImageDraw
from faker import Faker

config = {"root": "/data"}


def write_file(path, content):
    with open(os.path.join(config["root"], path), "w", encoding="utf-8") as f:
        f.write(content)


def a2_format_markdown():
    """Generate a poorly formatted markdown file at format.md"""
    write_file(
        "format.md",
        f"""#Unformatted Markdown

This  is a sample paragraph with extra  spaces and trailing whitespace.
-   First item
-    Second item
+Third item
    *    Fourth item

```py
print("{config["email"]}")

```
""",
    )


def a3_dates():
    """Save 1,000 random non-unique dates between 2000-01-01 and 2024-12-31 at dates.txt

    Generates dates in various unambiguous formats:
    - ISO 8601: yyyy-mm-dd
    - dd-MMM-yyyy
    - MMM dd, yyyy
    - yyyy/mm/dd HH:MM:SS
    """
    random.seed(f"{config['email']}:a3", version=2)
    start_date = datetime.datetime(2000, 1, 1)
    end_date = datetime.datetime(2024, 12, 31)
    formats = [
        "%Y-%m-%d",  # 2024-03-14
        "%d-%b-%Y",  # 14-Mar-2024
        "%b %d, %Y",  # Mar 14, 2024
        "%Y/%m/%d %H:%M:%S",  # 2024/03/14 15:30:45
    ]
    timestamps = random.sample(range(int(start_date.timestamp()), int(end_date.timestamp())), 1000)
    dates = [
        datetime.datetime.fromtimestamp(ts).strftime(random.choice(formats)) for ts in timestamps
    ]
    write_file("dates.txt", "\n".join(dates))


def a4_contacts():
    """Generate a JSON with 100 contacts with random first_name, last_name, and email"""
    fake = Faker()
    fake.seed_instance(hash(f"{config['email']}:a4"))
    contacts = [
        {"first_name": fake.first_name(), "last_name": fake.last_name(), "email": fake.email()}
        for _ in range(100)
    ]
    write_file("contacts.json", json.dumps(contacts))


def a5_logs():
    """Generate 50 log files with 10 lines each of random content at logs/"""
    random.seed(f"{config['email']}:a5", version=2)
    fake = Faker()
    fake.seed_instance(hash(f"{config['email']}:a5"))
    os.makedirs(os.path.join(config["root"], "logs"), exist_ok=True)
    for i in range(50):
        write_file(f"logs/log-{i}.log", "\n".join([fake.text() for _ in range(10)]))
        path = os.path.join(config["root"], f"logs/log-{i}.log")
        # Pick random timestamps over the last year
        timestamp = random.randint(1, 24 * 60 * 60 * 365)
        os.utime(path, (time.time() - timestamp, time.time() - timestamp))


def a6_docs():
    """Generate 10 Markdown files each under 10 random subdirectories with random content."""
    random.seed(f"{config['email']}:a6", version=2)
    fake = Faker()
    fake.seed_instance(hash(f"{config['email']}:a6"))
    os.makedirs(os.path.join(config["root"], "docs"), exist_ok=True)
    for dir in fake.words(10):
        dirname = os.path.join(config["root"], "docs", dir)
        os.makedirs(dirname, exist_ok=True)
        for file in fake.words(10):
            prefix, suffix = random.randint(0, 10), random.randint(0, 10)
            path = os.path.join(dirname, f"{file}.md")
            write_file(path, "\n".join([fake.text() for _ in range(prefix)]))
            write_file(path, f"# {fake.sentence()}")
            write_file(path, "\n".join([fake.text() for _ in range(suffix)]))


def a7_email():
    """Generate an email file at email.txt"""
    fake = Faker()
    fake.seed_instance(hash(f"{config['email']}:a7"))
    recipient = fake.email()
    write_file(
        "email.txt",
        f"""Delivered-To: {recipient}
MIME-Version: 1.0
From: "{fake.name()}" <{fake.email()}>
Date: {fake.date_time().strftime("%a, %d %b %Y %H:%M:%S +0000")}
Subject: {fake.sentence()}
To: "{fake.name()}" <{recipient}>
Cc: "{fake.name()}" <{fake.email()}>, "{fake.name()}" <{fake.email()}>, "{fake.name()}" <{fake.email()}>
Content-Type: multipart/alternative; boundary="00000000000091a0ba062bcdefca"

--00000000000091a0ba062bcdefca
Content-Type: text/plain; charset="UTF-8"
Content-Transfer-Encoding: quoted-printable

{fake.text()}

--00000000000091a0ba062bcdefca--
""",
    )


def a8_credit_card_image():
    """Generate a credit card image at credit_card.png that mimics a real credit card layout"""
    fake = Faker()
    fake.seed_instance(hash(f"{config['email']}:a8"))

    # Create image with credit card proportions (3.375" x 2.125" at 300 DPI)
    WIDTH, HEIGHT = 1012, 638
    image = Image.new("RGB", (WIDTH, HEIGHT), (25, 68, 141))  # Deep blue background
    draw = ImageDraw.Draw(image)
    # Format credit card number with spaces
    cc_number = " ".join([fake.credit_card_number()[i : i + 4] for i in range(0, 16, 4)])
    # Position elements
    draw.text((50, 250), cc_number, fill=(255, 255, 255))
    draw.text((50, 400), "VALID\nTHRU", fill=(255, 255, 255))
    draw.text((50, 480), fake.credit_card_expire(), fill=(255, 255, 255))
    draw.text((250, 480), fake.credit_card_security_code(), fill=(255, 255, 255))
    draw.text((50, 550), fake.name().upper(), fill=(255, 255, 255))

    image.save(os.path.join(config["root"], "credit_card.png"))


def a9_comments():
    """Generate a comments.txt file with 100 random comments"""
    fake = Faker()
    fake.seed_instance(hash(f"{config['email']}:a9"))
    write_file("comments.txt", "\n".join([fake.paragraph() for _ in range(100)]))


def a10_ticket_sales():
    """Generate ticket-sales.db with a tickets(type, units, price) table. 1 row per ticket"""
    random.seed(f"{config['email']}:a10", version=2)
    conn = sqlite3.connect(os.path.join(config["root"], "ticket-sales.db"))
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tickets (
            type TEXT NOT NULL,
            units INTEGER NOT NULL,
            price DECIMAL(10,2) NOT NULL
        )
    """)
    ticket_types = ["Gold", "Silver", "Bronze"]
    tickets = [
        (
            random.choice(ticket_types),
            random.randint(1, 10),
            round(random.uniform(50, 150), 2)
        )
        for _ in range(1000)
    ]
    cursor.executemany("INSERT INTO tickets VALUES (?, ?, ?)", tickets)
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
