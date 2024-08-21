"""Test the solutions of ga-2.9.json using Tabula"""

import json
import os
import pandas as pd
import pytest

folder = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "questions"))
logs = pd.read_csv(
    os.path.normpath(os.path.join(folder, "..", "data", "logs", "s-anand.net-May-2024.gz")),
    header=None,
    sep=" ",
    escapechar="\\",
    compression="gzip",
)
logs.columns = [
    "ip",
    "identd",
    "userid",
    "datetime",
    "timezone",
    "request",
    "status",
    "size",
    "referer",
    "userAgent",
    "vhost",
    "serverIp",
]
logs["datetime"] = logs["datetime"].str.slice(1)  # Remove leading [ from "[01/May/2024:00:00:00"
logs["size"] = logs["size"].replace("-", 0).astype(int)
logs["hour"] = logs.datetime.str.slice(12, 14).astype(int)
logs["date"] = pd.to_datetime(logs.datetime.str.slice(0, 11))
logs["weekday"] = logs["date"].dt.strftime("%A")
logs["datestr"] = logs["date"].dt.strftime("%Y-%m-%d")
logs["chromeVersion"] = logs["userAgent"].str.extract(r"Chrome/(\d+)")
sales = pd.read_json(os.path.join(folder, "..", "data", "city-product-sales.json"))


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga3.1.json"))))
def test_ga3_1(item):
    requests = logs[
        (logs.status >= 200)
        & (logs.status < 300)
        & logs.request.str.startswith(f"GET /{item['folder']}/")
        & (logs.hour >= item["startHour"])
        & (logs.hour < item["endHour"])
        & (logs.weekday == item["weekday"])
    ]
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert str(len(requests)) == correct_answer


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga3.2.json"))))
def test_ga3_2(item):
    requests = logs[
        logs.request.str.contains(f" /{item['folder']}/") & (logs.weekday == item["weekday"])
    ]
    got_answer = requests.groupby("hour")["ip"].nunique().max()
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert str(got_answer) == correct_answer


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga3.3.json"))))
def test_ga3_3(item):
    requests = logs[
        logs.request.str.contains(f" /{item['folder']}/")
        & logs.datestr.str.startswith(item["date"])
    ]
    got_answer = requests.groupby("ip")["size"].sum().max()
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert str(got_answer) == correct_answer


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga3.4.json"))))
def test_ga3_4(item):
    # Filter the logs to only include the date
    requests = logs[logs.datestr == item["date"]]
    # Count the number of times each major Chrome version accessed the site and get the max
    got_answer = requests["chromeVersion"].value_counts().max()
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert str(got_answer) == correct_answer


cities = [
    ["Tokyo", "Tokio", "Tokeyo", "Tokyoo", "Toikyo", "Tokyoo"],
    ["Delhi", "Deli", "Dehli", "Dhelhi", "Delly", "Dehly"],
    ["Shanghai", "Shangai", "Shanhai", "Shanghii", "Shangaai", "Shungai"],
    ["São Paulo", "Sao Paulo", "Sao Paolo", "Sao Paoulo", "Sau Paulo", "Sao Pualo"],
    ["Mumbai", "Mumbay", "Mombai", "Mumby", "Mumbbi", "Mumbei"],
    ["Beijing", "Bejing", "Bijing", "Bejeing", "Beijng", "Bejjing"],
    ["Cairo", "Kairo", "Kairoo", "Ciro", "Cairio", "Caiiro"],
    ["Dhaka", "Daka", "Dhaaka", "Dhakaa", "Dhacka", "Dhaka"],
    ["Mexico City", "Mexico Cty", "Mexiko City", "Mexicocity", "Mexicoo City", "Mexico-City"],
    ["Osaka", "Osaca", "Oosaka", "Osakka", "Osakkaa", "Osakaa"],
    ["Karachi", "Karachee", "Karrchi", "Karachii", "Karrachii", "Karachi"],
    ["Chongqing", "Chongquin", "Chongching", "Chongching", "Chongqinq", "Chongquiing"],
    ["Istanbul", "Istambul", "Istanbul", "Istaanbul", "Istanboul", "Istnabul"],
    [
        "Buenos Aires",
        "Buenes Aires",
        "Buenos Aeres",
        "Buienos Aires",
        "Buenos Airres",
        "Buenoss Aires",
    ],
    ["Kolkata", "Kolkotta", "Kolkatta", "Kolcata", "Kolcotta", "Kolkataa"],
    ["Lagos", "Lagoss", "Laggos", "Laggoss", "Lagoss", "Lagose"],
    ["Kinshasa", "Kinshasaa", "Kinshasha", "Kinshassa", "Kinshas", "Kinshasaa"],
    ["Manila", "Manilla", "Manilaa", "Manla", "Manil", "Mannila"],
    ["Tianjin", "Tianjin", "Tianjing", "Tiajin", "Tianjjin", "Tianjjin"],
    [
        "Rio de Janeiro",
        "Rio de Janero",
        "Rio de Janeirro",
        "Rio de Janiro",
        "Rio de Janerio",
        "Rio de Janiero",
    ],
    ["Guangzhou", "Guangzho", "Guangzou", "Guangzhoo", "Guanzhou", "Gwangzhou"],
    ["Lahore", "Lahor", "Lahoore", "Lahoore", "Lahorre", "Lahhore"],
    ["Bangalore", "Banglore", "Bangalor", "Bengalore", "Bangaloore", "Bangaloree"],
    ["Shenzhen", "Shenzen", "Shenzen", "Shenzhen", "ShenZhen", "Shenzheen"],
    ["Moscow", "Moskow", "Mosco", "Moskoww", "Moscow", "Mowscow"],
    ["Chennai", "Chenai", "Chennay", "Chennnai", "Chenaii", "Chennnai"],
    ["Bogotá", "Bogota", "Bogotaa", "Bogotta", "Bogata", "Bogotaa"],
    ["Paris", "Parris", "Parris", "Pariss", "Paris", "Paries"],
    ["Jakarta", "Jakarata", "Jakata", "Jakkarta", "Jakarata", "Jakkarta"],
    ["London", "Londen", "Londn", "Lonndon", "Londonn", "Londdon"],
]
citymap = {}
for city in cities:
    for variant in city:
        citymap[variant] = city[0]


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga3.5.json"))))
def test_ga3_5(item):
    # Select rows where the product is item["product"] and sales is at least item["minSales"]
    subset = sales[(sales["product"] == item["product"]) & (sales["sales"] >= item["minSales"])]
    subset["original"] = subset["city"].replace(citymap)
    actual_answer = subset.groupby("original")["sales"].sum().max()
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert str(actual_answer) == correct_answer
