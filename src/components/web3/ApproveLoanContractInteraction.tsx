import { Button, Card, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, VStack } from '@chakra-ui/react'
import { type FC, useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import { useSorobanReact } from "@soroban-react/core"
import * as StellarSdk from '@stellar/stellar-sdk';

import React from 'react'
import Link from 'next/link'

import { contractInvoke, TxResponse, useRegisteredContract } from '@soroban-react/contracts'
import { nativeToScVal, ScInt, xdr } from '@stellar/stellar-sdk'



export const ApproveLoanContractInteraction: FC = () => {
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

  const [invoiceNo, setInvoiceNo] = useState<number>(0);
  const handleInvoiceNoChange = (valueString: string) => {
    setInvoiceNo(Number(valueString)); // Convert the string value to a number
  };

  const [feeRate, setFeeRate] = useState<number>(0);
  const handleFeeRate = (valueString: string) => {
    setFeeRate(Number(valueString)); // Convert the string value to a number
  };

  const { activeChain, server, address } = sorobanContext

  const approveLoan = async () => {
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

        try {
          const result = await contract?.invoke({
            method: 'approve_loan',
            args: [
              nativeToScVal(invoiceNo, {type: "u32"}),
              new ScInt(feeRate).toI128(),
            ],
            signAndSend: true
          })
          console.log('🚀 « result:', result);
          let result2 = result as TxResponse
          if (result2.status == "SUCCESS") {
            toast.success("Loan Approval Success!")
          }
          else {
            toast.error("Loan Approval unsuccessful...")
            
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
        <h2 tw="text-center text-2xl font-semibold text-black">Approve Loan</h2>
          
          <form onSubmit={handleSubmit(approveLoan)}>
            <VStack spacing={2} align="middle">
              <FormControl>
                  <FormLabel>Invoice Number</FormLabel>
                  <NumberInput value={invoiceNo} onChange={handleInvoiceNoChange}>
                  <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                    <FormLabel>Fee Rate</FormLabel>
                    <NumberInput value={feeRate} onChange={handleFeeRate}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                    </NumberInput>
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