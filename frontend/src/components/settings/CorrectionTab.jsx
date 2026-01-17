import React from "react";

function CorrectionTab({
    fillColor,
    setFillColor,
    textColor,
    setTextColor,
    lineColor,
    setLineColor,
    lineDash,
    setLineDash
}) {
    return (
        <>
            <div className="color-grid">
                <div className="color-item">
                    <span>底色</span>
                    <input
                        className="color-input"
                        type="color"
                        value={fillColor}
                        onChange={(event) => setFillColor(event.target.value)}
                    />
                </div>
                <div className="color-item">
                    <span>文字</span>
                    <input
                        className="color-input"
                        type="color"
                        value={textColor}
                        onChange={(event) => setTextColor(event.target.value)}
                    />
                </div>
                <div className="color-item">
                    <span>外框</span>
                    <input
                        className="color-input"
                        type="color"
                        value={lineColor}
                        onChange={(event) => setLineColor(event.target.value)}
                    />
                </div>
            </div>
            <div className="config-field compact">
                <label>外框線條</label>
                <select
                    value={lineDash}
                    onChange={(event) => setLineDash(event.target.value)}
                >
                    <option value="dash">虛線</option>
                    <option value="dot">點線</option>
                    <option value="dashdot">點虛線</option>
                    <option value="solid">實線</option>
                </select>
            </div>
        </>
    );
}

export default CorrectionTab;
