import Header from "../components/Header";
import { Listbox } from '@headlessui/react'
import React from "react";
import clsx from "clsx";
import { ClipboardCopyIcon, ClipboardCheckIcon, CheckIcon, XIcon, RefreshIcon, MenuIcon } from '@heroicons/react/outline'
import { axios as apiAxios, useInviteLink, useMicroSWR } from "../utils/http";
import Button, { Link } from "../components/Button";
import useSWRImmutable from 'swr/immutable'
import axios from "axios";
import CopyToClipboard from "react-copy-to-clipboard";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

const Icon = ({ server }: { server: { id: string, icon: string, name: string } }) => server.icon
    ? <div className="w-8 h-8 flex-shrink-0 rounded-full inline-block mr-1 relative">
        <Image
            src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.${server.icon.startsWith('a_') ? 'gif' : 'png'}`}
            layout="fill"
            alt={server.name}
            className="rounded-full"
        />
    </div>
    : <div className="w-8 h-8 rounded-full bg-light-secondary mr-1 flex justify-center items-center overflow-hidden flex-shrink-0">{server.name}</div>

const DrawerItem = ({ children, isOn, onClick }: { children: React.ReactNode, isOn: boolean, onClick?: () => void }) => <button onClick={onClick} className={clsx("text-left rounded-full py-4 px-3 mb-3", isOn ? "bg-[#E3C3FC]" : "bg-[#F6F0FA] active:bg-[#E3C3FC] hover:bg-[#F4E7FF]")}>{children}</button>

const BaseElement = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={clsx("bg-[#F6F0FA] rounded-xl w-full p-6 mb-3", className)}>{children}</div>

const fetcher = (url: string) => axios.get(url).then((v) => v.data)
const DiscordFetcher = (token: string | undefined) => (url: string) => axios.get(url, { headers: { Authorization: `Bearer ${token}` } }).then((v) => v.data)
const APIfetcher = (url: string) => apiAxios.get(url).then((v) => v.data)

const ArrowDown = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth='2' {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
</svg>

const ArrowUp = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
</svg>

const Drawer = ({ server, setServer, userGuilds, className }: {
    server: { id: string, name: string, icon: string },
    setServer: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string;
        icon: string;
    } | undefined>>
    userGuilds: { id: string, name: string, icon: string }[]
    className: string
}) => <div className={clsx("w-80 bg-[#F6F0FA] p-2 flex-col flex-shrink-0", className)}>
        <Listbox value={server} onChange={setServer}>
            <div className="relative">
                <Listbox.Button className="bg-white border border-black w-full rounded-full text-left py-2 px-3 flex mb-2 items-center">
                    {({ open }) =>
                        server
                            ? <>
                                <Icon server={server} />
                                <span className="w-full whitespace-nowrap text-ellipsis overflow-hidden">
                                    {server.name}
                                </span>
                                {open ? <ArrowUp className="w-8 h-8" /> : <ArrowDown className="w-8 h-8" />}
                            </> : undefined
                    }
                </Listbox.Button>
                <Listbox.Options className="bg-white top-[3.4rem] rounded-3xl shadow-md p-2 absolute w-full left-0 right-0 max-h-80 overflow-auto border border-black scrollbar-hide">
                    {userGuilds?.map(s => <Listbox.Option key={s.id} value={s} className={({ active }) => clsx("w-full h-10 mb-1 p-2 flex items-center rounded-full", active && "bg-light-primary")}>
                        <Icon server={s} />
                        <span className="text-ellipsis whitespace-nowrap overflow-hidden w-full">{s.name}</span>
                    </Listbox.Option>)}
                </Listbox.Options>
            </div>
        </Listbox>
        <DrawerItem isOn={true}>Overview</DrawerItem>
    </div>

export default function Manage() {
    const { data: session } = useSession()
    const { data: userGuilds } = useSWRImmutable(session ? 'https://discord.com/api/v10/users/@me/guilds' : null, DiscordFetcher(session?.access_token))
    const [server, setServer] = React.useState<{ id: string, name: string, icon: string }>()
    const currencyRef = React.useRef<HTMLInputElement>(null)
    const currencyBeforeRef = React.useRef<HTMLInputElement>(null)
    const { data: isIn, mutate } = useMicroSWR(server ? `/is-in/${server.id}` : null, APIfetcher)
    const { data, isLoading } = useMicroSWR(isIn && server ? `/api/config/${server.id}` : null, fetcher)
    const [copied, setIsCopied] = React.useState(false)
    const [updated, setIsUpdated] = React.useState<'not' | 'success' | 'fail'>('not')
    const invite = useInviteLink()
    const [isDrawerOpen, setDrawerIsOpen] = React.useState(false)

    React.useEffect(() => {
        if (userGuilds?.[0]) setServer(userGuilds?.[0])
    }, [userGuilds])

    return <div className="flex flex-col w-full h-screen">
        <Head>
            <title>Manage - Micro Pay</title>
        </Head>
        <Header className="flex-grow-0" />
        {isDrawerOpen && <>
            <Drawer server={server!} setServer={setServer} userGuilds={userGuilds} className="flex z-50 h-screen absolute" />
            <button className="bg-opacity-60 bg-black lg:bg-transparent w-full h-screen absolute z-40" onClick={() => setDrawerIsOpen(false)} />
        </>}
        <div className="flex-grow flex">
            {session ? !server
                ? <div className="flex w-full h-full justify-center items-center flex-col">
                    <h1 className="text-5xl font-semibold mb-2">Please wait</h1>
                    <p className="text-lg">Loading</p>
                </div>
                : <>
                    <Drawer server={server} setServer={setServer} userGuilds={userGuilds} className="hidden lg:flex relative" />
                    <div className="p-5 md:p-20 w-full relative">
                        {!isDrawerOpen && <button className="w-8 h-8 absolute block lg:hidden right-5 top-8" onClick={() => setDrawerIsOpen(true)}>
                            <MenuIcon className="stroke-[#504154] h-full w-full" />
                        </button>}
                        {isIn ?
                            isLoading ? <BaseElement>Loading...</BaseElement> :
                                <>
                                    <h1 className="text-5xl font-semibold mb-8 max-w-[90%] break-all">{server?.name ?? 'Loading'}</h1>
                                    <BaseElement className="flex items-center">
                                        <div>
                                            <label className="font-semibold block" htmlFor="currency">Currency</label>
                                            <span className="text-[#504154]">The currency to use</span>
                                        </div>
                                        <input type="text" id="currency" ref={currencyRef} defaultValue={data?.currency ?? '$'} className="ml-auto h-full rounded-full px-3 py-2 border border-[#310546]" />
                                    </BaseElement>
                                    <BaseElement className="flex items-center">
                                        <div>
                                            <label className="font-semibold block" htmlFor="currency-before">Currency before</label>
                                            <span className='text-[#504154]'>Whether the currency should appear before the number</span>
                                        </div>
                                        <input type="checkbox" ref={currencyBeforeRef} defaultChecked={data?.currencyBefore ?? false} id="currency-before" className="ml-auto h-full rounded-md p-3 border border-[#310546] text-light-secondary" />
                                    </BaseElement>
                                    <BaseElement className="flex items-center">
                                        <div>
                                            <label className="font-semibold block" htmlFor="api-token">API Token</label>
                                            <span className='text-[#504154]'>The API token for the Micro Pay API connected to this server</span>
                                        </div>
                                        <div className="flex justify-center ml-auto items-center lg:items-start flex-col lg:flex-row">
                                            <input id="api-token" type="password" readOnly value={data?.apiToken} className="ml-auto mb-2 lg:mb-0 h-full rounded-full px-3 py-2 border border-[#310546]" />
                                            <CopyToClipboard text={data?.apiToken} onCopy={() => setIsCopied(true)}>
                                                <Button className="bg-light-primary ml-2">
                                                    {copied ? <ClipboardCheckIcon className="w-6" /> : <ClipboardCopyIcon className="w-6" />}
                                                </Button>
                                            </CopyToClipboard>
                                            <Button
                                                className="bg-light-primary ml-2 mt-2 lg:mt-0"
                                                onClick={() => {
                                                    axios.post(`/api/token/regenerate/${server.id}`).then((v) => mutate({ ...data, apiToken: v.data.apiToken }))
                                                }}>
                                                <RefreshIcon className="w-6" />
                                            </Button>
                                        </div>
                                    </BaseElement>
                                    <button className="absolute bottom-0 right-0 mb-5 mr-5 bg-light-secondary p-7 rounded-2xl" onClick={() => {
                                        apiAxios.post('/config', {
                                            currency: currencyRef.current?.value,
                                            currencyBefore: currencyBeforeRef.current?.checked,
                                        }, {
                                            headers: {
                                                'x-api-token': data?.apiToken,
                                            }
                                        }).then(() => setIsUpdated('success')).catch(() => setIsUpdated('fail'))
                                    }}>
                                        {updated === 'success'
                                            ? <CheckIcon className="w-10" />
                                            : updated === 'fail'
                                                ? <XIcon className="w-10" />
                                                : <svg className="w-10" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.9612 0.531006H5.00317V6.48301H12.9612V0.531006ZM12 5.50001H10V1.50001H12V5.50001Z" fill="#000000" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M14.9879 0.531006H14.0792V7.60113H3.94157V0.531006H2.98863C1.8839 0.531006 0.989258 1.45009 0.989258 2.58336V13.4776C0.989258 14.6109 1.8849 15.531 2.98863 15.531H14.9889C16.0946 15.531 16.9893 14.6109 16.9893 13.4776V2.58336L14.9879 0.531006ZM12.9683 13.5H4.96826V12.5H12.9683V13.5ZM12.9683 11.5H4.96826V10.5H12.9683V11.5Z" fill="#000000" />
                                                </svg>}
                                    </button>
                                </>
                            : <div className="flex items-center justify-center h-full flex-col">
                                <h1 className="text-5xl font-semibold mb-2">Oh no!</h1>
                                <p className="text-lg">Micro Pay is not in {server?.name ?? 'Loading'}</p>
                                <Link className="bg-[#541AC6] text-white mt-4" href={invite}>Invite to server</Link>
                            </div>}
                    </div>
                </>
                : <div className="flex w-full h-full justify-center items-center flex-col">
                    <h1 className="text-5xl font-semibold mb-2">Oh no!</h1>
                    <p className="text-lg">You are not logged in</p>
                    <Button className="bg-[#541AC6] text-white mt-4" onClick={() => signIn('discord')}>Sign in</Button>
                </div>}
        </div>
    </div>
}