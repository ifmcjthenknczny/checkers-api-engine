import json
import sys


BUCKET_SIZE = 0.2


def eval_spread(file_path: str) -> None:
    with open(file_path) as f:
        data = json.load(f)

    evals = [item["eval"] for item in data if "eval" in item]
    total = len(evals)

    buckets: dict[str, int] = {}
    low = -1.0
    while low < 1.0:
        high = round(low + BUCKET_SIZE, 1)
        label = f"[{low:+.1f}, {high:+.1f}]"
        buckets[label] = sum(1 for e in evals if low <= e <= high)
        low = round(high + 0.0001, 4)

    print("Total:", total)
    print()
    for label, count in buckets.items():
        bar = "█" * int(count / total * 50) if total else ""
        print(f"{label}: {count:>8} ({count/total:.4%})  {bar}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: uv run eval_spread.py <file>")
        sys.exit(1)

    eval_spread(sys.argv[1])
