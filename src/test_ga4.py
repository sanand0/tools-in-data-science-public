"""Test the solutions of ga-2.9.json using Tabula"""

import calendar
import json
import os
import pandas as pd
import pytest
import sqlalchemy
import yaml
from scipy import stats
from statsmodels.tsa.exponential_smoothing.ets import ETSModel

folder = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "questions"))
flights = pd.read_parquet(os.path.join(folder, "..", "data", "flights", "flights.parquet"))
rent = pd.read_csv(os.path.join(folder, "..", "data", "house-rent", "house-rent.csv"))
months = list(calendar.month_name)
info = {}
ga4_questions = yaml.safe_load(open(os.path.join(folder, "ga4.yaml")))
ga4_4_questions = next(q for q in ga4_questions if q["description"] == "TDSGA4.4")["data"]


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga4.1.json"))))
def test_ga4_1(item):
    # **Question**: What's the Pearson correlation between `DEPARTURE_DELAY` and `ARRIVAL_DELAY`
    # for flights traveling less than **${distance}** miles with
    # scheduled departure starting from **${startHour}:00** and before **${endHour}:00**?
    subset = flights[
        (flights["DISTANCE"] < item["distance"])
        & (flights["SCHEDULED_DEPARTURE"] >= item["startHour"])
        & (flights["SCHEDULED_DEPARTURE"] < item["endHour"])
    ]
    correlation = subset["DEPARTURE_DELAY"].corr(subset["ARRIVAL_DELAY"])
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert item["count"] == len(subset)
    # Check if correlation == correct_answer to within 5 decimal places
    assert round(correlation, 5) == float(correct_answer)


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga4.2.json"))))
def test_ga4_2(item):
    # 1. Filter for flights traveling less than **${distance}** miles with scheduled departure starting from **${startHour}:00** and before **${endHour}:00**.
    # 2. Find the IQR - the difference between Q1 (first quartile) and Q3 (third quartile).
    # 3. Calculate the lower and upper bounds. The lower bound is Q1 - 1.5 * IQR and the upper bound is Q3 + 1.5 * IQR.
    # 4. Count the number of arrival delays that are outside the lower and upper bounds. (Arrival delays *exactly at* the bounds are not outliers.)
    subset: pd.DataFrame = flights[
        (flights["DISTANCE"] < item["distance"])
        & (flights["SCHEDULED_DEPARTURE"] >= item["startHour"])
        & (flights["SCHEDULED_DEPARTURE"] < item["endHour"])
    ]
    q1 = subset["ARRIVAL_DELAY"].quantile(0.25)
    q3 = subset["ARRIVAL_DELAY"].quantile(0.75)
    iqr = q3 - q1
    lo = q1 - 1.5 * iqr
    hi = q3 + 1.5 * iqr
    outliers = subset[(subset["ARRIVAL_DELAY"] < lo) | (subset["ARRIVAL_DELAY"] > hi)]
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert str(len(outliers)) == correct_answer.replace(",", "")


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga4.3.json"))))
def test_ga4_3(item):
    # **Question**: How much faster does the rent increase per square foot for **${furnishing}** houses in **${city1}** vs in **${city2}**?
    # 1. Calculate the regression slope of rent vs size (in Rs / sft) for **${furnishing}** houses in **${city1}**.
    # 2. Calculate the same for **${furnishing}** houses in **${city2}**.
    # 3. Find the absolute difference
    d = rent
    data1 = d[(d["Furnishing Status"] == item["furnishing"]) & (d["City"] == item["city1"])]
    data2 = d[(d["Furnishing Status"] == item["furnishing"]) & (d["City"] == item["city2"])]
    slope1 = stats.linregress(data1["Size"], data1["Rent"]).slope
    slope2 = stats.linregress(data2["Size"], data2["Rent"]).slope
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert round(abs(slope2 - slope1), 5) == float(correct_answer)


def get_est_hourly():
    if "est_hourly" not in info:
        info["est_hourly"] = pd.read_excel(
            os.path.join(folder, "..", "data", "electricity", "est_hourly.xlsx"),
            sheet_name="data",
            dtype={"Month": str},
        )
    return info["est_hourly"]


# Skip this test as statsmodels ETSModel does not align with Excel FORECAST.ETS
@pytest.mark.skip
@pytest.mark.parametrize("item", ga4_4_questions)
def test_ga4_4(item):
    # For **${series}**, take just the data for the month of **${month}**. Use Excel's **FORECAST.ETS()** function to forecast the
    # energy consumption at **${date}**.
    month_index = months.index(item["month"].split(" ")[0])
    year = item["month"].split(" ")[1]
    month = f"{year}{month_index:02d}"
    est_hourly = get_est_hourly()
    series = est_hourly[est_hourly["Month"] == month][item["series"]]
    # FORECAST.ETS uses Holt-Winters AAA model. Let's assume it has a 24-hour seasonality
    model = ETSModel(
        series.values,
        error="add",
        trend="add",
        seasonal="add",
        damped_trend=False,
        seasonal_periods=24,
    )
    fit = model.fit(disp=False)
    forecast = fit.forecast(steps=12)
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert round(forecast[-1], 2) == float(correct_answer)


def get_city_cuisine():
    if "city_cuisine" not in info:
        con = "mysql+pymysql://guest:relational@db.relational-data.org/restbase"
        engine = sqlalchemy.create_engine(con)
        data = pd.read_sql("SELECT * FROM generalinfo", engine)
        # Calculate the number of restaurants for each city & cuisine
        count = data.groupby(["city", "food_type"])["id_restaurant"].count().unstack().fillna(0).T
        info["city_cuisine"] = count
    return info["city_cuisine"]


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "ga4.5.json"))))
def test_ga4_5(item):
    # In the [San Francisco restaurant dataset (MySQL)](https://relational-data.org/dataset/Restbase),
    # ${city} has ${count} restaurants.
    # Count the percentage of restaurants that serve **${cuisine}** food_type in each city.
    # **Question**: How many cities have a higher percentage of **${cuisine}** food_type than **${city}** does?
    count = get_city_cuisine()
    percent = count / count.sum()
    city = item["city"]
    cuisine = item["cuisine"]
    answer = (percent.loc[cuisine] > percent[city][cuisine]).sum()
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    assert item["count"] == count[city].sum()
    assert answer == int(correct_answer)
