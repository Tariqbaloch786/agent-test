import openai
import pytest

from app import llm, moderation
from types import SimpleNamespace


def test_ask_returns_the_first_choice(monkeypatch):
    # Patch the new client method used in llm.ask
    monkeypatch.setattr(
        llm.client.chat.completions,
        "create",
        lambda **_: SimpleNamespace(
            choices=[SimpleNamespace(message=SimpleNamespace(content="hello"))]
        ),
    )
    assert llm.ask("hi") == "hello"


def test_ask_wraps_rate_limits(monkeypatch):
    # Simulate a rate limit error using the new exception location
    def limited(**_):
        raise openai.RateLimitError("slow down")

    monkeypatch.setattr(
        llm.client.chat.completions,
        "create",
        limited,
    )
    with pytest.raises(llm.AssistantError):
        llm.ask("hi")


def test_embed_returns_the_vector(monkeypatch):
    # Patch the new embeddings client method
    monkeypatch.setattr(
        llm.client.embeddings,
        "create",
        lambda **_: SimpleNamespace(
            data=[SimpleNamespace(embedding=[0.25, 0.5])]
        ),
    )
    assert llm.embed("x") == [0.25, 0.5]


def test_moderation_reads_the_flag(monkeypatch):
    # Patch the new moderation client method
    monkeypatch.setattr(
        moderation.client.moderations,
        "create",
        lambda **_: SimpleNamespace(
            results=[SimpleNamespace(flagged=True)]
        ),
    )
    assert moderation.is_flagged("x") is True
