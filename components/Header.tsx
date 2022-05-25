import clsx from "clsx";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./Button";
import React from "react";

export default function Header({ className }: { className?: string }) {
    const { data: session } = useSession()
    return <div className={clsx(className, "bg-light-primary w-full")}>
        <div className="max-w-screen-xl mx-auto flex items-center flex-shrink-0 h-16 px-8 justify-between">
            <a href="/" className="h-full flex items-center flex-shrink-0"><img src="/logopay.svg" alt="Micro Pay Logo" className="h-2/3" /></a>
            <div className="h-2/3 flex-shrink-0">
                {session
                    ? <button onClick={() => signOut()} className="h-full">
                        <img src={session.user?.image} alt={session.user.name} className="h-full rounded-full" />
                    </button>
                    : <Button className="bg-light-secondary" onClick={() => signIn('discord')}>Login</Button>
                }
            </div>
        </div>
    </div>
}