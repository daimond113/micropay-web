import ax, { AxiosResponse } from 'axios'
import React from 'react'
import useSWR from 'swr'

export const axios = ax.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

const LocalStorage = typeof window !== "undefined" ? localStorage : null

export function useInviteLink() {
    const [inviteLink, setInviteLink] = React.useState<string | undefined>(LocalStorage?.getItem("inviteLink") ?? undefined)
    React.useEffect(() => {
        if (inviteLink) return
        axios.get('/invite')
            .then(({ data }) => {
                LocalStorage?.setItem("inviteLink", data.invite)
                setInviteLink(data.invite)
            })
    }, [])
    return inviteLink ?? ''
}

export function useMicroSWR(key: string | null, fetcher: (url: string) => any) {
    const { data, error, mutate } = useSWR(key, fetcher)
    return {
        data,
        error,
        isLoading: !data && !error,
        mutate
    }
}