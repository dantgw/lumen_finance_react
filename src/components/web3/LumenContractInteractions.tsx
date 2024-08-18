import { Button, Card, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, useDisclosure } from '@chakra-ui/react'
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


type FetchBalance = { fetchBalance: () => void; }

export const LumenContractInteractions: FC<FetchBalance> = ({fetchBalance}) => {
  const sorobanContext = useSorobanReact()


  const [, setFetchIsLoading] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  
  const [fetchedFees, setFees] = useState<string>()
  const [fetchedUserShareBalance, setUserShareBalance] = useState<string>()
  const [fetchedShareBalance, setShareBalance] = useState<string>()

  const [updateFrontend, toggleUpdate] = useState<boolean>(true)
  const [contractAddressStored, setContractAddressStored] = useState<string>()

  const { isOpen: isDepositOpen, onOpen: onDepositOpen, onClose: onDepositClose } = useDisclosure()
  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useDisclosure()

  const [depositValue, setDepositValue] = useState<number>(0);

  const handleDepositChange = (valueString: string) => {
    setDepositValue(Number(valueString)); // Convert the string value to a number
  };

  const [withdrawValue, setWithdrawValue] = useState<number>(0);

  const handleWithdrawChange = (valueString: string) => {
    setWithdrawValue(Number(valueString)); // Convert the string value to a number
  };

  // Retrieve the deployed contract object from contract Registry
  const contract = useRegisteredContract("lumen_finance")

  const { activeChain, server, address } = sorobanContext

  // Fetch Fees
  const fetchFees = useCallback(async () => {
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
      try {
        const result = await contract?.invoke({
          method: 'get_fees_earned',
          args: []
        })

        if (!result) return

        // Value needs to be cast into a string as we fetch a ScVal which is not readable as is.
        // You can check out the scValConversion.tsx file to see how it's done
        const result_string = StellarSdk.scValToNative(result as StellarSdk.xdr.ScVal) as string
        setFees(result_string)
      } catch (e) {
        console.error(e)
        // toast.error('Error while fetching fees. Try again…')
        setFees(undefined)
      } finally {
        setFetchIsLoading(false)
      }
    }
  },[sorobanContext,contract])

  // Fetch UserShareBalance
  const fetchUserShareBalance = useCallback(async () => {
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
      const contractAddress = contract?.deploymentInfo.contractAddress
      setContractAddressStored(contractAddress)
      setFetchIsLoading(true)
      try {
        const result = await contract?.invoke({
          method: 'get_user_share_balance',
          args: [new Address(address).toScVal()]
        })
       
        if (!result) return

        // Value needs to be cast into a string as we fetch a ScVal which is not readable as is.
        // You can check out the scValConversion.tsx file to see how it's done
        const result_string = StellarSdk.scValToNative(result as StellarSdk.xdr.ScVal) as string
        setUserShareBalance(result_string)
      } catch (e) {
        console.error(e)
        setUserShareBalance(undefined)
      } finally {
        setFetchIsLoading(false)
      }
    }
  },[sorobanContext,contract])

  const fetchShareBalance = useCallback(async () => {
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
      const contractAddress = contract?.deploymentInfo.contractAddress
      setContractAddressStored(contractAddress)
      setFetchIsLoading(true)
      try {
        // const result = await contract?.invoke({
        //   method: 'get_user_share_balance',
        //   args: [new Address(address).toScVal()]
        // })
        const result = await contract?.invoke({
          method: 'get_shares',
          args: []
        })

        if (!result) return

        // Value needs to be cast into a string as we fetch a ScVal which is not readable as is.
        // You can check out the scValConversion.tsx file to see how it's done
        const result_string = StellarSdk.scValToNative(result as StellarSdk.xdr.ScVal) as string
        setShareBalance(result_string)
      } catch (e) {
        console.error(e)
        // toast.error('Error while fetching balance. Try again…')
        setShareBalance(undefined)
      } finally {
        setFetchIsLoading(false)
      }
    }
  },[sorobanContext,contract])

  useEffect(() => {void fetchFees()}, [updateFrontend,fetchFees])

  useEffect(() => {void fetchUserShareBalance()}, [updateFrontend,fetchUserShareBalance])

  useEffect(() => {void fetchShareBalance()}, [updateFrontend,fetchShareBalance])


  const deposit = async () => {
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
          const result = await contract?.invoke({
            method: 'deposit',
            args: [ new Address(address).toScVal(),  new ScInt(depositValue).toI128()],
            signAndSend: true
          })
          setDepositValue(0)
          onDepositClose()
          
          if (true) {
            toast.success("Deposit success!")
            fetchBalance()
          }
          else {
            toast.error("Deposit unsuccessful...")
            
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

  const withdraw = async () => {
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
          const result = await contract?.invoke({
            method: 'withdraw',
            args: [ new Address(address).toScVal(),  new ScInt(withdrawValue).toI128()],
            signAndSend: true
          })
          setWithdrawValue(0)
          onWithdrawClose()
          
          if (true) {
            toast.success("Withdraw success!")
            fetchBalance()
            
          }
          else {
            toast.error("Withdraw unsuccessful...")
            
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


  if(!contract){
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

      <div tw={"rounded-2xl bg-white p-6 flex flex-col space-y-4 shadow-sm w-full max-w-256"}>
          <div tw={"w-full flex flex-row space-x-16 justify-between"}>
            <div tw={"flex flex-col space-y-2"}>
              <span tw={"flex flex-row items-center space-x-2 w-48"}>
                <span> Total Value Deposited </span>
                <img src="/icons/info.png" tw="flex w-3 h-3" />
              </span>
              <div tw={"text-2xl"}>{fetchedShareBalance?.toString()}</div>
            </div>
         
            <div tw="space-x-4">
                <Button
                  tw="text-white bg-indigo-500 font-normal text-sm px-6"
                  onClick={onWithdrawOpen}
                  >
                    Withdraw Funds
                </Button>
              
              <Button 
                tw="text-black bg-white outline-slate-200 outline-1 font-normal text-sm px-6"
        
                onClick={onDepositOpen}>Fund Lumen
              </Button>

            </div>
            
          </div>
          <div tw={"flex flex-col space-y-2"}>
              <span tw={"flex flex-row items-center space-x-2 w-48"}>
                <span> User Share </span>
                <img src="/icons/info.png" tw="flex w-3 h-3" />
              </span>
              <div tw={"text-2xl"}>{fetchedUserShareBalance?.toString()}</div>
          </div>
          <div tw={"flex flex-col space-y-2"}>
              <span tw={"flex flex-row items-center space-x-2 w-48"}>
                <span> Fees Earned </span>
                <img src="/icons/info.png" tw="flex w-3 h-3" />
              </span>
              <div tw={"text-2xl"}>{fetchedFees?.toString()}</div>
          </div>
          <div tw={"flex flex-col space-y-2"}>
            <div tw={"flex flex-row text-xs text-gray-500"}>
              Next Payment Due
            </div>
            <div tw={"flex flex-row space-x-8"}>
              <span> Acacia Gardening </span>
              <span> $5000 </span>
              <span> Oct 30, 2024 </span>
            </div>
          </div>

          <Modal isOpen={isDepositOpen} onClose={onDepositClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Deposit Into Lumen</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
              <NumberInput value={depositValue} onChange={handleDepositChange}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
              </ModalBody>

              <ModalFooter>
                <Button 
                  tw="font-medium text-sm"
                mr={3} onClick={onDepositClose}>
                  Close
                </Button>
                <Button 
                onClick={deposit}
                tw="bg-indigo-500 text-white text-sm font-medium">Deposit</Button>
              </ModalFooter>
            </ModalContent>
            </Modal>

            <Modal isOpen={isWithdrawOpen} onClose={onWithdrawClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Withdraw from Lumen</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
              <NumberInput value={withdrawValue} onChange={handleWithdrawChange}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
              </ModalBody>

              <ModalFooter>
                <Button 
                  tw="font-medium text-sm"
                mr={3} onClick={onWithdrawClose}>
                  Close
                </Button>
                <Button 
                onClick={withdraw}
                tw="bg-indigo-500 text-white text-sm font-medium">Withdraw</Button>
              </ModalFooter>
            </ModalContent>
        </Modal>
      </div>

  )
}