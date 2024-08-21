"""Test the solutions of ga-2.9.json using Tabula"""

import json
import os
import pytest
import requests
import tabula


folder = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "questions"))
info = {}


def get_page(page):
    if "ga2.9" not in info:
        path = os.path.join(folder, "ga2.9.pdf")
        info["ga2.9"] = tabula.read_pdf(path, pages="all", multiple_tables=True)
    return info["ga2.9"][page]


@pytest.mark.parametrize(
    "item", json.load(open(os.path.join(folder, "ga2.5.json"), encoding="utf-8"))
)
def test_ga2_5(item):
    response = requests.get(
        "https://nominatim.openstreetmap.org/search",
        params={"city": item["city"], "country": item["country"], "format": "jsonv2"},
        headers={"User-Agent": "IITM-TDS Course anand@study.iitm.ac.in"},
    ).json()
    # Check with the matching OSM ID
    place = next(place for place in response if place["osm_id"] == item["osm_id"])
    answer = place["boundingbox"][0 if item["type"] == "minimum latitude" else 1]
    assert float(answer) == float(correct_answer(item))


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga2.9.json"))))
def test_ga2_9(item):
    # Initialize total marks
    total = 0

    # Iterate through the specified group range
    for page in range(item["start"] - 1, item["end"]):  # Convert to 0-based index
        # Extract the DataFrame for the current group
        df = get_page(page)

        # Filter students who scored more than or equal to `cutoff` in `other` subject
        filtered_df = df[df[item["other"]] >= item["cutoff"]]

        # Sum the marks of the filtered students in the `subject`
        total += filtered_df[item["subject"]].sum()

    assert str(total) == correct_answer(item)


def correct_answer(item):
    # item.choices is a list of { "text": "choice", "score": score }. score is 1.0 if correct, 0.0 otherwise.
    # Get the correct answer text and check it
    return next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
