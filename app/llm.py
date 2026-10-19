"""The assistant's calls to the OpenAI API."""

import os

import openai

openai.api_key = os.environ.get("OPENAI_API_KEY", "")

MODEL = "gpt-4o-mini"
EMBEDDING_MODEL = "text-embedding-3-small"


class AssistantError(Exception):
    """The model could not answer."""


def ask(question: str) -> str:
    """One answer to one question."""
    try:
        response = openai.ChatCompletion.create(
            model=MODEL,
            messages=[{"role": "user", "content": question}],
            temperature=0,
        )
    except openai.error.RateLimitError as error:
        raise AssistantError("the model is rate limited") from error
    return str(response["choices"][0]["message"]["content"])


def embed(text: str) -> list[float]:
    """The embedding of a text."""
    result = openai.Embedding.create(model=EMBEDDING_MODEL, input=text)
    return [float(value) for value in result["data"][0]["embedding"]]
