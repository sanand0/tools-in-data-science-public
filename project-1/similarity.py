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
import os
import pandas as pd
import tokenize
from datasketch import MinHash
from io import BytesIO


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
        if (
            len(body)
            and isinstance(body[0], ast.Expr)
            and isinstance(body[0].value, ast.Constant)
        ):
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
        **{f"similar_{i + 1}": b for i, b in enumerate(top_10["other"])},
        **{f"jaccard_{i + 1}": j for i, j in enumerate(top_10["jaccard"])},
    }
    return pd.Series(result)


def get_similarity(root, shingle_size):
    minhashes = {}
    for dir in os.listdir(root):
        if not os.path.isdir(os.path.join(root, dir)):
            continue
        # Get all python files via os.walk
        py_files = []
        for root_dir, dirs, files in os.walk(os.path.join(root, dir)):
            # Skip environment directories
            dirs[:] = [
                d
                for d in dirs
                if not os.path.exists(os.path.join(root_dir, d, "pyenv.cfg"))
                and not os.path.exists(os.path.join(root_dir, d, "activate"))
                and not d.startswith("_")
                and not d.startswith(".")
                and not d.endswith("env")
            ]
            py_files.extend(
                os.path.join(root_dir, f)
                for f in files
                if f.endswith(".py") and not f.startswith(".") and not f.startswith("_")
            )
        print(dir, py_files)
        words = []
        for script in py_files:
            with open(script, "rb") as f:
                code = f.read()
            try:
                code = strip_docstrings(code)
            except Exception as e:
                print(f"Error processing {dir}: {e}")
                continue
            words.extend(get_tokens(code))
            if len(words) < 10:
                continue
        minhashes[dir] = MinHash()
        for shingle in get_shingles(words, n=shingle_size):
            minhashes[dir].update(shingle.encode("utf-8"))

    jaccard = []
    for dir_id in minhashes:
        for dir_other in minhashes:
            if dir_id == dir_other:
                continue
            jaccard.append(
                (dir_id, dir_other, minhashes[dir_id].jaccard(minhashes[dir_other]))
            )
    pairwise = pd.DataFrame(jaccard, columns=["id", "other", "jaccard"])
    similarity = (
        pairwise.groupby("id").apply(get_top_matches, include_groups=False).unstack()
    )
    return pairwise, similarity


if __name__ == "__main__":
    pairwise, similarity = get_similarity(".", shingle_size=5)
    pairwise.to_csv(os.path.join(".", "pairwise.csv"), index=False)
    similarity.to_csv(os.path.join(".", "similarity.csv"))
