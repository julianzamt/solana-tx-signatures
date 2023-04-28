# solana-tx-signatures
The intention of this repo is to test out what kind of accounts can sign a TX in Solana.
The fee payer account must be a SystemProgram owned account [src](https://github.com/solana-labs/solana/blob/master/runtime/src/accounts.rs#L450)

This program tests wether a wallet, a local owned account (not pda), an external own account (not pda) and an unitiliazed account can or not sign a TX.

Spoiler: All those types of accounts are valid signers of a TX.

## Usage
Pre-Requirements:
* solana cli
* nodeJS

### From the root folder:
1 - cd localProgram/cli && npm install
2 - solana-test-validator -r (This will start a local validator)  

### In another terminal:
3 - `cd localProgram/ && cargo build-sbf && solana program deploy target/deploy/tx_signatures.so --url localhost && cd ..`  
4 - Paste the returned programId into the LOCAL_PROGRAM_ID_STRING field in localProgram/cli/constants.ts  
5 - `cd extProgram/ && cargo build-sbf && solana program deploy target/deploy/tx_signatures_ext.so --url localhost && cd ..`  
6 - Paste the returned programId into the EXT_PROGRAM_ID_STRING field in second_owner/cli/constants.ts  
7 - In localProgram/cli/constant.ts, insert your test private key. Try: $cat ~/.config/solana/id.json (If you don't have one yet, run `solana-keygen new` first)  
9 - Open first_owner/cli/index.ts. You'll find function calls to send txs to the deployed contracts.  
10 - Comment and uncomment fns in one contract and the other to have a taste of what you can and cannot do changing account ownership.  
11 - Execute the client with `npx ts-node cli/index.ts`
