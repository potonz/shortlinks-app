import { createContext, createEffect, createSignal, useContext } from "solid-js";
import { type ParentComponent } from "solid-js";

interface LinkHistoryItem {
    shortId: string;
    targetUrl: string;
    baseUrlId: number;
    date: string;
}

interface LinkHistoryContextValue {
    linkHistory: () => LinkHistoryItem[];
    addLinkToHistory: (shortId: string, targetUrl: string, baseUrlId: number) => void;
    deleteLinkFromHistory: (shortId: string) => void;
}

const LinkHistoryContext = createContext<LinkHistoryContextValue>();

export const LinkHistoryProvider: ParentComponent = (props) => {
    const [linkHistory, setLinkHistory] = createSignal<LinkHistoryItem[]>([]);

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

    const saveHistoryToStorage = () => {
        try {
            localStorage.setItem("linkHistory", JSON.stringify(linkHistory()));
        }
        catch (error) {
            console.error("Failed to save link history to localStorage:", error);
        }
    };

    const addLinkToHistory = (shortId: string, targetUrl: string, baseUrlId: number) => {
        const newItem: LinkHistoryItem = {
            shortId,
            targetUrl,
            baseUrlId,
            date: new Date().toISOString(),
        };

        setLinkHistory((prev) => {
            const newHistory = [newItem, ...prev];
            if (newHistory.length > 10) {
                return newHistory.slice(0, 10);
            }
            return newHistory;
        });
        saveHistoryToStorage();
    };

    const deleteLinkFromHistory = (shortId: string) => {
        setLinkHistory(prev => prev.filter(item => item.shortId !== shortId));
        saveHistoryToStorage();
    };

    return (
        <LinkHistoryContext.Provider
            value={{
                linkHistory,
                addLinkToHistory,
                deleteLinkFromHistory,
            }}
        >
            {props.children}
        </LinkHistoryContext.Provider>
    );
};

export const useLinkHistory = () => {
    const context = useContext(LinkHistoryContext);
    if (!context) {
        throw new Error("useLinkHistory must be used within a LinkHistoryProvider");
    }
    return context;
};
