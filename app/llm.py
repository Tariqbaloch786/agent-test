"""The assistant's calls to the OpenAI API."""

import os

import openai

openai.api_key = os.environ.get("OPENAI_API_KEY", "")
client = openai.OpenAI()

MODEL = "gpt-4o-mini"
EMBEDDING_MODEL = "text-embedding-3-small"


class AssistantError(Exception):
    """The model could not answer."""


def ask(question: str) -> str:
    """One answer to one question."""
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": question}],
            temperature=0,
        )
    except openai.RateLimitError as error:
        raise AssistantError("the model is rate limited") from error
    return response.choices[0].message.content or ""


def embed(text: str) -> list[float]:
    """The embedding of a text."""
    result = client.embeddings.create(model=EMBEDDING_MODEL, input=text)
    return [float(value) for value in result.data[0].embedding]
