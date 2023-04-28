use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum CheckSignaturesError {
    #[error("Invalid Instruction")]
    InvalidInstruction,

    #[error("Already Initialized")]
    AlreadyInitialized,

    #[error("Account must be signer")]
    AccountMustBeSigner,
}

impl From<CheckSignaturesError> for ProgramError {
    fn from(e: CheckSignaturesError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
