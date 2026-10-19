# assistant (API Update Agent demo, Python)

A small service on the `openai` Python SDK 0.28 (`openai.ChatCompletion`, `openai.Embedding`,
`openai.Moderation`, `openai.error`), managed with Poetry, checked by mypy and pytest in CI.

It exists so API Update Agent's Python support can be shown end to end: the PyPI release of openai
1.x is the update, the agent moves the SDK with Poetry (`pyproject.toml` and `poetry.lock`), and
the repository's own CI judges the migration.
