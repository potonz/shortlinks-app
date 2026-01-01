import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";

// Define the type for a link history item
interface LinkHistoryItem {
    shortId: string;
    targetUrl: string;
    date: string;
}

// Create the store with initial empty history
const [linkHistory, setLinkHistory] = createStore<LinkHistoryItem[]>([]);

// Load history from localStorage on initialization
createEffect(() => {
    try {
        const storedHistory = localStorage.getItem("linkHistory");
        if (storedHistory) {
            try {
                const parsedHistory = JSON.parse(storedHistory);
                setLinkHistory(parsedHistory);
            }
            catch {
                console.warn("broken link history data, removing...");
                localStorage.removeItem("linkHistory");
            }
        }
    }
    catch (error) {
        console.error("Failed to load link history from localStorage:", error);
    }
});

// Save history to localStorage whenever it changes
const saveHistoryToStorage = () => {
    try {
        localStorage.setItem("linkHistory", JSON.stringify(linkHistory));
    }
    catch (error) {
        console.error("Failed to save link history to localStorage:", error);
    }
};

// Add a new link to history
const addLinkToHistory = (shortId: string, targetUrl: string) => {
    const newItem: LinkHistoryItem = {
        shortId,
        targetUrl,
        date: new Date().toISOString(),
    };

    setLinkHistory(prev => [newItem, ...prev]);
    saveHistoryToStorage();
};

// Delete a link from history by shortId
const deleteLinkFromHistory = (shortId: string) => {
    setLinkHistory(prev => prev.filter(item => item.shortId !== shortId));
    saveHistoryToStorage();
};

export {
    addLinkToHistory,
    deleteLinkFromHistory,
    linkHistory,
};
