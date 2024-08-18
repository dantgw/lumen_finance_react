import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { type FC, useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import { useSorobanReact } from "@soroban-react/core"
import * as StellarSdk from '@stellar/stellar-sdk';

import React from 'react'
import Link from 'next/link'

import { contractInvoke, useRegisteredContract } from '@soroban-react/contracts'
import { Address, nativeToScVal, ScInt, xdr } from '@stellar/stellar-sdk'

type UpdateGreetingValues = { newMessage: string }

export const TokenContractInteractions: FC = () => {
  const sorobanContext = useSorobanReact()

  const { activeChain, server, address } = sorobanContext

  const [, setFetchIsLoading] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  const { register, handleSubmit } = useForm<UpdateGreetingValues>()
  
  // Two options are existing for fetching data from the blockchain
  // The first consists on using the useContractValue hook demonstrated in the useGreeting.tsx file
  // This hook simulate the transation to happen on the bockchain and allow to read the value from it
  // Its main advantage is to allow for updating the value display on the frontend without any additional action
  // const {isWrongConnection, fetchedGreeting} = useGreeting({ sorobanContext })
  
  // The other option, maybe simpler to understand and implement is the one implemented here
  // Where we fetch the value manually with each change of the state.
  // We trigger the fetch with flipping the value of updateFrontend or refreshing the page
  
  const [fetchedBalance, setBalance] = useState<string>()
  const [updateFrontend, toggleUpdate] = useState<boolean>(true)
  const [contractAddressStored, setContractAddressStored] = useState<string>()

  // Retrieve the deployed contract object from contract Registry
  // const contract = useRegisteredContract("lumen_finance")
  const tokenContract = useRegisteredContract("lumen_usdc")


  // Fetch Greeting
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
        toast.error('Error while fetching greeting. Try again…')
        setBalance(undefined)
      } finally {
        setFetchIsLoading(false)
      }
    }
  },[sorobanContext,tokenContract])

  useEffect(() => {void fetchBalance()}, [updateFrontend, fetchBalance])


  const mint = async () => {
    if (!address) {
      console.log("Address is not defined")
      toast.error('Wallet is not connected. Try again...')
      return
    }
    else if (!server) {
      console.log("Server is not setup")
      toast.error('Server is not defined. Unabled to connect to the blockchain')
      return
    }
    else {
      const currentChain = activeChain?.name?.toLocaleLowerCase()
      if (!currentChain) {
        console.log("No active chain")
        toast.error('Wallet not connected. Try again…')
        return
      }
      else {

        setUpdateIsLoading(true)

        try {
          const result = await tokenContract?.invoke({
            method: 'mint',
            args: [ new Address(address).toScVal(),  new ScInt(1000000).toI128()],
            signAndSend: true
          })
          console.log('🚀 « result:', result);
          
          if (true) {
            toast.success("New greeting successfully published!")
          }
          else {
            toast.error("Greeting unsuccessful...")
            
          }
        } catch (e) {
          console.error(e)
          toast.error('Error while sending tx. Try again…')
        } finally {
          setUpdateIsLoading(false)
          toggleUpdate(!updateFrontend)
        } 

        // await sorobanContext.connect();
      }
    }
  }


  if(!tokenContract){
    return (
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Greeter Smart Contract</h2>
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <p tw="text-center font-mono text-sm">No deployment found in the current chain</p>
          <p tw="text-center font-mono text-lg mt-4">Available deployments:</p>
          {
            sorobanContext?.deployments?.map((d, i) => (
              <p key={i} tw="text-center font-mono text-sm">- {d.networkPassphrase}</p>
            )) 
          }
        </Card>
      </div>
    )
  }

  return (
    <div tw={"rounded-lg bg-white h-48 p-6 flex flex-col space-y-4 shadow-sm"}>
         <h2
            tw='font-medium text-xl inline-flex items-center space-x-2'
         >
          <span>
            Balance USDC Token 
            </span>
          
          <img src="/icons/info.png" tw="flex w-3 h-3" />

         </h2>
         <h3 tw="text-center text-4xl">
          ${((BigInt(fetchedBalance ?? 0)) / BigInt(1) )?.toString()}

         </h3>
         <div tw="w-full flex flex-row justify-center">

          <Button
            tw='w-full max-w-96'
            onClick={mint}
            mt={4}
            colorScheme="purple"
            isDisabled={updateIsLoading}
            isLoading={updateIsLoading}
          >
            Mint Token
            </Button>
         </div>

        </div>

  )
}