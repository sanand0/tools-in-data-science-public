import datetime
import hashlib
import json
import numpy as np
import os
import pandas as pd
import pytest
import tiktoken

folder = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "questions"))
encoder = tiktoken.encoding_for_model("gpt-3.5-turbo")

models = json.load(open(os.path.join(folder, "temp.openaimodels.json")))["data"]
cutoff = datetime.datetime(2024, 5, 15).timestamp()
models = [model for model in models if model["created"] < cutoff]
models.sort(key=lambda model: model["created"], reverse=True)
for index, model in enumerate(models):
    model["index"] = index

embeddings = json.load(open(os.path.join(folder, "temp.wordembeddings.json")))
addr = (
    pd.read_csv(os.path.join(folder, "..", "data", "address", "address.csv"), dtype=str)
    .fillna("")
    .set_index("text")
)
# Convert bday from dd-mm-yyyy to yyyy-mm-dd
addr["bday"] = addr["bday"].apply(lambda x: "-".join(reversed(x.split("-"))))


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga5.1.json"))))
def test_ga5_1(item):
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    # Convert the text (a string between 0-7) into 3 booleans as binary
    right = [c == "1" for c in bin(int(correct_answer))[2:].zfill(3)]
    model1 = next(model for model in models if model["id"] == item["model1"])
    model1date = datetime.datetime.fromtimestamp(model1["created"], datetime.timezone.utc)
    assert right[0] == (model1date.strftime("%Y-%m-%d") == item["model1date"])

    model2 = next(model for model in models if model["id"] == item["model2"])
    assert right[1] == (models[item["model2index"] % len(models)] == model2)

    model3 = next(model for model in models if model["id"] == item["model3"])
    model4 = next(model for model in models if model["id"] == item["model4"])
    model3diff = abs(model3["index"] - model4["index"]) - 1
    assert right[2] == (model3diff == item["model3diff"])


def clean(value):
    return "".join(c for c in value if c.isalnum()).lower()


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga5.3.json"))))
def test_ga5_3(item):
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    cards = []
    for text in item["attendees"].split("\n"):
        row = addr.loc[text]
        card = {key: clean(value) for key, value in row.to_dict().items() if value}
        if "country" in card:
            card["adr"] = {"country-name": card.pop("country")}
        cards.append(card)
    # Get the last decimal 5 digits of the SHA-256 hash of the JSON representation of the list of cards
    hash = hashlib.sha256(json.dumps(cards, indent=2, sort_keys=True).encode()).hexdigest()
    # Convert to decimal and get last 5 digits
    decimal = int(hash, 16) % 100000
    assert decimal == int(correct_answer.replace(",", ""))


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga5.5.json"))))
def test_ga5_5(item):
    # In the embedding vector of the word **${word}** using `text-embedding-3-small`,
    # how many of the 1,536 values are greater than **${cutoff}**?
    embedding = embeddings[item["word"]]
    cutoff = item["cutoff"]
    count = sum(value > cutoff for value in embedding)
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert count == int(correct_answer.replace(",", ""))


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga5.6.json"))))
def test_ga5_6(item):
    # What is the cosine similarity between the `text-embedding-3-small` embeddings of
    # **${word1}** and **${word2}**?
    embed1 = embeddings[item["word1"]]
    embed2 = embeddings[item["word2"]]
    similarity = np.dot(embed1, embed2) / (np.linalg.norm(embed1) * np.linalg.norm(embed2))
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert round(similarity, 5) == float(correct_answer)


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga5.7.json"))))
def test_ga5_7(item):
    # Which of the following word lists has the highest average cosine similarity with the word
    # **${word}** using `text-embedding-3-small`?
    embed = embeddings[item["word"]]
    for choice in item["choices"]:
        words = choice["text"].split(", ")
        average = sum(np.dot(embed, embeddings[word]) for word in words) / len(words)
        choice["average"] = average
    min_average = max(choice["average"] for choice in item["choices"])
    answer = next(choice["text"] for choice in item["choices"] if choice["average"] == min_average)
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert answer == correct_answer


@pytest.mark.parametrize(
    "item", json.load(open(os.path.join(folder, "ga5.8.json"), encoding="utf-8"))
)
def test_ga5_8(item):
    # If you passed the following text to the `gpt-3.5-turbo-0125` model, how many **cents**
    # would it cost, assuming that the cost per million input token is 50 cents?
    cost = len(encoder.encode(item["text"])) * 50 / 1e6
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert cost == float(correct_answer)
