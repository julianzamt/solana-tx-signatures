use crate::*;
use solana_program::{msg, program_error::ProgramError};

#[derive(Debug)]
pub enum CheckSignaturesInstruction {
    CreatePda {},
    CheckSignatures {},
}

impl CheckSignaturesInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        msg!("Unpacking instruction...");

        let (tag, _) = input
            .split_first()
            .ok_or(errors::CheckSignaturesError::InvalidInstruction)?;

        Ok(match tag {
            0 => Self::CreatePda {},
            1 => Self::CheckSignatures {},
            _ => return Err(errors::CheckSignaturesError::InvalidInstruction.into()),
        })
    }
}
