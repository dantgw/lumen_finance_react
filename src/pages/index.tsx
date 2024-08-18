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
import { type FC, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

import { contractInvoke, useRegisteredContract } from '@soroban-react/contracts'
import { Address, nativeToScVal, ScInt, xdr } from '@stellar/stellar-sdk'

import { useSorobanReact } from "@soroban-react/core"
import * as StellarSdk from '@stellar/stellar-sdk';
import { LoansDashboard } from '@/components/web3/LoansDashboard'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, useDisclosure } from '@chakra-ui/react'
const inter = Inter({ subsets: ["latin"] });


const HomePage: NextPage = () => {

  const sorobanContext = useSorobanReact()

  const { activeChain, server, address } = sorobanContext

  const [, setFetchIsLoading] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  
  
  const [fetchedBalance, setBalance] = useState<string>()
  const [updateFrontend, toggleUpdate] = useState<boolean>(true)
  const [contractAddressStored, setContractAddressStored] = useState<string>()
  const tokenContract = useRegisteredContract("lumen_usdc")

  
  const fetchBalance = useCallback(async () => {
 
    if (!sorobanContext.server) return

    if (!address) {
      console.log("Address is not defined")
      // toast.error('Wallet is not connected. Try again...')
      return
    }
    const currentChain = sorobanContext.activeChain?.name?.toLocaleLowerCase()
    if (!currentChain) {
      console.log("No active chain")
      // toast.error('Wallet not connected. Try again…')
      return
    }
    else {
      const contractAddress = tokenContract?.deploymentInfo.contractAddress
      setContractAddressStored(contractAddress)
      setFetchIsLoading(true)
      console.log("balance address",address)
      console.log("balance tokenContract",tokenContract?.deploymentInfo)

      try {
        const result = await tokenContract?.invoke({
          method: 'balance',
          args: [new Address(address).toScVal()]
        })

        if (!result) return

        // Value needs to be cast into a string as we fetch a ScVal which is not readable as is.
        // You can check out the scValConversion.tsx file to see how it's done
        const result_string = StellarSdk.scValToNative(result as StellarSdk.xdr.ScVal) as string
        console.log("balance result",result_string)

        setBalance(result_string)
        console.log("fetch balance",fetchedBalance)
      } catch (e) {
        console.error(e)
        // toast.error('Error while fetching balance. Try again…')
        setBalance(undefined)
      } finally {
        setFetchIsLoading(false)
      }
    }
  },[sorobanContext,tokenContract])

  useEffect(() => {void fetchBalance()}, [updateFrontend, fetchBalance])


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

      <div tw={"min-h-screen w-full pt-20 flex flex-col space-y-12 items-center"}>
        <TokenContractInteractions tokenBalance={fetchedBalance}/>
        <LumenContractInteractions fetchBalance={fetchBalance} />
        <LoansDashboard/>
        



        
      </div>
    </main>
    
  )
}

export default HomePage
