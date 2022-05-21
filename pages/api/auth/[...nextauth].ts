import nextAuth from "next-auth";
import DiscordProvider from 'next-auth/providers/discord'

export default nextAuth({
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: { params: { scope: 'guilds identify email' } }
        })
    ],
    callbacks: {
        jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
            }
            if (account) {
                token.access_token = account.access_token
            }
            return token
        },
        session({ session, token }) {
            session.user.id = token.id as string
            session.access_token = token.access_token as string
            return session
        }
    }
})

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            name: string
            email: string
            image: string
        }
        access_token: string
    }
}