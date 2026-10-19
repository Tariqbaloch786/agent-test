"""Moderation of user input before it reaches the assistant."""

import openai


def is_flagged(text: str) -> bool:
    """Whether the moderation endpoint flags the text."""
    result = openai.Moderation.create(input=text)
    return bool(result["results"][0]["flagged"])
