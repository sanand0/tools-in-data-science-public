import json
import numpy as np
import os
import pandas as pd
import pytest
import sqlalchemy as sa
from scipy import stats


folder = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "questions"))
db_path = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "data", "cdeschools", "cdeschools.db")
)
engine = sa.create_engine(f"sqlite:///{db_path}")
satscores = pd.read_sql_query("SELECT * FROM satscores WHERE rtype='S'", engine)
schools = pd.read_sql_query("SELECT * FROM schools", engine)
open_date = pd.to_datetime(schools["OpenDate"])
schools["Weekday"] = open_date.dt.day_name()
schools["Year"] = open_date.dt.year
grade_map = {"P": "-1", "K": "0", "Adult": "13"}
frpm = pd.read_sql_query("SELECT * FROM frpm", engine).replace({"Low Grade": grade_map})
frpm["Low Grade"] = frpm["Low Grade"].dropna().astype(int)
meals = frpm.groupby("County Name")[["Enrollment (K-12)", "Free Meal Count (K-12)"]].sum()
meals["freemeal%"] = meals["Free Meal Count (K-12)"] / meals["Enrollment (K-12)"]
with open(os.path.join(folder, "temp.schoolembeddings.json"), encoding="utf-8") as f:
    embeddings = {key: np.array(val) for key, val in json.load(f).items()}
columns = {
    "Number of test takers": "NumTstTakr",
    "Average Score: Read": "AvgScrRead",
    "Average Score: Math": "AvgScrMath",
    "Average Score: Write": "AvgScrWrite",
    "Number >= 1500": "NumGE1500",
    "Percent >= 1500": "PctGE1500",
}


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe1.1.json"))))
def test_roe1_1(item):
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    col1, col2 = columns[item["label1"]], columns[item["label2"]]
    correlation = satscores[col1].corr(satscores[col2])
    assert abs(correlation - float(correct_answer)) < 1e-5


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe1.2.json"))))
def test_roe1_2(item):
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    avg_distances = {}
    for choice in item["choices"]:
        city = schools[schools["City"] == choice["text"]].dropna(
            how="any", subset=["Latitude", "Longitude"]
        )
        latitudes = city["Latitude"].values
        longitudes = city["Longitude"].values
        lat_diff = latitudes[:, np.newaxis] - latitudes[np.newaxis, :]
        lon_diff = longitudes[:, np.newaxis] - longitudes[np.newaxis, :]
        distances = np.sqrt(lat_diff**2 + lon_diff**2)
        num_points = len(city)
        avg_distances[choice["text"]] = distances.sum() / (num_points * (num_points - 1))
    assert correct_answer == max(avg_distances, key=avg_distances.get)


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe1.3.json"))))
def test_roe1_3(item):
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    grade = int(grade_map.get(item["grade"], item["grade"]))
    subset = frpm[(frpm["School Type"] == item["type"]) & (frpm["Low Grade"] >= grade)]
    counties = subset["County Code"].nunique()
    assert counties == int(correct_answer)


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe1.4.json"))))
def test_roe1_4(item):
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    lat1, lat2 = float(item["lat1"]), float(item["lat2"])
    lon1, lon2 = float(item["lon1"]), float(item["lon2"])
    subset = schools[
        (schools["Latitude"] >= lat1)
        & (schools["Latitude"] <= lat2)
        & (schools["Longitude"] >= lon1)
        & (schools["Longitude"] <= lon2)
    ]
    # Join subset.CDSCode with satschools.cds
    matched = subset.merge(satscores, left_on="CDSCode", right_on="cds")
    # Among these matched schools, how many have an **Average Score: ${subject}** greater than **${score}**?
    num_schools = (matched[f'AvgScr{item["subject"]}'] >= int(item["score"])).sum()
    assert num_schools == int(correct_answer.replace(",", ""))


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe1.5.json"))))
def test_roe1_5(item):
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    # How many schools in **${county}** have an OpenDate that falls on a **${weekday}**?
    county, weekday = item["county"], item["weekday"]
    num_schools = len(schools[((schools["County"] == county) & (schools["Weekday"] == weekday))])
    if num_schools != int(correct_answer.replace(",", "")):
        print(county, weekday, num_schools, correct_answer)
    assert num_schools == int(correct_answer.replace(",", ""))


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe1.6.json"))))
def test_roe1_6(item):
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    counties = item["countyList"].split(", ")
    subject1, subject2 = f"AvgScr{item['subject1']}", f"AvgScr{item['subject2']}"
    subset = satscores[satscores["cname"].isin(counties)].dropna(subset=[subject1, subject2])
    # Regression slope of **AvgScr{subject2}** over **AvgScr{subject1}**
    m = stats.linregress(subset[subject1], subset[subject2]).slope
    assert abs(m - float(correct_answer)) < 1e-5


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe1.7.json"))))
def test_roe1_7(item):
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    counties = meals[meals["freemeal%"] > item["percent"] / 100].index
    subset = satscores[satscores["cname"].isin(counties)]
    prod = subset[f"AvgScr{item['subject']}"] * subset["NumTstTakr"]
    wag = prod.sum() / subset["NumTstTakr"].sum()
    assert abs(wag - float(correct_answer)) < 1e-3


@pytest.mark.parametrize(
    "item", json.load(open(os.path.join(folder, "roe1.8.json"), encoding="utf-8"))
)
def test_roe1_8(item):
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    subset = schools[schools["StatusType"] == item["statusType"]]
    subset = subset[subset["City"] == item["city"]]
    subset = subset[subset["Year"] == float(item["year"])]
    emb = np.vstack(subset["School"].map(embeddings).values)
    distances = np.dot(emb, emb.T)
    mins = np.unravel_index(np.argsort(distances, axis=None), distances.shape)
    ans = sorted([subset.iloc[mins[0][0]]["School"], subset.iloc[mins[1][0]]["School"]])
    assert correct_answer == f"{ans[0]} and {ans[1]}"
