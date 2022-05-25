import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

function MyApp({ Component, pageProps: { session, ...pageProps } }: { Component: () => JSX.Element, pageProps: AppProps['pageProps'] }) {
  return <SessionProvider session={session}>
    <Component {...pageProps} />
  </SessionProvider>
}

export default MyApp
