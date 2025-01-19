-include .env

.PHONY: all test clean deploy fund help install snapshot format anvil 


all:  remove install build

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install foundry-rs/forge-std --no-commit && forge install openzeppelin/openzeppelin-contracts --no-commit && forge install https://github.com/vectorized/solady --no-commit && forge install https://github.com/transmissions11/solmate --no-commit && forge install https://github.com/wighawag/clones-with-immutable-args --no-commit && forge install https://github.com/a16z/erc4626-tests --no-commit && forge install https://github.com/EnsoFinance/enso-weiroll --no-commit


	
# Update Dependencies
update:; forge update

build:; forge build

test :; forge test 

snapshot :; forge snapshot

format :; forge fmt

anvil :; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

coverage :; forge coverage 
