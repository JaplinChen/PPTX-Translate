import React from "react";

function LlmTab({
    llmProvider,
    llmApiKey,
    setLlmApiKey,
    llmBaseUrl,
    setLlmBaseUrl,
    llmFastMode,
    setLlmFastMode,
    llmModel,
    setLlmModel,
    displayedModels,
    onDetect,
    llmStatus,
    defaultBaseUrl,
    showKey,
    setShowKey
}) {
    return (
        <form onSubmit={(event) => event.preventDefault()}>
            {llmProvider !== "ollama" ? (
                <div className="config-field compact">
                    <label>API Key</label>
                    <div className="inline-row">
                        <input
                            name="llmApiKey"
                            type={showKey ? "text" : "password"}
                            value={llmApiKey}
                            onChange={(event) => setLlmApiKey(event.target.value)}
                            autoComplete="new-password"
                            placeholder="輸入 API Key"
                        />
                        <button
                            className="btn-icon-action"
                            type="button"
                            onClick={() => setShowKey((prev) => !prev)}
                        >
                            {showKey ? "🙈" : "👁️"}
                        </button>
                    </div>
                    <p className="hint">請輸入對應供應商的 API Key。</p>
                </div>
            ) : (
                <div className="config-field compact">
                    <label>Base URL</label>
                    <input
                        type="text"
                        value={llmBaseUrl}
                        onChange={(event) => setLlmBaseUrl(event.target.value)}
                        placeholder={defaultBaseUrl}
                    />
                    <p className="hint">本機端預設為 {defaultBaseUrl}</p>
                </div>
            )}

            {llmProvider === "ollama" ? (
                <div className="config-field compact">
                    <label>Ollama 快速模式</label>
                    <label className="toggle-row">
                        <input
                            type="checkbox"
                            checked={llmFastMode}
                            onChange={(event) => setLlmFastMode(event.target.checked)}
                        />
                        <span>小批次、關閉單次請求</span>
                    </label>
                </div>
            ) : null}

            <div className="config-field compact">
                <div className="inline-row between">
                    <label>模型</label>
                    <button className="text-btn" type="button" onClick={onDetect}>
                        重新整理
                    </button>
                </div>
                <select
                    className="model-select"
                    value={llmModel}
                    onChange={(event) => setLlmModel(event.target.value)}
                >
                    {(displayedModels || []).length === 0 ? (
                        <option value="">請選擇模型</option>
                    ) : (
                        (displayedModels || []).map((model) => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))
                    )}
                </select>
                <div className="inline-row">
                    <input
                        type="text"
                        value={llmModel}
                        onChange={(event) => setLlmModel(event.target.value)}
                        placeholder="輸入自訂模型"
                    />
                    <button className="btn ghost" type="button" onClick={() => setLlmModel(llmModel)}>
                        加入
                    </button>
                </div>
                <p className="hint">{llmStatus || "請先偵測模型"}</p>
            </div>
        </form>
    );
}

export default LlmTab;
