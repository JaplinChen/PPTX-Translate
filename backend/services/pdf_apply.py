from __future__ import annotations

import fitz  # PyMuPDF
from typing import Optional

def apply_pdf_translations(
    original_pdf_bytes: bytes,
    blocks: list[dict],
    target_language: str
) -> bytes:
    """
    將翻譯後的文字覆寫回 PDF 檔案。
    使用 Redaction (塗遮) 原始區域後，在原位繪製新文字。
    """
    doc = fitz.open(stream=original_pdf_bytes, filetype="pdf")
    
    for block in blocks:
        page_index = block.get("slide_index", 0)
        metadata = block.get("metadata")
        translated_text = block.get("translated_text")
        
        if not metadata or not translated_text:
            continue
            
        page = doc[page_index]
        
        # 取得原始座標
        rect = fitz.Rect(
            metadata["x"], 
            metadata["y"], 
            metadata["x"] + metadata["width"], 
            metadata["y"] + metadata["height"]
        )
        
        # 1. 塗遮原始文字 (確保原文字不會重疊)
        # fill=(1,1,1) 是白色背景，如果是透明 PDF 也可以考慮不填色
        page.add_redact_annot(rect, fill=(1, 1, 1))
        page.apply_redactions()
        
        # 2. 插入新文字
        # 嘗試自動縮放字體以適應矩形
        # PyMuPDF 的 insert_textbox 可以自動處理長度超過的情況
        page.insert_textbox(
            rect,
            translated_text,
            fontsize=10, # 預設字體大小，之後可以根據 metadata 優化
            fontname="china-ss", # 支援中文字體 (PyMuPDF 內建)
            align=0 # 左對齊
        )
        
    output_bytes = doc.write()
    doc.close()
    return output_bytes
