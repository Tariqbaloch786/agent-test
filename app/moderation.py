"""Moderation of user input before it reaches the assistant."""

import openai

client = openai.OpenAI()

def is_flagged(text: str) -> bool:
    """Whether the moderation endpoint flags the text."""
    result = client.moderations.create(input=text)
    return result.results[0].flagged
