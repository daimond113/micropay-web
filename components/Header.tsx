import clsx from "clsx";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./Button";
import React from "react";

export default function Header({ className }: { className?: string }) {
    const { data: session } = useSession()
    return <div className={clsx(className, "bg-light-primary w-full h-16 flex items-center")}>
        <img src="/logopay.svg" alt="Micro Pay Logo" className="h-2/3 ml-40" />
        <div className="ml-auto mr-40 h-2/3">
            {session ? <button onClick={() => signOut()} className="h-full"><img src={session.user?.image} alt={session.user.name} className="h-full rounded-full" /></button> : <Button className="bg-light-secondary" onClick={() => signIn()}>Login</Button>}
        </div>
    </div>
}