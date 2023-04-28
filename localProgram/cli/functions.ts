import * as web3 from '@solana/web3.js';
import { Buffer } from 'buffer';
import { LOCAL_PROGRAM_ID, SIGNER } from './constants';
import * as utils from './utils';

export const createPda = async (
  connection: web3.Connection,
  programId: web3.PublicKey,
  signer: web3.Keypair = SIGNER
): Promise<string> => {
  let instructionNumber = 0;

  let dataBuffer = Buffer.from('');

  dataBuffer = utils.packUInt8(dataBuffer, instructionNumber);

  let [pdaAddress] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('new_pda')],
    programId
  );

  const instruction = new web3.TransactionInstruction({
    programId,
    keys: [
      { pubkey: signer.publicKey, isSigner: true, isWritable: true },
      { pubkey: pdaAddress, isSigner: false, isWritable: true },
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
    ],
    data: dataBuffer,
  });

  let txReceipt = await web3.sendAndConfirmTransaction(
    connection,
    new web3.Transaction().add(instruction),
    [signer]
  );

  return txReceipt;
};

export const checkSignatures = async (
  connection: web3.Connection,
  localNotPda: web3.Keypair,
  extNotPda: web3.Keypair,
  notInitialized: web3.Keypair,
  otherProgramId: web3.PublicKey,
  programId: web3.PublicKey = LOCAL_PROGRAM_ID,
  signer: web3.Keypair = SIGNER
) => {
  let instructionNumber = 1;

  let dataBuffer = Buffer.from('');

  dataBuffer = utils.packUInt8(dataBuffer, instructionNumber);

  let [localPdaAddress] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('pda')],
    programId
  );

  let [extPdaAddress] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('pda')],
    otherProgramId
  );

  const instruction = new web3.TransactionInstruction({
    programId,
    keys: [
      { pubkey: signer.publicKey, isSigner: true, isWritable: true },
      { pubkey: localNotPda.publicKey, isSigner: true, isWritable: false },
      { pubkey: extNotPda.publicKey, isSigner: true, isWritable: false },
      { pubkey: notInitialized.publicKey, isSigner: true, isWritable: false },
      { pubkey: localPdaAddress, isSigner: false, isWritable: false },
      { pubkey: extPdaAddress, isSigner: false, isWritable: false },
    ],
    data: dataBuffer,
  });

  let txReceipt = await web3.sendAndConfirmTransaction(
    connection,
    new web3.Transaction().add(instruction),
    [signer, localNotPda, extNotPda, notInitialized]
  );
  return txReceipt;
};

export const createAccount = async (
  connection: web3.Connection,
  ownerId: web3.PublicKey = LOCAL_PROGRAM_ID,
  signer: web3.Keypair = SIGNER
): Promise<web3.Keypair> => {
  const keypair = web3.Keypair.generate();

  let ix = web3.SystemProgram.createAccount({
    fromPubkey: signer.publicKey,
    lamports: 10000000,
    newAccountPubkey: keypair.publicKey,
    programId: ownerId,
    space: 8,
  });

  let tx = new web3.Transaction().add(ix);

  await web3.sendAndConfirmTransaction(connection, tx, [signer, keypair]);

  return keypair;
};
