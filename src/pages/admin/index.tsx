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
import { FiChevronDown } from 'react-icons/fi'

import { contractInvoke, useRegisteredContract } from '@soroban-react/contracts'
import { Address, nativeToScVal, ScInt, xdr } from '@stellar/stellar-sdk'

import { useSorobanReact } from "@soroban-react/core"
import * as StellarSdk from '@stellar/stellar-sdk';
import { LoansDashboard } from '@/components/web3/LoansDashboard'
import { Button, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, useDisclosure } from '@chakra-ui/react'
import Link from 'next/link'
import { RequestLoanContractInteractions } from '@/components/web3/RequestLoanContractInteractions'
import { NavBar } from '@/components/layout/NavBar'
import { Whitelist } from '@/components/web3/Whitelist'
import { ApproveLoanContractInteraction } from '@/components/web3/ApproveLoanContractInteraction'
import { ViewLoansContractInteraction } from '@/components/web3/ViewLoansContractInteraction'
const inter = Inter({ subsets: ["latin"] });


const AdminPage: NextPage = () => {

  const sorobanContext = useSorobanReact()

  const { activeChain, server, address } = sorobanContext

  const [, setFetchIsLoading] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  
  
  const [fetchedBalance, setBalance] = useState<string>()
  const [updateFrontend, toggleUpdate] = useState<boolean>(true)
  const [contractAddressStored, setContractAddressStored] = useState<string>()
  const tokenContract = useRegisteredContract("lumen_usdc")

  
  

  return (
    <main
      tw={"flex min-h-screen flex-col items-center w-full"}
    >
     <NavBar/>
      <div tw={"min-h-screen w-full pt-20 flex flex-col space-y-12 items-center"}>
        <Whitelist/>
        <ApproveLoanContractInteraction/>
        <ViewLoansContractInteraction/>
      </div>
    
    </main>
    
  )
}

export default AdminPage
