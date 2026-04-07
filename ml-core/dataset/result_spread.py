import json
import sys
from collections import Counter


def result_spread(file_path: str) -> None:
    with open(file_path) as f:
        data = json.load(f)

    results = [item["result"] for item in data]
    counter = Counter(results)
    total = len(results)

    print("Total:", total)
    print()
    for value, count in sorted(counter.items()):
        print(f"{value}: {count} ({count/total:.4%})")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: uv run result_spread.py <file>")
        sys.exit(1)

    result_spread(sys.argv[1])
