from __future__ import annotations

import fitz  # PyMuPDF
from typing import TypedDict, Optional

class PDFBlockMetadata(TypedDict):
    x: float
    y: float
    width: float
    height: float
    font_size: float
    page_index: number

def extract_pdf_blocks(pdf_bytes: bytes) -> list[dict]:
    """
    使用 PyMuPDF 提取 PDF 文字區塊並保留座標。
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    blocks = []
    
    for page_index, page in enumerate(doc):
        # 使用 dict 模式獲取詳細資訊 (包括座標)
        text_page = page.get_text("dict")
        
        for block_idx, b in enumerate(text_page["blocks"]):
            if b["type"] != 0:  # 0 是文字區塊
                continue
                
            block_text = ""
            # 一個 block 可能有多行 (lines)
            for line in b["lines"]:
                for span in line["spans"]:
                    block_text += span["text"]
            
            block_text = block_text.strip()
            if not block_text:
                continue
            
            # 使用 bbox [x0, y0, x1, y1]
            bbox = b["bbox"]
            
            # 符合系統現有的 block 結構，並在 metadata 儲存座標
            blocks.append({
                "slide_index": page_index, # PDF 以頁面作為 slide_index
                "shape_id": f"p{page_index}-b{block_idx}",
                "shape_type": "pdf_text",
                "source_text": block_text,
                "metadata": {
                    "x": bbox[0],
                    "y": bbox[1],
                    "width": bbox[2] - bbox[0],
                    "height": bbox[3] - bbox[1],
                    "page_index": page_index
                }
            })
            
    doc.close()
    return blocks
