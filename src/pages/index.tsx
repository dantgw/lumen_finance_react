import { HomePageTitle } from '@/components/home/HomePageTitle'
import { CenterBody } from '@/components/layout/CenterBody'
import { ChainInfo } from '@/components/web3/ChainInfo'
import { ConnectButton } from '@/components/web3/ConnectButton'
import { GreeterContractInteractions } from '@/components/web3/GreeterContractInteractions'
import { LumenContractInteractions } from '@/components/web3/LumenContractInteractions'
import type { NextPage } from 'next'
import 'twin.macro'
import { Inter } from "next/font/google";
import { TokenContractInteractions } from '@/components/web3/TokenContractInteractions'


const inter = Inter({ subsets: ["latin"] });


const HomePage: NextPage = () => {
  // Display `useInkathon` error messages (optional)
  // const { error } = useInkathon()
  // useEffect(() => {
  //   if (!error) return
  //   toast.error(error.message)
  // }, [error])

  return (
    <main
      tw={"flex min-h-screen flex-col items-center w-full"}
    >
      <nav tw={"fixed left-0 px-10 top-0 w-full flex flex-row h-16 items-center justify-between"}>
        <div tw={"flex flex-row items-center space-x-4"}>
          <img src={"/icons/logo.png"} />
          <span> Lumen Finance </span>
        </div>
        <div tw={"flex flex-row items-center space-x-6"}>
          <span>Get Funding</span>
          <span>Invest Funds</span>

          <ConnectButton />

        </div>
      </nav>

      <div tw={"min-h-screen pt-20 flex flex-col space-y-6"}>
        <TokenContractInteractions/>
        <div tw={"rounded-lg bg-white h-48 p-6 flex flex-col space-y-4 shadow-sm"}>
          <div tw={"w-full flex flex-row space-x-16"}>
            <div tw={"flex flex-col space-y-2"}>
              <span tw={"flex flex-row items-center space-x-2 w-48"}>
                <span> Claimable Interest </span>
                <img src="/icons/info.png" tw="flex w-3 h-3" />
              </span>
              <div tw={"text-2xl"}>$0.20</div>
            </div>
            <div tw={"flex flex-col space-y-2"}>
              <span tw={"flex flex-row items-center space-x-2"}>
                <span></span>
              </span>
              <div tw={"text-2xl"}></div>
            </div>

            
          </div>
          <div tw={"flex flex-col space-y-2"}>
            <div tw={"flex flex-row text-xs text-gray-500"}>
              Next Payment Due
            </div>
            <div tw={"flex flex-row space-x-8"}>
              <span> Acacia Gardening </span>
              <span> $5000 </span>
              <span> July 30, 2024 </span>
            </div>
          </div>
        </div>
        <div tw={"rounded-lg overflow-hidden bg-white h-72 flex flex-col space-y-4 shadow-sm"}>

        </div>

        <>
      {/* Top Bar */}
      {/* <HomeTopBar /> */}

      <CenterBody tw={"mt-20 mb-10 px-5"}>
        {/* Title */}
        <HomePageTitle />

        {/* Connect Wallet Button */}
        <ConnectButton />

        <div tw={"mt-10 flex w-full flex-wrap items-start justify-center gap-4"}>
          {/* Chain Metadata Information */}
          <ChainInfo />

          {/* Greeter Read/Write Contract Interactions */}
          <GreeterContractInteractions />
          <LumenContractInteractions />

        </div>
      </CenterBody>
    </>
        
      </div>
    </main>
    
  )
}

export default HomePage
