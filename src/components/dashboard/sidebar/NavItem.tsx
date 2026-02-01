import { Link, type LinkOptions, useLocation } from "@tanstack/solid-router";
import type { JSXElement } from "solid-js";

interface INavItemProps {
    linkOptions: LinkOptions;
    label: string;
    icon?: JSXElement;
}

export function NavItem(props: INavItemProps) {
    const location = useLocation();

    return (
        <Link
            {...props.linkOptions}
            class={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${props.linkOptions.to && location().pathname == props.linkOptions.to ? "bg-zinc-800 text-white" : "text-gray-400 hover:text-white hover:bg-zinc-800"}
            `}
        >
            {props.icon && <span class="text-xl">{props.icon}</span>}
            <span>{props.label}</span>
        </Link>
    );
}
