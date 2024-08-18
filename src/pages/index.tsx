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

      <div tw={"min-h-screen w-full pt-20 flex flex-col space-y-6"}>
        <TokenContractInteractions/>
        <LumenContractInteractions />

        
        <div tw={"rounded-lg overflow-hidden bg-white h-72 flex flex-col space-y-4 shadow-sm"}>

        </div>

        
      </div>
    </main>
    
  )
}

export default HomePage
