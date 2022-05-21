import { AnchorHTMLAttributes, ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import clsx from 'clsx'

const base = 'py-2 px-6 rounded-full font-medium'

export default function Button(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return <button
        {...props}
        className={clsx(base, props.className)}
    ></button>
}

export function Link(props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
    return <a
        {...props}
        className={clsx(base, props.className)}
    >
    </a>
}