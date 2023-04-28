import * as web3 from '@solana/web3.js';

export const SECRET = []; // your local private test-key. Try: $cat ~/.config/solana/id.json
export const LOCAL_PROGRAM_ID_STRING = ''; // Whatever returned from solana deploy
export const EXT_PROGRAM_ID_STRING =
  ''; // Whatever returned from solana deploy
export const KEY: Uint8Array = Uint8Array.from(SECRET);
export const LOCAL_PROGRAM_ID = new web3.PublicKey(LOCAL_PROGRAM_ID_STRING);
export const EXT_PROGRAM_ID = new web3.PublicKey(EXT_PROGRAM_ID_STRING);
export const SIGNER: web3.Keypair = web3.Keypair.fromSecretKey(KEY);
