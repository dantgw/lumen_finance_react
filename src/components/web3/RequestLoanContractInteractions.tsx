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

type UpdateGreetingValues = { newMessage: string }

export const RequestLoanContractInteractions: FC = () => {
  const sorobanContext = useSorobanReact()


  const [, setFetchIsLoading] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  const { register, handleSubmit } = useForm<UpdateGreetingValues>()
  
  const [fetchedGreeting, setGreeterMessage] = useState<string>()
  const [updateFrontend, toggleUpdate] = useState<boolean>(true)
  const [contractAddressStored, setContractAddressStored] = useState<string>()

  // Retrieve the deployed contract object from contract Registry
  const contract = useRegisteredContract("lumen_finance")


  const [invoiceNo, setInvoiceNo] = useState<number>(0);
  const handleInvoiceNoChange = (valueString: string) => {
    setInvoiceNo(Number(valueString)); // Convert the string value to a number
  };
  
  const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
  const handleInvoiceAmountChange = (valueString: string) => {
    setInvoiceAmount(Number(valueString)); // Convert the string value to a number
  };

  const [repaymentDate, setRepaymentDate] = useState<number>(Math.floor(Date.now()/1000));
  const handleRepaymentDateChange = (valueString: string) => {
    setRepaymentDate(Number(valueString)); // Convert the string value to a number
  };


  const { activeChain, server, address } = sorobanContext

  const requestLoan = async ({ newMessage }: UpdateGreetingValues ) => {
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
            method: 'request_loan',
            args: [new StellarSdk.Address(address).toScVal(), 
              new ScInt(invoiceAmount).toI128(),
              nativeToScVal(invoiceNo, {type: "u32"}),
              new ScInt(repaymentDate).toU64(),

            ],
            signAndSend: true
          })
          console.log('🚀 « result:', result);
          
          if (true) {
            toast.success("Loan Request Success!")
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


  return (


      


        <div tw={"rounded-2xl bg-white p-6 flex flex-col space-y-4 shadow-sm max-w-96 w-full"}>
        <h2 tw="text-center text-2xl font-semibold text-black">Request Loan</h2>
          
          <form onSubmit={handleSubmit(requestLoan)}>
            <VStack spacing={2} align="middle">
              <FormControl>
                <FormLabel>Invoice Amount</FormLabel>
                <NumberInput value={invoiceAmount} onChange={handleInvoiceAmountChange}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
                </NumberInput>
              </FormControl>
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
                <FormLabel>Repayment Date</FormLabel>
                <NumberInput value={repaymentDate} onChange={handleRepaymentDateChange}>
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