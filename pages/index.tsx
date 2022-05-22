import { DiscordActionRow, DiscordAttachment, DiscordAttachments, DiscordButton, DiscordCommand, DiscordMessage, DiscordMessages, DiscordReply } from '@skyra/discord-components-react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import React from 'react'
import { Link } from '../components/Button'
import Header from '../components/Header'
import { useInviteLink } from '../utils/http'

const profiles = {
  mpay: {
    author: 'Micro Pay',
    avatar: 'https://cdn.discordapp.com/avatars/975372236322144267/2272dcf92dafd9f45275d70d1d0140cc.png?size=4096',
    bot: true,
    roleColor: "#FFFFFF"
  },
  dai: {
    author: "daimond113",
    avatar: "https://www.daimond113.com/logo.svg",
    roleColor: "#FFFFFF"
  },
  luka: {
    author: "LukaDev",
    avatar: "https://github.com/lukadev-0.png",
    roleColor: "#FFFFFF"
  }
}

const BaseMessages = ({ children }: { children: React.ReactNode }) => <DiscordMessages className='mt-4 w-full mb-6'>
  <DiscordMessage {...profiles.mpay} ephemeral>
    <DiscordCommand
      slot="reply"
      {...profiles.dai}
      command="/balance"
    ></DiscordCommand>
    Your balance is 100$
  </DiscordMessage>
  {children}
</DiscordMessages>

const Home: NextPage = () => {
  const { data: session } = useSession()
  const invite = useInviteLink()
  const [requested, setRequested] = React.useState(false)
  return (
    <div className='flex flex-col h-screen'>
      <Head>
        <title>About - Micro Pay</title>
      </Head>
      <Header className='flex-grow-0' />
      <div className='flex flex-col flex-grow ml-20 sm:ml-28 md:ml-40 h-[500vh]'>
        <div className='relative h-[11.5rem] w-[24rem] sm:w-[28rem] md:w-[36rem] lg:w-[44rem] mt-44'>
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
        <div className='w-[24rem] sm:w-[28rem] md:w-[36rem] lg:w-[44rem] mt-32'>
          <h2 className='text-4xl font-bold text-[#2D0042]'>Features</h2>
          <ul>
            <li className='mt-4'>
              <h3 className='text-xl font-bold text-[#442D53]'>Universal API</h3>
              <p className='text-xl font-normal text-[#442D53] mt-4'>
                Micro Pay is an open-source Discord money system.<br />It has an universal API allowing for easy integration with other systems.
              </p>
            </li>
            <li className='mt-4'>
              <h3 className='text-xl font-bold text-[#442D53]'>Free</h3>
              <p className='text-xl font-normal text-[#442D53] mt-4'>
                Micro Pay is free to use and is open-source.
              </p>
            </li>
          </ul>
        </div>
        <div className='w-[24rem] sm:w-[28rem] md:w-[36rem] lg:w-[44rem] 2xl:w-[84rem] mt-20'>
          <h2 className='text-4xl font-bold text-[#2D0042]'>Quick example</h2>
          {requested
            ? <BaseMessages>
              <DiscordMessage {...profiles.mpay} edited>
                <DiscordCommand
                  slot="reply"
                  {...profiles.luka}
                  command="/request"
                ></DiscordCommand>
                Request ended
              </DiscordMessage>
              <DiscordMessage {...profiles.mpay}>
                <DiscordReply
                  slot="reply"
                  edited
                  command
                  {...profiles.mpay}
                >
                  Request ended
                </DiscordReply>
                <DiscordAttachment
                  slot="attachments"
                  url="https://raw.githubusercontent.com/daimond113/micropay/master/assets/payment_fail.gif"
                  className="h-max max-w-[95%]"
                />
              </DiscordMessage>
              <DiscordMessage {...profiles.mpay} ephemeral>
                <DiscordCommand
                  slot="reply"
                  {...profiles.luka}
                  command="/send"
                />
                You sent 100$ to daimond113
                <DiscordAttachment
                  slot="attachments"
                  url="https://raw.githubusercontent.com/daimond113/micropay/master/assets/payment_success.gif"
                  className="h-max max-w-[95%]"
                />
              </DiscordMessage>
              <DiscordMessage {...profiles.mpay} ephemeral>
                <DiscordCommand
                  slot="reply"
                  {...profiles.dai}
                  command="/balance"
                ></DiscordCommand>
                Your balance is 200$
              </DiscordMessage>
            </BaseMessages>
            : <BaseMessages>
              <DiscordMessage {...profiles.mpay}>
                <DiscordCommand
                  slot="reply"
                  {...profiles.luka}
                  command="/request"
                ></DiscordCommand>
                <DiscordAttachment
                  slot="attachments"
                  url="/request.png"
                  height={267.5}
                  width={300}
                  alt="A request of 100$ from LukaDev by daimond113"
                />
                <DiscordAttachments slot="components">
                  <DiscordActionRow>
                    <DiscordButton type="primary" onClick={() => setRequested(true)}>Accept</DiscordButton>
                  </DiscordActionRow>
                </DiscordAttachments>
              </DiscordMessage>
            </BaseMessages>
          }
        </div>
      </div>
    </div>
  )
}

export default Home
