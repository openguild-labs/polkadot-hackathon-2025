#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, vec, Address, Env, Error as SdkError,
    String, Symbol, Vec,
};

#[contract]
pub struct CatContract;

#[derive(Clone, Debug, PartialEq)]
#[repr(u32)]
pub enum Error {
    Unauthorized = 1,
    MinterNotFound = 2,
    TokenExists = 3,
    TokenNotFound = 4,
}

impl From<Error> for SdkError {
    fn from(err: Error) -> SdkError {
        SdkError::from_contract_error(err as u32)
    }
}

#[contracttype]
pub struct Roles {
    pub admin: Address,
    pub minters: Vec<Address>,
}

const ROLES: Symbol = symbol_short!("ROLES");
const BASE_URI: Symbol = symbol_short!("BASE_URI");

#[contractimpl]
impl CatContract {
    // Initialize contract with admin and minter roles in persistent storage
    pub fn initialize(
        env: Env,
        admin: Address,
        minters: Vec<Address>,
        base_uri: String,
    ) -> Result<(), SdkError> {
        // Check if the contract has already been initialized by checking the presence of the ROLES key
        if env.storage().persistent().has(&ROLES) {
            return Err(Error::Unauthorized.into());
        }
        let roles = Roles {
            admin: admin.clone(),
            minters: minters.clone(),
        };
        env.storage().persistent().set(&ROLES, &roles);
        env.storage().persistent().set(&BASE_URI, &base_uri);

        Ok(())
    }

    // Helper function to check if an invoker is authorized to mint (either admin or a minter)
    fn is_authorized_minter(roles: &Roles, invoker: &Address) -> bool {
        if *invoker == roles.admin {
            return true;
        }

        // Check if the invoker is in the list of minters
        roles.minters.iter().any(|minter| minter.eq(invoker))
    }

    // Mint an NFT to a specific address using persistent storage
    pub fn mint(env: Env, invoker: Address, to: Address, token_id: String) -> Result<(), SdkError> {
        let roles: Roles = env.storage().persistent().get(&ROLES).unwrap();

        // Require that the invoker (caller) has authorized this call
        invoker.require_auth();

        // Only minter or admin can mint NFTs
        if !Self::is_authorized_minter(&roles, &invoker) {
            return Err(Error::Unauthorized.into());
        }

        // Check if the token ID already exists in persistent storage
        if env.storage().persistent().has(&token_id) {
            return Err(Error::TokenExists.into());
        }

        env.storage().persistent().set(&token_id, &to.clone());

        Ok(())
    }

    pub fn check() -> Result<(), SdkError> {
        Ok(())
    }

    // Add a minter
    pub fn add_minter(env: Env, invoker: Address, new_minter: Address) -> Result<(), SdkError> {
        let mut roles: Roles = env.storage().persistent().get(&ROLES).unwrap();

        // Only admin can add a new minter
        invoker.require_auth();
        if invoker != roles.admin {
            return Err(Error::Unauthorized.into());
        }

        // Add the new minter to the minters list
        roles.minters.push_back(new_minter);
        env.storage().persistent().set(&ROLES, &roles);
        Ok(())
    }

    // Remove a minter
    pub fn remove_minter(
        env: Env,
        invoker: Address,
        minter_to_remove: Address,
    ) -> Result<(), SdkError> {
        let mut roles: Roles = env.storage().persistent().get(&ROLES).unwrap();

        // Only admin can remove a minter
        invoker.require_auth();
        if invoker != roles.admin {
            return Err(Error::Unauthorized.into());
        }

        // Find and remove the minter
        let minter_index = roles.minters.iter().position(|m| m.eq(&minter_to_remove));
        if let Some(index) = minter_index {
            roles.minters.remove(index.try_into().unwrap());
        } else {
            return Err(Error::MinterNotFound.into());
        }

        env.storage().persistent().set(&ROLES, &roles);
        Ok(())
    }

    // Burn an NFT by removing it from persistent storage
    pub fn burn(env: Env, invoker: Address, token_id: String) -> Result<(), SdkError> {
        let roles: Roles = env.storage().persistent().get(&ROLES).unwrap();

        // Require that the invoker (caller) has authorized this call
        invoker.require_auth();

        // Only minter or admin can mint NFTs
        if !Self::is_authorized_minter(&roles, &invoker) {
            return Err(Error::Unauthorized.into());
        }

        // Check if the token exists in persistent storage
        if !env.storage().persistent().has(&token_id) {
            return Err(Error::TokenNotFound.into());
        }

        // Remove the token from persistent storage
        env.storage().persistent().remove(&token_id);

        Ok(())
    }

    // Transfer an NFT from one address to another
    pub fn transfer_from(
        env: Env,
        invoker: Address,
        from: Address,
        to: Address,
        token_id: String,
    ) -> Result<(), SdkError> {
        // Retrieve the stored roles
        let roles: Roles = env.storage().persistent().get(&ROLES).unwrap();

        // Require that the invoker (caller) has authorized this call
        invoker.require_auth();

        // Check if the token exists in persistent storage
        if !env.storage().persistent().has(&token_id) {
            return Err(Error::TokenNotFound.into());
        }

        // Get the current NFT
        let owner = env.storage().persistent().get(&token_id).unwrap();

        // Check if the invoker is the owner or an authorized entity (admin)
        if invoker != owner && invoker != from && !Self::is_authorized_minter(&roles, &invoker)
        {
            return Err(Error::Unauthorized.into());
        }

        // Ensure the current owner matches the "from" address
        if owner != from {
            return Err(Error::Unauthorized.into());
        }

        // Update the NFT with the new owner
        env.storage().persistent().set(&token_id, &to.clone());

        Ok(())
    }

    // Get the owner of an NFT from persistent storage
    pub fn owner_of(env: Env, token_id: String) -> Result<Address, SdkError> {
        // Check if the token exists in persistent storage
        if !env.storage().persistent().has(&token_id) {
            return Err(Error::TokenNotFound.into());
        }
        let owner = env.storage().persistent().get(&token_id).unwrap();
        Ok(owner)
    }

    // Set the base URI for the metadata in persistent storage
    pub fn set_base_uri(env: Env, invoker: Address, new_base_uri: String) -> Result<(), SdkError> {
        let roles: Roles = env.storage().persistent().get(&ROLES).unwrap();

        // Require that the invoker (caller) has authorized this call
        invoker.require_auth();

        // Only admin can set the base URI
        if invoker != roles.admin {
            return Err(Error::Unauthorized.into());
        }

        env.storage().persistent().set(&BASE_URI, &new_base_uri);
        Ok(())
    }

    // Get the base URI for the NFTs from persistent storage
    pub fn get_base_uri(env: Env) -> String {
        env.storage().persistent().get(&BASE_URI).unwrap()
    }

    // Get the token URI by concatenating base URI and token ID
    pub fn get_token_uri(env: Env, token_id: String) -> Result<Vec<String>, SdkError> {
        // Check if the token exists in persistent storage
        if !env.storage().persistent().has(&token_id) {
            return Err(Error::TokenNotFound.into());
        }
        let base_uri: String = Self::get_base_uri(env.clone());

        Ok(vec![&env, base_uri, token_id])
    }
}

mod test;
