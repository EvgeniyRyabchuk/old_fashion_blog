// Cursor handler
import {db} from "@/firebase/config";

function createCursorHandler(colName) {
    let lastDocCache = {};
    const cursorName = `lastDocCache_${colName}`;

    const restoreLastDocCache = async () => {
        const raw = localStorage.getItem(cursorName);
        if (!raw) return {};

        const cache = JSON.parse(raw);
        const rebuilt = {};

        for (const [page, docId] of Object.entries(cache)) {
            const snap = await db.collection(colName).doc(docId).get();
            if (snap.exists) rebuilt[page] = snap;
        }
        lastDocCache = rebuilt;
        return rebuilt;
    };

    const saveCursor = (lastDoc, page) => {
        // localStorage.removeItem(cursorName);
        lastDocCache[page] = lastDoc;
        const cacheToSave = JSON.parse(localStorage.getItem(cursorName) || "{}");
        cacheToSave[page] = lastDoc.id;
        localStorage.setItem(cursorName, JSON.stringify(cacheToSave));
    };

    const deleteCursor = () => {
        lastDocCache = {};
        localStorage.removeItem(cursorName);
    };

    return {
        get lastDocCache() {
            return lastDocCache;
        },
        cursorName,
        saveCursor,
        restoreLastDocCache,
        deleteCursor,
    };
}

export default createCursorHandler;