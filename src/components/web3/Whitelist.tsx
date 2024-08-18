import { Button, Card, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, VStack } from '@chakra-ui/react'
import { type FC, useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import { useSorobanReact } from "@soroban-react/core"
import * as StellarSdk from '@stellar/stellar-sdk';

import React from 'react'
import Link from 'next/link'

import { contractInvoke, useRegisteredContract } from '@soroban-react/contracts'
import { nativeToScVal, ScInt, xdr } from '@stellar/stellar-sdk'


export const Whitelist: FC = () => {
  const sorobanContext = useSorobanReact()


  const [, setFetchIsLoading] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  const { register, handleSubmit } = useForm()
  
  const [updateFrontend, toggleUpdate] = useState<boolean>(true)
  const [contractAddressStored, setContractAddressStored] = useState<string>()

  // Retrieve the deployed contract object from contract Registry
  const contract = useRegisteredContract("lumen_finance")

  const [whitelistAddress, setWhitelistAddress] = useState<string>();
  const handleWhitelistAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setWhitelistAddress(inputValue); // Convert the string value to a number
  };

  const { activeChain, server, address } = sorobanContext

  const whitelist = async () => {
    if (!address) {
      console.log("Address is not defined")
      // toast.error('Wallet is not connected. Try again...')
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
        if (!whitelistAddress){return}
        try {
          const result = await contract?.invoke({
            method: 'whitelist',
            args: [new StellarSdk.Address(whitelistAddress).toScVal(), 
            ],
            signAndSend: true
          })
          console.log('🚀 « result:', result);
          
          if (true) {
            toast.success("Whitelist Success!")
          }
          else {
            toast.error("Whitelist unsuccessful...")
            
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

  return (

        <div tw={"rounded-2xl bg-white p-6 flex flex-col space-y-4 shadow-sm max-w-96 w-full"}>
        <h2 tw="text-center text-2xl font-semibold text-black">Whitelist</h2>
          
          <form onSubmit={handleSubmit(whitelist)}>
            <VStack spacing={2} align="middle">
              <FormControl>
                <FormLabel>Whitelist Address</FormLabel>
                <Input value={whitelistAddress} onChange={handleWhitelistAddressChange}>
            
                </Input>
              </FormControl>

              <Button
                type="submit"
                mt={4}
                colorScheme="purple"
                isDisabled={updateIsLoading}
                isLoading={updateIsLoading}
              >
                Submit
              </Button>
            </VStack>
          </form>
        </div>

  )
}