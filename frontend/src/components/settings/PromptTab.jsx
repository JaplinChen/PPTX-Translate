import React from "react";

function PromptTab({
    promptList,
    selectedPrompt,
    setSelectedPrompt,
    promptContent,
    setPromptContent,
    promptLoading,
    PROMPT_LABELS
}) {
    return (
        <div className="prompt-editor-container">
            <div className="prompt-selector-row">
                <label className="prompt-selector-label">選擇 Prompt</label>
                <select
                    className="prompt-template-select"
                    value={selectedPrompt}
                    onChange={(event) => setSelectedPrompt(event.target.value)}
                >
                    {(promptList || []).map((name) => (
                        <option key={name} value={name}>
                            {(PROMPT_LABELS || {})[name] || name}
                        </option>
                    ))}
                </select>
            </div>
            <textarea
                className="prompt-textarea"
                value={promptContent}
                onChange={(event) => setPromptContent(event.target.value)}
                placeholder={promptLoading ? "載入中..." : "請輸入 Prompt 內容"}
                rows={16}
                spellCheck="false"
                disabled={promptLoading}
            />
        </div>
    );
}

export default PromptTab;
