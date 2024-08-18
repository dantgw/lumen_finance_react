import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import Link from 'next/link'
import type { FC, PropsWithChildren } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import 'twin.macro'
import { ConnectButton } from '../web3/ConnectButton'

export const NavBar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <nav tw={"fixed left-0 px-10 top-0 w-full flex flex-row h-16 items-center justify-between"}>
    <div tw={"flex flex-row items-center space-x-4"}>
      <img src={"/icons/logo.png"} />
      <span> Lumen Finance </span>
    </div>
    <div tw={"flex flex-row items-center space-x-6"}>
      <span><Link href="request_loan">
      Get Funding
      </Link>
      </span>

      <Menu>
        <MenuButton as={Button} rightIcon={<FiChevronDown />}
        tw="font-medium bg-white"
        >
          Services
        </MenuButton>
        <MenuList>

          <MenuItem>
            <Link href="request_loan">
              Request Loan
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="view_loan">
              View Loan
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="claim_loan">
              Claim Loan
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="repay_loan">
              Repay Loan
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="admin">
              Admin
            </Link>
          </MenuItem>
        </MenuList>
      </Menu>
      <ConnectButton />

    </div>
  </nav>
  )
}
