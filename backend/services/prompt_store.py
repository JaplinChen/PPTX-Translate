from __future__ import annotations

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
PROMPTS_DIR = BASE_DIR / "prompts"


DEFAULT_PROMPTS = {
    "translate_json": (
        """請將每個區塊翻譯為 target_language。若提供 preferred_terms，必須優先使用。
  若提供 placeholder_tokens，必須完整保留，不可改動。
  若 payload 中含 context，必須遵守其規則。
  輸出需符合 contract_schema_example 的 JSON，且只輸出 JSON。

  【重要】表格翻譯規則：
  - 表格內容必須保持原有結構，每個儲存格的翻譯需與原文位置對應
  - 表格標題（表頭）應準確翻譯，保持術語一致性
  - 若同一表格中出現相同的專有名詞，必須使用相同的翻譯
  - 避免破壞表格的對齊與格式

  【術語一致性規則】：
  - 若提供 preferred_terms（術語表），必須嚴格遵守
  - 同一文件中相同術語必須維持一致的翻譯
  - 若術語表中的翻譯與上下文不完全相符，請以術語表為準

  目標語言：{target_language_label}
  目標語言代碼：{target_language_code}

  {language_hint}

  {payload}"""
    ),
    "system_message": (
        """你是負責翻譯 PPTX 文字區塊的助理。
只回傳 JSON，且必須符合 schema。"""
    ),
    "ollama_batch": (
        """請將每個區塊翻譯為目標語言。
目標語言：{target_language_label}
目標語言代碼：{target_language_code}
{language_hint}
{language_guard}
請保留標記並只輸出翻譯文字。
格式：
<<<BLOCK:0>>>
<翻譯文字>
<<<END>>>

輸入：
{blocks}"""
    ),
}


def _ensure_dir() -> None:
    PROMPTS_DIR.mkdir(parents=True, exist_ok=True)


def _ensure_defaults() -> None:
    _ensure_dir()
    for name, content in DEFAULT_PROMPTS.items():
        path = PROMPTS_DIR / f"{name}.md"
        if not path.exists():
            path.write_text(content, encoding="utf-8")


def list_prompts() -> list[str]:
    _ensure_defaults()
    return sorted([path.stem for path in PROMPTS_DIR.glob("*.md")])


def get_prompt(name: str) -> str:
    _ensure_defaults()
    path = PROMPTS_DIR / f"{name}.md"
    if not path.exists():
        raise FileNotFoundError(f"Prompt not found: {name}")
    return path.read_text(encoding="utf-8")


def save_prompt(name: str, content: str) -> None:
    _ensure_dir()
    path = PROMPTS_DIR / f"{name}.md"
    path.write_text(content, encoding="utf-8")


def render_prompt(name: str, variables: dict[str, str]) -> str:
    template = get_prompt(name)
    rendered = template
    for key, value in variables.items():
        rendered = rendered.replace(f"{{{key}}}", value)
    return rendered
