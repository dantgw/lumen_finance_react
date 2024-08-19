import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import Link from 'next/link'
import type { FC, PropsWithChildren } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import 'twin.macro'
import { ConnectButton } from '../web3/ConnectButton'

export const NavBar: FC<PropsWithChildren> = ({ children }) => {

  const menuItem =[{name: "Request Loan", link: "request_loan"}, {name: "View Loan", link: "view_loan"}, {name: "Claim Loan", link: "claim_loan"}, {name: "Repay Loan", link: "repay_loan"}, {name: "Admin", link: "admin"}]
  return (
    <nav tw={"fixed left-0 px-10 top-0 w-full flex flex-row h-16 items-center justify-between z-1"}>
    <div tw={"flex flex-row items-center space-x-4"}>
      <img src={"/icons/logo.png"} />
      <span> <Link href={"/"}>
      Lumen Finance 
      </Link>
      </span>
    </div>
    <div tw={"flex flex-row items-center space-x-6"}>
      <span><Link href="request_loan">
      Get Funding
      </Link>
      </span>

      <Menu >
        <MenuButton as={Button} rightIcon={<FiChevronDown />}
        tw="font-medium bg-white z-50"
        >
          Services
        </MenuButton>
        <MenuList zIndex="dropdown w-full">
          {menuItem.map((item, index) => {
        return (
          <MenuItem
            tw="w-full"
            key={item.name}
          >
            <Link 
            tw="w-full"
            href={item.link}>
              {item.name}
            </Link>
          </MenuItem>
          )

          })}
          
        </MenuList>
      </Menu>
      <ConnectButton />

    </div>
  </nav>
  )
}
