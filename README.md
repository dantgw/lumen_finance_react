# Welcome to your soroban react dapp boilerplate!

This dapp largely inspired by the [ink!athon](https://github.com/scio-labs/inkathon) project will help you kickstart your soroban dapp creator journey.

## Verify installation

To verify that everything is in order you can run

```bash
# If you use yarn
yarn dev

# If you use npm or pnpm
npm run dev
pnpm run dev
```

This will start the development server. The dapp will be available on localhost. 

## Useful Commands to deploy and initialize smart contract
This uses the Stellar CLI

### Build
cargo build --target wasm32-unknown-unknown --release

### Deploy
Deployment follows a 2-step process. Do this for both the token smart contract and lumen_finance smart contract.

1) Installation
stellar contract install \
  --network testnet \
  --source bob \
  --wasm target/wasm32-unknown-unknown/release/lumen_finance_contract.wasm

Take note of the hash that prints on the console

2) Deploy
stellar contract deploy \
  --wasm-hash 29aa140eb8fd57df7bd0ca2366e115752970310b26d290135a3796e66663a693 \
  --source bob \
  --network testnet

Take note of the contract ID that prints on the console

### Initialize Token Smart Contract
stellar contract invoke \
  --id CD2HM6J5UML3XEH4EBU3TFWZDVF3AIU64HAPKYDYE43Q3DEWMKT5MZXT \
  --source bob \
  --network testnet \
  -- \
  initialize \
  --admin GDQCMH2XW4EBE75MWSSTAJU4E26XFCCGICKCHGFXB2ECLJAXN3Y4LUQJ \
  --decimal 6 \
  --name lumen_usdc \
  --symbol USDC

### Initialize Lumen Smart Contract
The token_wasm_hash refers to the hash that is output from the installation step of the token smart contract.
stellar contract invoke \
  --id CC3O32XG3E2RGRP43F4OUJTWQFSDKNAQK3PC3NUBLDRPKOUGDR7NIWOU \
  --source bob \
  --network testnet \
  -- \
  initialize \
  --token_wasm_hash 7d2009f4a99b33c2040f6fd41bbf073a9247d453a870b69ae6ee92de991d89b0 \
  --usdc CD2HM6J5UML3XEH4EBU3TFWZDVF3AIU64HAPKYDYE43Q3DEWMKT5MZXT \
  --admin GDQCMH2XW4EBE75MWSSTAJU4E26XFCCGICKCHGFXB2ECLJAXN3Y4LUQJ \
  --insurance GCIRPN6C2ZYTFKYV75VDDZASV43WET36ZL23YXIAL5VFDIEGXNB2Z6HE

### Whitelist Account
stellar contract invoke \
  --id CC3O32XG3E2RGRP43F4OUJTWQFSDKNAQK3PC3NUBLDRPKOUGDR7NIWOU \
  --source bob \
  --network testnet \
  -- \
  whitelist \
  --address GAEWV6C4XOS4GZB2XY7ZGFQ6CWMWOWHXYBJF6SXXO6QZMGGWZUSXHLMH

### My Smart Contract Values
#### Token Address (No Auth)
CD2HM6J5UML3XEH4EBU3TFWZDVF3AIU64HAPKYDYE43Q3DEWMKT5MZXT
#### Lumen Finance Contract ID:
CC3O32XG3E2RGRP43F4OUJTWQFSDKNAQK3PC3NUBLDRPKOUGDR7NIWOU
#### Token Hash
7d2009f4a99b33c2040f6fd41bbf073a9247d453a870b69ae6ee92de991d89b0
#### Lumen Finance Hash
29aa140eb8fd57df7bd0ca2366e115752970310b26d290135a3796e66663a693


## Test
For the public to test, I have whitelisted this test account.

Test Account Address
GAEWV6C4XOS4GZB2XY7ZGFQ6CWMWOWHXYBJF6SXXO6QZMGGWZUSXHLMH

Test Account Secret Key
SDX3AQ2ZM4BTMXSUYVJZJHPCYQT42LB4L7I2F3X6BK3LUM7HTLFWIOQT

Admin Account Address
GDYO4Y7TFSHO2CSSESJ47IVVZR5OECVX7IB5GQSH7BZ7YEVF5QS3ZEFO

Admin Account Secret Key
SCCMAOLQV4Y66YSQSWDPSHOFKGC2HJYA56WNGNL76TL2NZOMOIFNKBNF