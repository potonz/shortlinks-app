import { createContext, createSignal, useContext } from "solid-js";
import { type ParentComponent } from "solid-js";

interface SidebarContextValue {
    isSidebarOpen: () => boolean;
    setIsSidebarOpen: (value: boolean) => void;
    openSidebar: () => void;
    closeSidebar: () => void;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue>();

export const SidebarProvider: ParentComponent = (props) => {
    const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);

    const openSidebar = () => {
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <SidebarContext.Provider
            value={{
                isSidebarOpen,
                setIsSidebarOpen,
                openSidebar,
                closeSidebar,
                toggleSidebar,
            }}
        >
            {props.children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};
