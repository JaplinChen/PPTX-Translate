from __future__ import annotations

import json
from io import BytesIO
from fastapi import APIRouter, File, HTTPException, UploadFile, Form
from fastapi.responses import StreamingResponse

from backend.services.pdf_extract import extract_pdf_blocks
from backend.services.pdf_apply import apply_pdf_translations

router = APIRouter(prefix="/api/pdf", tags=["pdf"])

@router.post("/extract")
async def extract_pdf(file: UploadFile = File(...)):
    """
    提取 PDF 文字與座標。
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    try:
        content = await file.read()
        blocks = extract_pdf_blocks(content)
        return {"blocks": blocks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {str(e)}")

@router.post("/apply")
async def apply_pdf(
    file: UploadFile = File(...),
    blocks: str = Form(...),
    target_language: str = Form(...)
):
    """
    套用翻譯並生成新 PDF。
    """
    try:
        pdf_bytes = await file.read()
        blocks_list = json.loads(blocks)
        
        result_pdf = apply_pdf_translations(
            pdf_bytes, 
            blocks_list, 
            target_language
        )
        
        output_filename = f"translated_{file.filename}"
        return StreamingResponse(
            BytesIO(result_pdf),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={output_filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF application failed: {str(e)}")
