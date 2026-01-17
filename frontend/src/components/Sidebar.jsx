import React from "react";

export function Sidebar({
    file, setFile,
    mode, setMode,
    bilingualLayout, setBilingualLayout,
    sourceLang, setSourceLang, setSourceLocked,
    secondaryLang, setSecondaryLang, setSecondaryLocked,
    targetLang, setTargetLang, setTargetLocked,
    useTm, setUseTm,
    languageOptions,
    busy,
    onExtract,
    onTranslate,
    onApply,
    canApply,
    blockCount,
    selectedCount,
    status,
    sidebarRef,
    modeDescription
}) {
    return (
        <section className="panel panel-left" ref={sidebarRef}>
            <div className="panel-header">
                <h2>操作設定</h2>
                <p>檔案上傳與處理流程</p>
            </div>

            <div className="form-group">
                <label className="field-label" htmlFor="pptx-file">選擇 PPTX 檔案</label>
                <input
                    id="pptx-file"
                    className="file-input"
                    type="file"
                    accept=".pptx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
            </div>

            <div className="row-group">
                <div className="form-group">
                    <label className="field-label" htmlFor="mode">處理模式</label>
                    <select
                        id="mode"
                        className="select-input"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                    >
                        <option value="bilingual">雙語輸出</option>
                        <option value="translated">翻譯文件</option>
                        <option value="correction">校正</option>
                    </select>
                </div>
                {mode === "bilingual" && (
                    <div className="form-group">
                        <label className="field-label" htmlFor="bilingual-layout">輸出方式</label>
                        <select
                            id="bilingual-layout"
                            className="select-input"
                            value={bilingualLayout}
                            onChange={(e) => setBilingualLayout(e.target.value)}
                        >
                            <option value="inline">同框</option>
                            <option value="auto">自動</option>
                            <option value="new_slide">新頁</option>
                        </select>
                    </div>
                )}
            </div>
            <p className="field-hint" style={{ marginTop: "-8px" }}>
                {mode === "bilingual" && bilingualLayout === "auto" ? "自動排版會嘗試縮字與分段" : modeDescription}
            </p>

            <div className="form-group">
                <label className="field-label" style={{ marginBottom: "8px" }}>語言設定</label>
                <div className="row-group-3">
                    <div className="form-group">
                        <label className="field-label">來源</label>
                        <select
                            className="select-input"
                            value={sourceLang || "auto"}
                            onChange={(e) => { setSourceLang(e.target.value); setSourceLocked(true); }}
                        >
                            {(languageOptions || []).map(opt => <option key={opt.code} value={opt.code}>{opt.label}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="field-label">第二</label>
                        <select
                            className="select-input"
                            value={secondaryLang || "auto"}
                            disabled={mode === "translated"}
                            onChange={(e) => { setSecondaryLang(e.target.value); setSecondaryLocked(true); }}
                            style={mode === "translated" ? { opacity: 0.5 } : {}}
                        >
                            {(languageOptions || []).map(opt => <option key={opt.code} value={opt.code}>{opt.label}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="field-label">{mode === "correction" ? "校正" : "翻譯"}</label>
                        <select
                            className="select-input"
                            value={targetLang}
                            onChange={(e) => { setTargetLang(e.target.value); setTargetLocked(true); }}
                        >
                            {(languageOptions || []).filter(opt => opt.code !== "auto").map(opt => (
                                <option key={opt.code} value={opt.code}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <label className="toggle-check">
                    <input type="checkbox" checked={useTm} onChange={(e) => setUseTm(e.target.checked)} />
                    使用翻譯記憶（TM）
                </label>
            </div>

            <div className="action-row">
                <button className="btn" type="button" onClick={onExtract} disabled={busy}>抽取區塊</button>
                <button className="btn ghost" type="button" onClick={onTranslate} disabled={busy || blockCount === 0}>自動翻譯</button>
                <button className="btn primary" type="button" onClick={onApply} disabled={!canApply}>套用並輸出</button>
            </div>

            <div className="flow-panel">
                <div className="flow-item">
                    <span className={`flow-dot ${file ? "is-active" : ""}`} />
                    <div><strong>1. 上傳 PPTX</strong><p>{file ? "已選擇" : "尚未選擇"}</p></div>
                </div>
                <div className="flow-item">
                    <span className={`flow-dot ${blockCount > 0 ? "is-active" : ""}`} />
                    <div><strong>2. 抽取文字</strong><p>{blockCount > 0 ? `已抽取 ${blockCount} 筆` : "等待抽取"}</p></div>
                </div>
                <div className="flow-item">
                    <span className={`flow-dot ${selectedCount > 0 ? "is-active" : ""}`} />
                    <div><strong>3. 編輯翻譯</strong><p>{selectedCount > 0 ? `已選取 ${selectedCount} 筆` : "尚未選取"}</p></div>
                </div>
                <div className="flow-item">
                    <span className={`flow-dot ${status.includes("輸出") ? "is-active" : ""}`} />
                    <div><strong>4. 輸出 PPTX</strong><p>{status.includes("輸出") ? "已完成" : "等待套用"}</p></div>
                </div>
            </div>
        </section>
    );
}
