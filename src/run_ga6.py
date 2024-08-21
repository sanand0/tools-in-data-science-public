import json
import networkx as nx
import numpy as np
import os
import pandas as pd
import random
import zipfile
from scipy.sparse import csr_matrix

root = os.path.dirname(os.path.dirname(__file__))

with zipfile.ZipFile(os.path.join(root, "data", "discourse", "discourse-topics.zip"), "r") as z:
    with z.open("discourse-topics.json") as file:
        topics = json.load(file)

nodes = {}
for topic in topics:
    for poster in topic["posters"]:
        nodes[poster["username"]] = {"type": "user", **poster}
    nodes[topic["topicId"]] = {"type": "topic", **topic}
links = [(poster["username"], topic["topicId"]) for topic in topics for poster in topic["posters"]]

G = nx.from_edgelist(links)
users = [node for node in G.nodes if nodes[node]["type"] == "user"]
topics = [node for node in G.nodes if nodes[node]["type"] == "topic"]
user_map = {user: i for i, user in enumerate(users)}
topic_map = {topic: i for i, topic in enumerate(topics)}

target = os.path.join(root, "questions", "ga6.6.json")
if not os.path.exists(target):
    degrees = pd.Series([G.degree(node) for node in users], index=users)
    results = []
    for degree in range(4, 54):
        user = random.choice(degrees[degrees == degree].index)
        ans = (degrees > degree).sum()
        d = random.randrange(0, 4)
        choices = [{"text": f"{ans - d + i:,d}", "score": 1 if d == i else 0} for i in range(4)]
        results.append({"degree": degree, "user": user, "choices": choices})
    with open(os.path.join(root, "questions", "ga6.6.json"), "w") as file:
        json.dump(results, file, indent=2)


def user_matrix():
    rows, cols = zip(*links)
    matrix = csr_matrix(
        (
            np.ones(len(links), dtype="int"),
            ([user_map[x] for x in rows], [topic_map[x] for x in cols]),
        ),
        (len(users), len(topics)),
    )
    square = matrix * matrix.T
    return square


def user_pairs(square):
    square.setdiag(0)
    coo = square.tocoo()
    user_series = pd.Series(users)
    pairs = pd.DataFrame(
        {
            "row": user_series[coo.row].values,
            "col": user_series[coo.col].values,
            "n": coo.data,
        }
    )
    return pairs[pairs["n"] > 0].copy()


target = os.path.join(root, "questions", "ga6.7.json")
if not os.path.exists(target):
    square = user_matrix()
    pairs = user_pairs(square)
    results = []
    for count, freq in pairs.n.value_counts().sort_index()[3:-5].items():
        subset = pairs[pairs.n == count]
        row = random.choice(subset.to_dict(orient="records"))
        ans = len(pairs[pairs.n > count])
        d = random.randrange(0, 4)
        choices = [{"text": f"{ans - d + i:,d}", "score": 1 if d == i else 0} for i in range(4)]
        results.append(
            {"user1": row["row"], "user2": row["col"], "count": count, "choices": choices}
        )
    with open(os.path.join(root, "questions", "ga6.7.json"), "w") as file:
        json.dump(results, file, indent=2)


def connected_author_degrees():
    square = user_matrix()
    pairs = user_pairs(square)
    user_g = nx.from_pandas_edgelist(pairs, "row", "col", "n")
    main_user_g = user_g.subgraph(list(nx.connected_components(user_g))[0])
    degrees = pd.Series([main_user_g.degree(node) for node in main_user_g], index=main_user_g)
    return main_user_g, degrees


target = os.path.join(root, "questions", "ga6.8.json")
if not os.path.exists(target):
    main_user_g, degrees = connected_author_degrees()
    single_coauthors = list(degrees[degrees == 1].index)
    results = []
    degrees = degrees.sort_values(ascending=False)
    while len(results) < 50:
        user1 = random.choice(single_coauthors)
        user2 = random.choice(single_coauthors)
        if user1 == user2:
            continue
        paths = list(nx.all_shortest_paths(main_user_g, user1, user2))
        if len(paths[0]) < 5:
            continue
        connectors = set([user for path in paths for user in path[2:-2]])
        wrong_users = set(degrees.index[:100]) - connectors
        wrong = random.sample(list(wrong_users), 3)
        connector = random.choice(list(connectors))
        choices = [{"text": connector, "score": 1}]
        choices += [{"text": user, "score": 0} for user in wrong]
        results.append({"user1": user1, "user2": user2, "choices": choices})
    with open(target, "w") as file:
        json.dump(results, file, indent=2)


target = os.path.join(root, "questions", "ga6.9.json")
if not os.path.exists(target):
    main_user_g, degrees = connected_author_degrees()
    single_coauthors = list(degrees[degrees == 1].index)
    results = []
    while len(results) < 50:
        user1 = random.choice(single_coauthors)
        user2 = random.choice(single_coauthors)
        if user1 == user2:
            continue
        paths = list(nx.all_shortest_paths(main_user_g, user1, user2))
        ans = len(paths)
        if ans < 3:
            continue
        d = random.randrange(0, 4)
        choices = [{"text": f"{ans - d + i:,d}", "score": 1 if d == i else 0} for i in range(4)]
        results.append({"user1": user1, "user2": user2, "len": len(paths[0]), "choices": choices})
    with open(target, "w") as file:
        json.dump(results, file, indent=2)
