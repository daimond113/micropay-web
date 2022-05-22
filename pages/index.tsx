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
    <div className='flex flex-col h-screen'>
      <Head>
        <title>About | Micro Pay</title>
      </Head>
      <Header className='flex-grow-0' />
      <div className='flex flex-grow w-full items-center h-full'>
        <div className='ml-20 sm:ml-28 md:ml-40 relative w-full h-[11.5rem]'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-96 h-56 absolute z-10 -top-24 -left-16" viewBox="0 0 485 128" fill="none">
            <path d="M423.51 70.2443C229.01 155.244 159.51 119.744 85.5101 119.744C0.510078 101.244 -1.84444 65.2793 0.510073 58.7443C25.0101 -9.25568 191.01 21.7443 240.51 8.74431C290.01 -4.25569 618.01 -14.7557 423.51 70.2443Z" fill="#EADCF5" />
          </svg>
          <div className='absolute z-20'>
            <h1 className='text-5xl font-bold text-[#2D0042]'>Introducing Micro Pay</h1>
            <p className='text-xl font-normal text-[#442D53] mt-6'>
              Micro Pay is an open-source Discord money system.<br />It has an universal API allowing for easy integration with other systems.
            </p>
            <Link className='bg-[#541AC6] text-white mt-4 inline-block' href={session ? '/manage' : invite}>{session ? "Manage your Micro Pay" : "Invite to server"}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
