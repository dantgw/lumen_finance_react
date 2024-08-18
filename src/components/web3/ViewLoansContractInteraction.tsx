import { Button, Card, CardBody, CardHeader, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, VStack } from '@chakra-ui/react'
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

export type LoanDetails = { 
  approved: boolean,
  fee_rate: bigint,
  invoice_amount: bigint,
  loan_amount: bigint,
  released:boolean,
  repaid:boolean,
  repayment_date: bigint,
  who: string
 }

export const ViewLoansContractInteraction: FC = () => {
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
   console.log('valueString',valueString)
    setInvoiceNo(Number(valueString)); // Convert the string value to a number
  };

  const [loanDetails, setLoanDetails] = useState<LoanDetails | undefined>();

  const { activeChain, server, address } = sorobanContext

  const fetchLoan = useCallback(async (invoiceNumber:any) => {
    if (!sorobanContext.server) return

    const currentChain = sorobanContext.activeChain?.name?.toLocaleLowerCase()
    if (!currentChain) {
      console.log("No active chain")
      toast.error('Wallet not connected. Try again…')
      return
    }
    else {
      const contractAddress = contract?.deploymentInfo.contractAddress
      setContractAddressStored(contractAddress)
      setFetchIsLoading(true)

      console.log('invoiceNumber', invoiceNumber)

      try {
        const result = await contract?.invoke({
          method: 'get_loan_details',
          args: [nativeToScVal(invoiceNumber, {type: "u32"})]
        })

        if (!result) return
        console.log('🚀 « result:', result);
        // Value needs to be cast into a string as we fetch a ScVal which is not readable as is.
        // You can check out the scValConversion.tsx file to see how it's done
        const result_string = StellarSdk.scValToNative(result as StellarSdk.xdr.ScVal) as LoanDetails
        setLoanDetails(result_string)
      } catch (e) {
        console.error(e)
        // toast.error('Error while fetching greeting. Try again…')
        setLoanDetails(undefined)
      } finally {
        setFetchIsLoading(false)
      }
    }
  },[sorobanContext,contract])

  useEffect(() => {void fetchLoan(0)}, [updateFrontend,fetchLoan])

  return (
        <div tw={"rounded-2xl bg-white p-6 flex flex-col space-y-4 shadow-sm max-w-96 w-full"}>
        <h2 tw="text-center text-2xl font-semibold text-black">View Loan</h2>
          
          <form onSubmit={handleSubmit(fetchLoan)}>
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
                

              <Button
                onClick={e=>fetchLoan(invoiceNo)}
                mt={4}
                colorScheme="purple"
                isDisabled={updateIsLoading}
                isLoading={updateIsLoading}
              >
                Submit
              </Button>
            </VStack>
          </form>
          <Card>
            <CardHeader
            tw="text-center font-semibold text-black"
            >
              Loan Details
              </CardHeader>
            <CardBody>
              <Stack>
                <p>Approved: {loanDetails?.approved.toString()}</p>
                <p>Fee Rate: {loanDetails?.fee_rate.toString()}</p>
                <p>Invoice Amount: {loanDetails?.invoice_amount.toString()}</p>
                <p>Loan Amount: {loanDetails?.loan_amount.toString()}</p>
                <p>Released: {loanDetails?.released.toString()}</p>
                <p>Repaid: {loanDetails?.repaid.toString()}</p>
                <p>Repayment Date: {loanDetails?.repayment_date.toString()}</p>
                <p>Requester: {loanDetails?.who}</p>
              </Stack>
            </CardBody>
          </Card>
        </div>

  )
}