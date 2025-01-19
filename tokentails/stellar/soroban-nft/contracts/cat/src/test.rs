#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, vec, Address, Env, String};

#[test]
fn test_initialize_and_mint() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);

    // Mint an NFT
    let token_id =String::from_str(&env, "cat_1");
    client.mint(&minter, &minter, &token_id);

    // Verify the owner
    let owner = client.try_owner_of(&token_id);
    assert_eq!(owner.unwrap(), Ok(minter.clone()));
}
#[test]
fn test_initialize_twice() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);
    
    assert!(client.try_initialize(&admin, &vec![&env, minter.clone()], &base_uri).is_err());
}

#[test]
fn test_unauthorized_mint() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let random_user = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter], &base_uri);

    // Attempt to mint with unauthorized user
    let token_id = String::from_str(&env, "cat_2");
    
    // Now we use assert!(client.try_mint(..).is_err()) to check for the error
    assert!(client.try_mint(&random_user, &random_user, &token_id).is_err());
}

#[test]
fn test_mint() {
    let env = Env::default();
    env.mock_all_auths();
    let admin: Address = Address::generate(&env);
    let minter = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);

    // Attempt to mint with unauthorized user
    let token_id = String::from_str(&env, "cat_2");
    
    // Now we use assert!(client.try_mint(..).is_err()) to check for the error
    assert!(client.try_mint(&minter, &minter, &token_id).is_ok());
}

#[test]
fn test_mint_existance() {
    let env = Env::default();
    env.mock_all_auths();
    let admin: Address = Address::generate(&env);
    let minter = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);

    // Attempt to mint with unauthorized user
    let token_id = String::from_str(&env, "cat_2");
    
    // Now we use assert!(client.try_mint(..).is_err()) to check for the error
    client.mint(&minter, &minter, &token_id);

    assert!(client.try_owner_of(&token_id).is_ok());

    client.burn(&minter, &token_id);

    assert!(client.try_owner_of(&token_id).is_err());
}

#[test]
fn test_add_and_remove_minter() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let new_minter = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);

    // Admin adds a new minter
    client.add_minter(&admin, &new_minter);

    // New minter should be able to mint
    let token_id = String::from_str(&env, "cat_3");
    assert!(client.try_mint(&new_minter, &new_minter, &token_id).is_ok());
    let owner = client.try_owner_of(&token_id);
    assert_eq!(owner.unwrap(), Ok(new_minter.clone()));

    // Remove the new minter
    client.remove_minter(&admin, &new_minter);

    // New minter should no longer be able to mint
    let token_id_2 = String::from_str(&env, "cat_4");
    
    // Use assert!(client.try_mint(..).is_err()) to check for the error
    assert!(client.try_mint(&new_minter, &new_minter, &token_id_2).is_err());
}

#[test]
fn test_add_minter_unauthorized() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let new_minter = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);

    // Admin adds a new minter
    assert!(client.try_add_minter(&minter, &new_minter).is_err());
}

#[test]
fn test_remove_minter_unauthorized() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let new_minter = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);

    // Admin adds a new minter
    assert!(client.try_add_minter(&admin, &new_minter).is_ok());

    // Admin adds a new minter
    assert!(client.try_remove_minter(&new_minter, &new_minter).is_err());
}

#[test]
fn test_burn() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);

    // Mint an NFT
    let token_id = String::from_str(&env, "cat_5");
    client.mint(&minter, &minter, &token_id);

    // Burn the NFT
    client.burn(&minter, &token_id);

    // Verify that the token is burned
    assert!(client.try_owner_of(&token_id).is_err());
}

#[test]
fn test_burn_unauthorized() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);

    // Mint an NFT
    let token_id = String::from_str(&env, "cat_5");
    assert!(client.try_mint(&minter, &minter, &token_id).is_err());
}

#[test]
fn test_burn_no_role() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let unauthorized_minter = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);

    // Mint an NFT
    let token_id = String::from_str(&env, "cat_5");
    assert!(client.try_mint(&unauthorized_minter, &minter, &token_id).is_err());
}

#[test]
fn test_set_and_get_base_uri() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter], &base_uri);

    // Verify base URI is set correctly
    assert_eq!(client.get_base_uri(), base_uri);

    // Change the base URI
    let new_base_uri = String::from_str(&env, "new_cat_b");
    client.set_base_uri(&admin, &new_base_uri);

    // Verify the updated base URI
    assert_eq!(client.get_base_uri(), new_base_uri);
}

#[test]
fn test_transfer_from_success() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let owner = Address::generate(&env);
    let new_owner = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);

    // Mint an NFT to the owner
    let token_id = String::from_str(&env, "cat_1");
    client.mint(&minter, &owner, &token_id);

    // Transfer the NFT from owner to new_owner
    assert!(client.try_transfer_from(&owner, &owner, &new_owner, &token_id).is_ok());

    // Verify that the owner of the NFT has changed to new_owner
    let updated_owner = client.try_owner_of(&token_id).unwrap();
    assert_eq!(updated_owner, Ok(new_owner));
}

#[test]
fn test_transfer_from_unauthorized_invoker() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let owner = Address::generate(&env);
    let unauthorized_user = Address::generate(&env);
    let new_owner = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);

    // Mint an NFT to the owner
    let token_id = String::from_str(&env, "cat_1");
    client.mint(&minter, &owner, &token_id);

    // Attempt to transfer the NFT with an unauthorized invoker
    assert!(client.try_transfer_from(&unauthorized_user, &owner, &new_owner, &token_id).is_err());

    // Verify that the owner has not changed
    let updated_owner = client.try_owner_of(&token_id).unwrap();
    assert_eq!(updated_owner, Ok(owner));
}

#[test]
fn test_transfer_from_nonexistent_token() {
    let env = Env::default();
    env.mock_all_auths();
    let owner = Address::generate(&env);
    let new_owner = Address::generate(&env);
    let token_id = String::from_str(&env, "cat_1");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Attempt to transfer a non-existent token
    assert!(client.try_transfer_from(&owner, &owner, &new_owner, &token_id).is_err());
}

#[test]
fn test_transfer_from_wrong_owner() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let owner = Address::generate(&env);
    let wrong_owner = Address::generate(&env); // Someone who is not the owner
    let new_owner = Address::generate(&env);
    let base_uri = String::from_str(&env, "cat_base");

    let client = CatContractClient::new(&env, &env.register_contract(None, CatContract));

    // Initialize the contract
    client.initialize(&admin, &vec![&env, minter.clone()], &base_uri);

    // Mint an NFT to the owner
    let token_id = String::from_str(&env, "cat_1");
    client.mint(&minter, &owner, &token_id);

    // Attempt to transfer the NFT by someone who is not the current owner
    assert!(client.try_transfer_from(&wrong_owner, &owner, &new_owner, &token_id).is_err());

    // Verify that the owner has not changed
    let updated_owner = client.try_owner_of(&token_id).unwrap();
    assert_eq!(updated_owner, Ok(owner));
}