# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "datasketch",
#     "pandas",
#     "platformdirs",
#     "python-dotenv",
# ]
# ///

import ast
import dotenv
import os
import pandas as pd
import tokenize
from datasketch import MinHash
from io import BytesIO
from platformdirs import user_data_dir

dotenv.load_dotenv()
root = user_data_dir("tds-sep-24-project-2", "tds")


class RemoveDocstrings(ast.NodeTransformer):

    def visit_node(self, node):
        node.body = self._remove_docstring(node.body)
        # Remove standalone string expressions, which are practically like comments
        node.body = [
            stmt
            for stmt in node.body
            if not (
                isinstance(stmt, ast.Expr)
                and isinstance(stmt.value, ast.Constant)
                and isinstance(stmt.value.value, str)
            )
        ]
        return node

    def _remove_docstring(self, body):
        if len(body) and isinstance(body[0], ast.Expr) and isinstance(body[0].value, ast.Constant):
            body = body[1:]
        return body

    visit_Module = visit_node
    visit_FunctionDef = visit_node
    visit_AsyncFunctionDef = visit_node
    visit_ClassDef = visit_node


def strip_docstrings(code):
    tree = ast.parse(code)
    tree = RemoveDocstrings().visit(tree)
    return ast.unparse(tree)


def get_tokens(code):
    tokens = tokenize.tokenize(BytesIO(code.encode("utf-8")).readline)
    return [tok.string for tok in tokens]


def get_shingles(tokens, n=5):
    return [" ".join(tokens[i : i + n]) for i in range(len(tokens) - n + 1)]


def get_top_matches(group):
    top_10 = group.nlargest(10, "jaccard")
    result = {
        "max_jaccard": group["jaccard"].max(),
        "mean_jaccard": top_10["jaccard"].mean(),
        **{f"similar_{i+1}": b for i, b in enumerate(top_10["other"])},
        **{f"jaccard_{i+1}": j for i, j in enumerate(top_10["jaccard"])},
    }
    return pd.Series(result)


def get_similarity(root, time, shingle_size):
    minhashes = {}
    for dir in os.listdir(root):
        if not os.path.isdir(os.path.join(root, dir)):
            continue
        script = os.path.join(root, dir, "autolysis.py")
        if not os.path.exists(script):
            continue
        with open(script, "rb") as f:
            code = f.read()
        try:
            code = strip_docstrings(code)
        except Exception as e:
            print(f"Error processing {dir}: {e}")
            continue
        words = get_tokens(code)
        if len(words) < 10:
            continue
        minhashes[dir] = MinHash()
        for shingle in get_shingles(words, n=shingle_size):
            minhashes[dir].update(shingle.encode("utf-8"))

    jaccard = []
    for dir_id in minhashes:
        for dir_other in minhashes:
            if dir_id == dir_other or time[dir_id] < time[dir_other]:
                continue
            jaccard.append((dir_id, dir_other, minhashes[dir_id].jaccard(minhashes[dir_other])))
    similarity = pd.DataFrame(jaccard, columns=["id", "other", "jaccard"])
    top_similarity = (
        similarity.groupby("id").apply(get_top_matches, include_groups=False).unstack()
    )
    return top_similarity


if __name__ == "__main__":
    submissions = pd.read_csv(os.environ["SUBMISSION_URL"])
    submissions["id"] = submissions[submissions.columns[1]].str.split("@").str[0]
    submissions["time"] = pd.to_datetime(submissions[submissions.columns[0]])
    time = submissions[["id", "time"]].set_index("id")["time"].to_dict()

    similarity = get_similarity(root, time, shingle_size=5)
    similarity.to_csv(os.path.join(root, "similarity.csv"))
