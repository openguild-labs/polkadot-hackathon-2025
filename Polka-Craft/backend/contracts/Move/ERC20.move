module my_address::basic_coin {
    use std::signer;

    /// Address of the owner of this module
    const MODULE_OWNER: address = @my_address;

    /// Error codes
    const ENOT_MODULE_OWNER: u64 = 0;
    const EINSUFFICIENT_BALANCE: u64 = 1;
    const EALREADY_HAS_BALANCE: u64 = 2;
    const EISSIGNED: u64 = 1;

    struct Coin has store {
        value: u64
    }

    /// Struct representing the balance of each address.
    struct Balance has key {
        coin: Coin
    }

    /// Publish an empty balance resource under `account`'s address. This function must be called before
    /// minting or transferring to the account.
    public fun publish_balance(account: &signer) {
        let empty_coin = Coin { value: 0 };
        assert!(!exists<Balance>(signer::address_of(account)), EALREADY_HAS_BALANCE);
        move_to(account, Balance { coin: empty_coin });
    }

    /// Mint `amount` tokens to `mint_addr`. Mint must be approved by the module owner.
    public fun mint(module_owner: &signer, mint_addr: address, amount: u64) acquires Balance {
        // Only the owner of the module can initialize this module
        assert!(signer::address_of(module_owner) == MODULE_OWNER, ENOT_MODULE_OWNER);

        // Deposit `amount` of tokens to `mint_addr`'s balance
        deposit(mint_addr, Coin { value: amount });
    }

    /// Returns the balance of `owner`.
    public fun balance_of(owner: address): u64 acquires Balance {
        borrow_global<Balance>(owner).coin.value
    }

    /// Transfers `amount` of tokens from `from` to `to`.
    public fun transfer(from: &signer, to: address, amount: u64) acquires Balance {
        let check = withdraw(signer::address_of(from), amount);
        deposit(to, check);
    }

    /// Withdraw `amount` number of tokens from the balance under `addr`.
    fun withdraw(addr: address, amount: u64) : Coin acquires Balance {
        let balance = balance_of(addr);
        // balance must be greater than the withdraw amount
        assert!(balance >= amount, EINSUFFICIENT_BALANCE);
        let balance_ref = &mut borrow_global_mut<Balance>(addr).coin.value;
        *balance_ref = balance - amount;
        Coin { value: amount }
    }

    /// Deposit `amount` number of tokens to the balance under `addr`.
    fun deposit(addr: address, check: Coin) acquires Balance {
        let balance = balance_of(addr);
        let balance_ref = &mut borrow_global_mut<Balance>(addr).coin.value;
        let Coin { value } = check;
        *balance_ref = balance + value;
    }
}
