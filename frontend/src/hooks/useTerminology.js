import { useState } from "react";
import { API_BASE } from "../constants";

export function useTerminology() {
    const [glossaryItems, setGlossaryItems] = useState([]);
    const [tmItems, setTmItems] = useState([]);
    const [manageOpen, setManageOpen] = useState(false);
    const [manageTab, setManageTab] = useState("glossary");
    const [useTm, setUseTm] = useState(false);

    const loadGlossary = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/tm/glossary`);
            const data = await response.json();
            setGlossaryItems(data.items || []);
        } catch (error) {
            console.error("Failed to load glossary:", error);
        }
    };

    const loadMemory = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/tm/memory`);
            const data = await response.json();
            setTmItems(data.items || []);
        } catch (error) {
            console.error("Failed to load memory:", error);
        }
    };

    const upsertGlossary = async (entry) => {
        await fetch(`${API_BASE}/api/tm/glossary`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry)
        });
        await loadGlossary();
    };

    const deleteGlossary = async (entry) => {
        await fetch(`${API_BASE}/api/tm/glossary`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry)
        });
        await loadGlossary();
    };

    const upsertMemory = async (entry) => {
        await fetch(`${API_BASE}/api/tm/memory`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry)
        });
        await loadMemory();
    };

    const deleteMemory = async (entry) => {
        await fetch(`${API_BASE}/api/tm/memory`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry)
        });
        await loadMemory();
    };

    const clearMemory = async () => {
        if (!window.confirm("確定要清除全部翻譯記憶嗎？此動作無法復原。")) return;
        await fetch(`${API_BASE}/api/tm/memory/clear`, { method: "DELETE" });
        await loadMemory();
    };

    const convertMemoryToGlossary = async (item) => {
        if (!item?.source_text || !item?.target_text) return;
        await upsertGlossary({
            source_lang: item.source_lang,
            target_lang: item.target_lang,
            source_text: item.source_text,
            target_text: item.target_text,
            priority: 0
        });
        if (item.id) await deleteMemory({ id: item.id });
    };

    const handleSeedTm = async () => {
        await fetch(`${API_BASE}/api/tm/seed`, { method: "POST" });
        await loadGlossary();
        await loadMemory();
    };

    return {
        glossaryItems, tmItems,
        manageOpen, setManageOpen,
        manageTab, setManageTab,
        useTm, setUseTm,
        loadGlossary, loadMemory,
        upsertGlossary, deleteGlossary,
        upsertMemory, deleteMemory,
        clearMemory,
        convertMemoryToGlossary,
        handleSeedTm
    };
}
