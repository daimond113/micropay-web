import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import React from 'react'
import { Link } from '../components/Button'
import Header from '../components/Header'
import { useInviteLink } from '../utils/http'

const Home: NextPage = () => {
  const { data: session } = useSession()
  const invite = useInviteLink()
  return (
    <div>
      <Head>
        <title>About | Micro Pay</title>
      </Head>
      <Header />
      <div className='ml-40'>
        <h1 className='text-5xl font-bold text-[#2D0042] mt-64'>Introducing Micro Pay</h1>
        <p className='text-xl font-normal text-[#442D53] mt-6'>
          Micro Pay is a new way to pay for goods and services.
        </p>
        <Link className='bg-[#541AC6] text-white mt-4 inline-block' href={session ? '/manage' : invite}>{session ? "Manage your Micro Pay" : "Invite to server"}</Link>
      </div>
    </div>
  )
}

export default Home
