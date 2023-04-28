use crate::{instructions::*, errors::*};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey, program::invoke_signed, system_instruction::create_account,
    rent::Rent,
    sysvar::Sysvar,
};

pub struct Processor;

impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = CheckSignaturesInstruction::unpack(instruction_data)?;

        match instruction {
            CheckSignaturesInstruction::CreatePda {} => {
                Self::process_create_pda(accounts, program_id)?;
            }
            CheckSignaturesInstruction::CheckSignatures {} => {
                Self::process_check_signatures(accounts)?;
            }
        }

        Ok(())
    }

    pub fn process_create_pda(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
        msg!("process_create_pda ix...");     
        let account_info_iter = &mut accounts.iter();
        
        let signer_account_info = next_account_info(account_info_iter)?;
        let pda = next_account_info(account_info_iter)?;

        let (_, bump) = Pubkey::find_program_address(&[b"new_pda"], program_id);

        let rent = Rent::get()?;
        let space = 4;
        let rent_minimum_balance = rent.minimum_balance(space);

        invoke_signed(
            &create_account(
                &signer_account_info.key,
                &pda.key,
                rent_minimum_balance,
                space as u64,
                program_id,
            ),
            &[signer_account_info.clone(), pda.clone()],
            &[&[b"new_pda", &[bump]]],
        )?;

        Ok(())
    }


    pub fn process_check_signatures(accounts: &[AccountInfo]) -> ProgramResult {
        msg!("process_check_signatures ix...");     
        let account_info_iter = &mut accounts.iter();
        
        // The wallet is the only one of this set that can pay fees
        let wallet_system_account = next_account_info(account_info_iter)?;
        let local_not_pda = next_account_info(account_info_iter)?;
        let ext_not_pda = next_account_info(account_info_iter)?;
        let non_initialized_account = next_account_info(account_info_iter)?;
        // let _local_pda = next_account_info(account_info_iter)?;
        // let _ext_pda = next_account_info(account_info_iter)?;
    
        if !wallet_system_account.is_signer {
            return Err(CheckSignaturesError::AccountMustBeSigner.into());
        }
    
        if !local_not_pda.is_signer {
            return Err(CheckSignaturesError::AccountMustBeSigner.into());
        }
    
        if !ext_not_pda.is_signer {
            return Err(CheckSignaturesError::AccountMustBeSigner.into());
        }
    
        if !non_initialized_account.is_signer {
            return Err(CheckSignaturesError::AccountMustBeSigner.into());
        }
    
        msg!("All checks passed!"); 
    
        Ok(())
    }

}
