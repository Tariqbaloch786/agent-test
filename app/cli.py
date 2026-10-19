"""Command-line entry point: ask one question."""

import sys

from app.llm import ask
from app.moderation import is_flagged


def main() -> int:
    question = " ".join(sys.argv[1:]) or "Say hello"
    if is_flagged(question):
        print("That question cannot be answered.")
        return 1
    print(ask(question))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
