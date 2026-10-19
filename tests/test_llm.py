import openai
import pytest

from app import llm, moderation


def test_ask_returns_the_first_choice(monkeypatch):
    monkeypatch.setattr(openai.ChatCompletion, "create", lambda **_: {"choices": [{"message": {"content": "hello"}}]})
    assert llm.ask("hi") == "hello"


def test_ask_wraps_rate_limits(monkeypatch):
    def limited(**_):
        raise openai.error.RateLimitError("slow down")

    monkeypatch.setattr(openai.ChatCompletion, "create", limited)
    with pytest.raises(llm.AssistantError):
        llm.ask("hi")


def test_embed_returns_the_vector(monkeypatch):
    monkeypatch.setattr(openai.Embedding, "create", lambda **_: {"data": [{"embedding": [0.25, 0.5]}]})
    assert llm.embed("x") == [0.25, 0.5]


def test_moderation_reads_the_flag(monkeypatch):
    monkeypatch.setattr(openai.Moderation, "create", lambda **_: {"results": [{"flagged": True}]})
    assert moderation.is_flagged("x") is True
