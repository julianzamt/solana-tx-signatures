import * as web3 from '@solana/web3.js';

import { checkSignatures, createAccount, createPda } from './functions';
import { EXT_PROGRAM_ID, LOCAL_PROGRAM_ID } from './constants';

const connection = new web3.Connection('http://127.0.0.1:8899');

async function main() {
  await createPda(connection, LOCAL_PROGRAM_ID);
  await createPda(connection, EXT_PROGRAM_ID);
  const localNotPDA = await createAccount(connection);
  const extNotPDA = await createAccount(connection, EXT_PROGRAM_ID);

  const notInitialized = web3.Keypair.generate();

  await checkSignatures(
    connection,
    localNotPDA,
    extNotPDA,
    notInitialized,
    EXT_PROGRAM_ID
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
