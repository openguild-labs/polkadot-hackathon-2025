# Test logs

```bash
❯ forge test -vvvv
[⠊] Compiling...
No files changed, compilation skipped

Ran 7 tests for test/ZekaeVault.t.sol:ZekaeVaultTest
[PASS] test_LiquidateWhenUserCollateralRatioIsLessThanMinCollateralRatio() (gas: 217568)
Traces:
  [277226] ZekaeVaultTest::test_LiquidateWhenUserCollateralRatioIsLessThanMinCollateralRatio()
    ├─ [0] VM::startPrank(ECRecover: [0x0000000000000000000000000000000000000001])
    │   └─ ← [Return]
    ├─ [48831] LSToken::mint(ECRecover: [0x0000000000000000000000000000000000000001], 1000000000000000000000000 [1e24])
    │   ├─ emit Transfer(from: 0x0000000000000000000000000000000000000000, to: ECRecover: [0x0000000000000000000000000000000000000001], amount: 1000000000000000000000000 [1e24])
    │   └─ ← [Stop]
    ├─ [24543] LSToken::approve(ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], 1000000000000000000000 [1e21])
    │   ├─ emit Approval(owner: ECRecover: [0x0000000000000000000000000000000000000001], spender: ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], amount: 1000000000000000000000 [1e21])
    │   └─ ← [Return] true
    ├─ [50691] ZekaeVault::deposit(10000000000000000000 [1e19])
    │   ├─ [25608] LSToken::transferFrom(ECRecover: [0x0000000000000000000000000000000000000001], ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], 10000000000000000000 [1e19])
    │   │   ├─ emit Transfer(from: ECRecover: [0x0000000000000000000000000000000000000001], to: ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], amount: 10000000000000000000 [1e19])
    │   │   └─ ← [Return] true
    │   └─ ← [Stop]
    ├─ [471] ZekaeVault::addressToDeposit(ECRecover: [0x0000000000000000000000000000000000000001]) [staticcall]
    │   └─ ← [Return] 10000000000000000000 [1e19]
    ├─ [76604] ZekaeVault::mint(50000000000000000000 [5e19])
    │   ├─ [48809] zUSD::mint(ECRecover: [0x0000000000000000000000000000000000000001], 50000000000000000000 [5e19])
    │   │   ├─ emit Transfer(from: 0x0000000000000000000000000000000000000000, to: ECRecover: [0x0000000000000000000000000000000000000001], amount: 50000000000000000000 [5e19])
    │   │   └─ ← [Stop]
    │   └─ ← [Stop]
    ├─ [537] ZekaeVault::addressToMinted(ECRecover: [0x0000000000000000000000000000000000000001]) [staticcall]
    │   └─ ← [Return] 50000000000000000000 [5e19]
    ├─ [7340] SimpleMockOracle::setUnderlyingAssetPrice(5000000000000000000 [5e18])
    │   └─ ← [Stop]
    ├─ [0] VM::stopPrank()
    │   └─ ← [Return]
    ├─ [0] VM::startPrank(SHA-256: [0x0000000000000000000000000000000000000002])
    │   └─ ← [Return]
    ├─ [39082] ZekaeVault::liquidate(ECRecover: [0x0000000000000000000000000000000000000001])
    │   ├─ [2601] SimpleMockOracle::latestAnswer() [staticcall]
    │   │   └─ ← [Return] 7216535000000000000 [7.216e18]
    │   ├─ [601] SimpleMockOracle::latestAnswer() [staticcall]
    │   │   └─ ← [Return] 7216535000000000000 [7.216e18]
    │   ├─ [3075] zUSD::burn(ECRecover: [0x0000000000000000000000000000000000000001], 50000000000000000000 [5e19])
    │   │   ├─ emit Transfer(from: ECRecover: [0x0000000000000000000000000000000000000001], to: 0x0000000000000000000000000000000000000000, amount: 50000000000000000000 [5e19])
    │   │   └─ ← [Stop]
    │   ├─ [24880] LSToken::transfer(SHA-256: [0x0000000000000000000000000000000000000002], 6928532876234924378 [6.928e18])
    │   │   ├─ emit Transfer(from: ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], to: SHA-256: [0x0000000000000000000000000000000000000002], amount: 6928532876234924378 [6.928e18])
    │   │   └─ ← [Return] true
    │   └─ ← [Stop]
    ├─ [601] SimpleMockOracle::latestAnswer() [staticcall]
    │   └─ ← [Return] 7216535000000000000 [7.216e18]
    ├─ [0] VM::stopPrank()
    │   └─ ← [Return]
    ├─ [605] zUSD::balanceOf(ECRecover: [0x0000000000000000000000000000000000000001]) [staticcall]
    │   └─ ← [Return] 0
    ├─ [0] VM::assertEq(0, 0) [staticcall]
    │   └─ ← [Return]
    ├─ [539] LSToken::balanceOf(SHA-256: [0x0000000000000000000000000000000000000002]) [staticcall]
    │   └─ ← [Return] 6928532876234924378 [6.928e18]
    ├─ [0] VM::assertEq(6928532876234924378 [6.928e18], 6928532876234924378 [6.928e18]) [staticcall]
    │   └─ ← [Return]
    ├─ [471] ZekaeVault::addressToDeposit(ECRecover: [0x0000000000000000000000000000000000000001]) [staticcall]
    │   └─ ← [Return] 3071467123765075622 [3.071e18]
    ├─ [0] VM::assertEq(3071467123765075622 [3.071e18], 3071467123765075622 [3.071e18]) [staticcall]
    │   └─ ← [Return]
    └─ ← [Stop]

[PASS] test_OracleOwner() (gas: 10607)
Traces:
  [10607] ZekaeVaultTest::test_OracleOwner()
    ├─ [2402] SimpleMockOracle::owner() [staticcall]
    │   └─ ← [Return] ECRecover: [0x0000000000000000000000000000000000000001]
    ├─ [0] VM::assertEq(ECRecover: [0x0000000000000000000000000000000000000001], ECRecover: [0x0000000000000000000000000000000000000001]) [staticcall]
    │   └─ ← [Return]
    └─ ← [Stop]

[PASS] test_RevertIf_LiquidateWhenUserCollateralRatioIsMoreThanMinCollateralRatio() (gas: 207447)
Traces:
  [227347] ZekaeVaultTest::test_RevertIf_LiquidateWhenUserCollateralRatioIsMoreThanMinCollateralRatio()
    ├─ [0] VM::startPrank(ECRecover: [0x0000000000000000000000000000000000000001])
    │   └─ ← [Return]
    ├─ [48831] LSToken::mint(ECRecover: [0x0000000000000000000000000000000000000001], 1000000000000000000000000 [1e24])
    │   ├─ emit Transfer(from: 0x0000000000000000000000000000000000000000, to: ECRecover: [0x0000000000000000000000000000000000000001], amount: 1000000000000000000000000 [1e24])
    │   └─ ← [Stop]
    ├─ [24543] LSToken::approve(ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], 1000000000000000000000 [1e21])
    │   ├─ emit Approval(owner: ECRecover: [0x0000000000000000000000000000000000000001], spender: ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], amount: 1000000000000000000000 [1e21])
    │   └─ ← [Return] true
    ├─ [50691] ZekaeVault::deposit(1000000000000000000000 [1e21])
    │   ├─ [25608] LSToken::transferFrom(ECRecover: [0x0000000000000000000000000000000000000001], ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], 1000000000000000000000 [1e21])
    │   │   ├─ emit Transfer(from: ECRecover: [0x0000000000000000000000000000000000000001], to: ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], amount: 1000000000000000000000 [1e21])
    │   │   └─ ← [Return] true
    │   └─ ← [Stop]
    ├─ [76604] ZekaeVault::mint(100000000000000000000 [1e20])
    │   ├─ [48809] zUSD::mint(ECRecover: [0x0000000000000000000000000000000000000001], 100000000000000000000 [1e20])
    │   │   ├─ emit Transfer(from: 0x0000000000000000000000000000000000000000, to: ECRecover: [0x0000000000000000000000000000000000000001], amount: 100000000000000000000 [1e20])
    │   │   └─ ← [Stop]
    │   └─ ← [Stop]
    ├─ [0] VM::stopPrank()
    │   └─ ← [Return]
    ├─ [0] VM::startPrank(SHA-256: [0x0000000000000000000000000000000000000002])
    │   └─ ← [Return]
    ├─ [0] VM::expectRevert(custom error 0xf4844814)
    │   └─ ← [Return]
    ├─ [10544] ZekaeVault::liquidate(ECRecover: [0x0000000000000000000000000000000000000001])
    │   ├─ [4601] SimpleMockOracle::latestAnswer() [staticcall]
    │   │   └─ ← [Return] 14433070000000000000 [1.443e19]
    │   └─ ← [Revert] CollateralRatioIsGreaterOrEqualToMaximumCollateralRatio()
    ├─ [0] VM::stopPrank()
    │   └─ ← [Return]
    └─ ← [Stop]

[PASS] test_ZekaeVaultDepositAndMint() (gas: 200143)
Traces:
  [220043] ZekaeVaultTest::test_ZekaeVaultDepositAndMint()
    ├─ [0] VM::startPrank(ECRecover: [0x0000000000000000000000000000000000000001])
    │   └─ ← [Return]
    ├─ [48831] LSToken::mint(ECRecover: [0x0000000000000000000000000000000000000001], 1000000000000000000000000 [1e24])
    │   ├─ emit Transfer(from: 0x0000000000000000000000000000000000000000, to: ECRecover: [0x0000000000000000000000000000000000000001], amount: 1000000000000000000000000 [1e24])
    │   └─ ← [Stop]
    ├─ [24543] LSToken::approve(ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], 1000000000000000000000 [1e21])
    │   ├─ emit Approval(owner: ECRecover: [0x0000000000000000000000000000000000000001], spender: ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], amount: 1000000000000000000000 [1e21])
    │   └─ ← [Return] true
    ├─ [50691] ZekaeVault::deposit(1000000000000000000000 [1e21])
    │   ├─ [25608] LSToken::transferFrom(ECRecover: [0x0000000000000000000000000000000000000001], ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], 1000000000000000000000 [1e21])
    │   │   ├─ emit Transfer(from: ECRecover: [0x0000000000000000000000000000000000000001], to: ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], amount: 1000000000000000000000 [1e21])
    │   │   └─ ← [Return] true
    │   └─ ← [Stop]
    ├─ [76604] ZekaeVault::mint(100000000000000000000 [1e20])
    │   ├─ [48809] zUSD::mint(ECRecover: [0x0000000000000000000000000000000000000001], 100000000000000000000 [1e20])
    │   │   ├─ emit Transfer(from: 0x0000000000000000000000000000000000000000, to: ECRecover: [0x0000000000000000000000000000000000000001], amount: 100000000000000000000 [1e20])
    │   │   └─ ← [Stop]
    │   └─ ← [Stop]
    ├─ [0] VM::stopPrank()
    │   └─ ← [Return]
    ├─ [539] LSToken::balanceOf(ECRecover: [0x0000000000000000000000000000000000000001]) [staticcall]
    │   └─ ← [Return] 999000000000000000000000 [9.99e23]
    ├─ [0] VM::assertEq(999000000000000000000000 [9.99e23], 999000000000000000000000 [9.99e23]) [staticcall]
    │   └─ ← [Return]
    ├─ [605] zUSD::balanceOf(ECRecover: [0x0000000000000000000000000000000000000001]) [staticcall]
    │   └─ ← [Return] 100000000000000000000 [1e20]
    ├─ [0] VM::assertEq(100000000000000000000 [1e20], 100000000000000000000 [1e20]) [staticcall]
    │   └─ ← [Return]
    └─ ← [Stop]

[PASS] test_ZekaeVaultDepositMintAndBurn() (gas: 176800)
Traces:
  [226265] ZekaeVaultTest::test_ZekaeVaultDepositMintAndBurn()
    ├─ [0] VM::startPrank(ECRecover: [0x0000000000000000000000000000000000000001])
    │   └─ ← [Return]
    ├─ [48831] LSToken::mint(ECRecover: [0x0000000000000000000000000000000000000001], 1000000000000000000000000 [1e24])
    │   ├─ emit Transfer(from: 0x0000000000000000000000000000000000000000, to: ECRecover: [0x0000000000000000000000000000000000000001], amount: 1000000000000000000000000 [1e24])
    │   └─ ← [Stop]
    ├─ [24543] LSToken::approve(ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], 1000000000000000000000 [1e21])
    │   ├─ emit Approval(owner: ECRecover: [0x0000000000000000000000000000000000000001], spender: ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], amount: 1000000000000000000000 [1e21])
    │   └─ ← [Return] true
    ├─ [50691] ZekaeVault::deposit(1000000000000000000000 [1e21])
    │   ├─ [25608] LSToken::transferFrom(ECRecover: [0x0000000000000000000000000000000000000001], ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], 1000000000000000000000 [1e21])
    │   │   ├─ emit Transfer(from: ECRecover: [0x0000000000000000000000000000000000000001], to: ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], amount: 1000000000000000000000 [1e21])
    │   │   └─ ← [Return] true
    │   └─ ← [Stop]
    ├─ [76604] ZekaeVault::mint(100000000000000000000 [1e20])
    │   ├─ [48809] zUSD::mint(ECRecover: [0x0000000000000000000000000000000000000001], 100000000000000000000 [1e20])
    │   │   ├─ emit Transfer(from: 0x0000000000000000000000000000000000000000, to: ECRecover: [0x0000000000000000000000000000000000000001], amount: 100000000000000000000 [1e20])
    │   │   └─ ← [Stop]
    │   └─ ← [Stop]
    ├─ [4271] ZekaeVault::burn(100000000000000000000 [1e20])
    │   ├─ [3075] zUSD::burn(ECRecover: [0x0000000000000000000000000000000000000001], 100000000000000000000 [1e20])
    │   │   ├─ emit Transfer(from: ECRecover: [0x0000000000000000000000000000000000000001], to: 0x0000000000000000000000000000000000000000, amount: 100000000000000000000 [1e20])
    │   │   └─ ← [Stop]
    │   └─ ← [Stop]
    ├─ [0] VM::stopPrank()
    │   └─ ← [Return]
    ├─ [539] LSToken::balanceOf(ECRecover: [0x0000000000000000000000000000000000000001]) [staticcall]
    │   └─ ← [Return] 999000000000000000000000 [9.99e23]
    ├─ [0] VM::assertEq(999000000000000000000000 [9.99e23], 999000000000000000000000 [9.99e23]) [staticcall]
    │   └─ ← [Return]
    ├─ [539] LSToken::balanceOf(ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9]) [staticcall]
    │   └─ ← [Return] 1000000000000000000000 [1e21]
    ├─ [0] VM::assertEq(1000000000000000000000 [1e21], 1000000000000000000000 [1e21]) [staticcall]
    │   └─ ← [Return]
    ├─ [605] zUSD::balanceOf(ECRecover: [0x0000000000000000000000000000000000000001]) [staticcall]
    │   └─ ← [Return] 0
    ├─ [0] VM::assertEq(0, 0) [staticcall]
    │   └─ ← [Return]
    └─ ← [Stop]

[PASS] test_lstokenOwner() (gas: 10613)
Traces:
  [10613] ZekaeVaultTest::test_lstokenOwner()
    ├─ [2403] LSToken::owner() [staticcall]
    │   └─ ← [Return] ECRecover: [0x0000000000000000000000000000000000000001]
    ├─ [0] VM::assertEq(ECRecover: [0x0000000000000000000000000000000000000001], ECRecover: [0x0000000000000000000000000000000000000001]) [staticcall]
    │   └─ ← [Return]
    └─ ← [Stop]

[PASS] test_zUSDOwner() (gas: 12681)
Traces:
  [12681] ZekaeVaultTest::test_zUSDOwner()
    ├─ [2381] zUSD::owner() [staticcall]
    │   └─ ← [Return] ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9]
    ├─ [0] VM::assertEq(ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9], ZekaeVault: [0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9]) [staticcall]
    │   └─ ← [Return]
    └─ ← [Stop]

Suite result: ok. 7 passed; 0 failed; 0 skipped; finished in 6.36ms (6.11ms CPU time)

Ran 1 test suite in 173.60ms (6.36ms CPU time): 7 tests passed, 0 failed, 0 skipped (7 total tests)
```