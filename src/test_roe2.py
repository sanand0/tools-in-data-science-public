import hashlib
import json
import numpy as np
import os
import pandas as pd
import pytest
import sqlalchemy as sa
from scipy import stats


folder = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "questions"))
db_path = os.path.normpath(os.path.join(folder, "..", "data", "sfscores", "sfscores.db"))

engine = sa.create_engine(f"sqlite:///{db_path}")
businesses = pd.read_sql_query("SELECT * FROM businesses", engine)
violations = pd.read_sql_query("SELECT * FROM violations", engine)
violations["date"] = pd.to_datetime(violations["date"])
violations["weekday"] = violations["date"].dt.day_name()
violations = violations.merge(businesses, on="business_id", how="left")
inspections = pd.read_sql_query("SELECT * FROM inspections", engine)
inspections["date"] = pd.to_datetime(inspections["date"])
inspections["month"] = inspections["date"].dt.strftime("%Y-%m")
inspections = inspections.merge(businesses, on="business_id", how="left")
with open(os.path.join(folder, "temp.descembeddings.json"), encoding="utf-8") as f:
    embeddings = {key: np.array(val) for key, val in json.load(f).items()}

all_fields = pd.DataFrame([
  { "table": "businesses", "field": "business_id", "type": "integer" },
  { "table": "businesses", "field": "name", "type": "string" },
  { "table": "businesses", "field": "address", "type": "string" },
  { "table": "businesses", "field": "city", "type": "string" },
  { "table": "businesses", "field": "postal_code", "type": "string" },
  { "table": "businesses", "field": "latitude", "type": "number" },
  { "table": "businesses", "field": "longitude", "type": "number" },
  { "table": "businesses", "field": "phone_number", "type": "number" },
  { "table": "businesses", "field": "tax_code", "type": "string" },
  { "table": "businesses", "field": "business_certificate", "type": "integer" },
  { "table": "businesses", "field": "application_date", "type": "string", "format": "date" },
  { "table": "businesses", "field": "owner_name", "type": "string" },
  { "table": "businesses", "field": "owner_address", "type": "string" },
  { "table": "businesses", "field": "owner_city", "type": "string" },
  { "table": "businesses", "field": "owner_state", "type": "string" },
  { "table": "businesses", "field": "owner_zip", "type": "string" },
  { "table": "violations", "field": "business_id", "type": "integer" },
  { "table": "violations", "field": "date", "type": "string", "format": "date" },
  { "table": "violations", "field": "violation_type_id", "type": "string" },
  { "table": "violations", "field": "risk_category", "type": "string" },
  { "table": "violations", "field": "description", "type": "string" },
  { "table": "inspections", "field": "business_id", "type": "integer" },
  { "table": "inspections", "field": "score", "type": "number" },
  { "table": "inspections", "field": "date", "type": "string", "format": "date" },
  { "table": "inspections", "field": "type", "type": "string" },
])


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe2.1.json"))))
def test_roe2_1(item):
    # 1. From the violations table, count the violations grouped by **business_id** where the **risk_category** is **${riskCategory}** and **date** is on a **${weekday}**.
    # 2. Scrape the **postal_code** and **business_id** from each HTML file.
    # 3. Add the violations count for all the restaurants where the **postal_code** is **${postalCode}**.
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    subset = violations[
        (violations["risk_category"] == item["riskCategory"])
        & (violations["weekday"] == item["weekday"])
        & (violations["postal_code"] == item["postalCode"])
    ]
    assert len(subset) == int(correct_answer)


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe2.2.json"))))
def test_roe2_2(item):
    # 1. Scrape the **business_id**, **latitude** and **longitude** from each HTML file. Drop missing values.
    # 2. Scrape the **business_id** and **score** from the PDF file **inspections-${month}.pdf**. Drop missing values.
    # 3. Join these two datasets on **business_id**
    # 4. Round off the latitude and longitude to 2 decimal places (compatible with Python's round() function)
    # 5. Find the average **score** for each rounded-off latitude-longitude combination (this is what we mean by the "latitude-longitude grid")
    # 6. Pick the highest of these averages
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    subset = inspections[inspections["month"] == item["month"]].dropna(
        subset=["score", "latitude", "longitude"]
    )
    grid = subset.latitude.apply(lambda x: np.floor(x * 100) / 100).astype(
        str
    ) + subset.longitude.apply(lambda x: np.floor(x * 100) / 100).astype(str)
    groups = subset.groupby(grid).agg({"score": "mean", "business_id": "count"})
    assert abs(groups[groups.business_id > 5].score.max() - float(correct_answer)) < 1e5


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe2.3.json"))))
def test_roe2_3(item):
    # 1. Scrape the **postal_code**, **latitude** and **longitude** from each HTML file having your postal code. Drop missing values
    # 2. For each postal code
    #   - Calculate the average of the latitude and longitude values for all rows *in each* postal_code. This is (roughly) the centroid of that postal_code
    #   - Calculate the **Pythagorean** distance between each restaurants and the centroid, i.e. **SQRT((Lat1-Lat2)^2 + (Lon1-Lon2)^2)**
    #   - Calculate the average of these distances. Let's call this the "AVERAGE_DISTANCE_FROM_CENTROID" for each postal code
    # 3. Pick the postal code with the restaurant having the highest AVERAGE_DISTANCE_FROM_CENTROID
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    postal_codes = item["postalCodes"].split(", ")
    subset = businesses.dropna(subset=["latitude", "longitude", "postal_code"])
    subset = subset[subset["postal_code"].isin(postal_codes)]
    centroids = subset.groupby("postal_code").agg({"latitude": "mean", "longitude": "mean"})
    distances = subset.merge(centroids, on="postal_code")
    distances["distance"] = np.sqrt(
        (distances["latitude_x"] - distances["latitude_y"]) ** 2
        + (distances["longitude_x"] - distances["longitude_y"]) ** 2
    )
    avg_distances = distances.groupby("postal_code")["distance"].mean()
    assert avg_distances.idxmax() == correct_answer


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe2.4.json"))))
def test_roe2_4(item):
    # 1. Scrape the **business_id** and **date** from the **inspections-*.pdf** files. Drop missing values.
    # 2. Extract the **business_id** and **date** from the **violations** table where the **risk_category** is **${riskCategory}** and **date** is on or after **${date}**.
    # 3. Count the number of violations where the **business_id** and **date** is NOT in the **inspections-*.pdf** files.
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    subset = violations[
        (violations["risk_category"] == item["riskCategory"])
        & (violations["date"].dt.strftime("%Y-%m-%d") >= item["date"])
    ]
    right = inspections.drop_duplicates(subset=["business_id", "date"])
    subset = subset.merge(right, on=["business_id", "date"], how="left")
    assert len(subset[subset["name_y"].isnull()]) == int(correct_answer)


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe2.5.json"))))
def test_roe2_5(item):
    # 1. Scrape the **business_id** and **postal_code** from each HTML file. Drop missing values.
    # 2. Scrape the **business_id**, **date** and **score** from the PDF file **inspections-*.pdf**. Drop missing values.
    # 3. Extract the **business_id**, **date** and **description** from the **violations** table where the **description** has one or more of the words **${words}**.
    # 4. Join the **biz-*.html**, the **inspections-*.pdf**, and the **violations** table data by matching the **business_id** across all three datasets and the **date** across **inspections-*.pdf** and the **violations** table.
    # 5. Filter the joined data where the description has one or more of the words **${words}** (the entire word should match: "improper" should not match "improperly") and the score is **${score}** or more
    # 6. Find the postal code of these businesses and filter those matching **${postalCode}**
    # 7. Count the number of businesses
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    subset = businesses.dropna(subset=["business_id", "postal_code"])
    subset = subset[subset["postal_code"] == item["postalCode"]]
    inspections_subset = inspections.dropna(subset=["business_id", "date", "score"])
    inspections_subset = inspections_subset[inspections_subset["score"] >= item["score"]]
    # Get the violations that contain the any of the words. Check word boundary via \b{word}\b
    words = item["words"].split(", ")
    violations_subset = violations[
        violations["description"].str.contains("|".join([f"\\b{word}\\b" for word in words]))
    ]
    joined = subset.merge(inspections_subset, on="business_id", how="left")
    joined = joined.merge(violations_subset, on=["business_id", "date"], how="left")
    assert len(joined.dropna(subset=["name"])) == int(correct_answer.replace(",", ""))


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe2.6.json"))))
def test_roe2_6(item):
    # 1. Scrape the **business_id**, **latitude**, **longitude**, and **description** from each HTML file. Drop missing values. Also drop zero values for latitude or longitude.
    # 2. Extract the **business_id** and **description** from the **violations** table. Drop missing values.
    # 3. Add the **latitude** and **longitude** columns to the **violations** table joined by **business_id**
    # 4. Filter the joined data where the latitude is between **${latMin}** and **${latMax}** and the longitude is between **${lonMin}** and **${lonMax}**.
    # 5. Calculate the vectors embeddings of all the **description**s using **text-embedding-3-small**.
    # 6. Find the centroid of the embeddings by taking the average of all the vector embeddings. You will get a 1-dimensional vector.
    # 7. Find the most dissimilar embeddings. This has the highest Pythagorean distance from the centroid.
    # 8. Count the number of UNIQUE **business_id**s that have this most dissimilar embedding.
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    subset = violations.dropna(subset=["business_id", "description", "latitude", "longitude"])
    subset = subset[(subset["latitude"] != 0) & (subset["longitude"] != 0)]
    latMin, latMax, lonMin, lonMax = item["latMin"], item["latMax"], item["lonMin"], item["lonMax"]
    subset = subset[(subset["latitude"] >= float(latMin)) & (subset["latitude"] <= float(latMax))]
    subset = subset[(subset["longitude"] >= float(lonMin)) & (subset["longitude"] <= float(lonMax))]
    descs = subset["description"].unique()
    embeddings_subset = np.array([embeddings[desc] for desc in descs])
    centroid = np.mean(embeddings_subset, axis=0)
    distances = np.linalg.norm(embeddings_subset - centroid, axis=1)
    # Find the indices matching distances.max()
    most_dissimilar = descs[distances.argmax()]
    assert subset[subset["description"] == most_dissimilar]["business_id"].nunique() == int(correct_answer)


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe2.7.json"))))
def test_roe2_7(item):
    # 1. Scrape the **business_id**, **date** and **score** from the PDF files **inspections-*.pdf**. Drop missing values.
    # 2. Scrape the **business_id** and **postal_code** from the HTML files **biz-*.html** for the postal codes **${postalCodes}**. Drop missing values.
    # 3. Join the **inspections** data with the **HTML** data on **business_id**, combining data across all the above postal codes.
    # 4. Calculate the regression slope of the inspection scores (Y) against the date (X).
    # 5. Predict the inspection score for the date **${date}**.
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    subset = inspections.dropna(subset=["business_id", "date", "score", "postal_code"])
    subset = subset[subset["postal_code"].isin(item["postalCodes"].split(", "))]
    subset = subset.sort_values("date")
    # subset["date"] has Length: 2858, dtype: datetime64[ns]. Convert it to timestamp
    timestamps = pd.to_datetime(subset["date"]).apply(lambda x: x.timestamp())
    result = stats.linregress(timestamps, subset["score"])
    predicted_score = result.intercept + result.slope * pd.to_datetime(item["date"]).timestamp()
    assert abs(predicted_score - float(correct_answer)) < 1e5


@pytest.mark.parametrize("item", json.load(open(os.path.join(folder, "roe2.8.json"))))
def test_roe2_8(item):
    correct_answer = next(choice["text"] for choice in item["choices"] if choice["score"] == 1.0)
    fields = all_fields[(all_fields.table != item["table"]) | (all_fields.field != item["field"])]
    properties = {}
    for table, group in fields.groupby("table"):
        properties[table] = {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {row["field"]: props(row) for _, row in group.iterrows()},
            },
        }
    schema = { "type": "object", "properties": properties }
    # Get the last decimal 5 digits of the SHA-256 hash of the JSON representation of the list of cards
    hash = hashlib.sha256(json.dumps(schema, indent=2, sort_keys=True).encode()).hexdigest()
    # Convert to decimal and get last 5 digits
    decimal = int(hash, 16) % 100000
    assert decimal == int(correct_answer.replace(",", ""))


def props(row):
    result = {"type": row["type"]}
    if pd.notnull(row["format"]):
        result["format"] = row["format"]
    return result
