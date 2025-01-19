const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");
const {
	createLenderSignature,
	createBorrowerSignature,
} = require("./lendSignature");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

describe("PolftLend", () => {
	let owner;
	let addr1;
	let feeRecipient;
	let addrs;
	let n721Mock;
	let lendContract;
	let whitelistContract;
	let currencyContract;
	let daiMock;
	let usdtMock;

	before(async () => {
		let tx;
		[owner, addr1, feeRecipient, ...addrs] = await ethers.getSigners();

		// DEPLOYMENTS
		let whitelistFactory = await ethers.getContractFactory("Whitelist");
		whitelistContract = await upgrades.deployProxy(whitelistFactory, [], [], {
			kind: "uups",
		});
		let lendFactory = await ethers.getContractFactory("PolftLend");
		lendContract = await upgrades.deployProxy(
			lendFactory,
			[whitelistContract.address],
			{
				kind: "uups",
			}
		);
		let currencyFactory = await ethers.getContractFactory("Currency");
		currencyContract = await upgrades.deployProxy(
			currencyFactory,
			[whitelistContract.address],
			{
				kind: "uups",
			}
		);
		let daiFMock = await ethers.getContractFactory("Dai");
		daiMock = await daiFMock.deploy();
		let usdtFMock = await ethers.getContractFactory("Usdt");
		usdtMock = await usdtFMock.deploy();
		let n721FMock = await ethers.getContractFactory(
			"ERC721Mock"
		);
		n721Mock = await n721FMock.deploy();

		// MINT BASE NFTS FOR TESTING
		for (let i = 0; i < 10; i++) {
			tx = await n721Mock.safeMint(owner.address, `ipfs://${i}`);
			await tx.wait();
		}
		for (let i = 0; i < 5; i++) {
			tx = await n721Mock.safeMint(addr1.address, `ipfs://${i}`);
			await tx.wait();
		}
		for (let i = 0; i < 5; i++) {
			tx = await n721Mock.safeMint(feeRecipient.address, `ipfs://${i}`);
			await tx.wait();
		}

		// MINT ERC20 FOR TESTING
		tx = await daiMock.connect(addr1).mint(1000000);
		await tx.wait();

		// SETTING CURRENCY CONTRACT
		tx = await currencyContract.addCurrency(daiMock.address, "Using Dai ERC20");
		await tx.wait();

		tx = await currencyContract.addCurrency(
			ethers.constants.AddressZero,
			"Using Wrapped Ether"
		);

		// SETTING LEND CONTRACT
		tx = await lendContract.setCurrencyAddress(currencyContract.address);
		await tx.wait();

		// VALIDATE CURRENCY ADDRESS
		expect(await lendContract.currencyAddress()).to.be.eq(
			currencyContract.address
		);
	});

	describe("CreateSignature()", () => {
		it("Test create borrow signature", async () => {
			const signature = await createBorrowerSignature(owner, {
				nftCollateralContract: [n721Mock.address, n721Mock.address],
				nftCollateralId: [0, 1],
				borrower: owner.address,
				nonce: 1,
				chainId: 31337,
			});
			expect(signature).to.be.string;
		});

		it("Test create lender signature", async () => {
			const signature = await createLenderSignature(owner, {
				principalPaymentAmount: 1000,
				maximumPaymentAmount: 1500,
				duration: 86400,
				maxDuration: 100000,
				interestRateOnBasisPoints: 5000,
				interestIsProRated: false,
				nftCollateralContract: [n721Mock.address, n721Mock.address],
				nftCollateralId: [2, 3],
				erc20CollateralContract: daiMock.address,
				lender: owner.address,
				nonce: 2,
				chainId: 31337,
			});
			expect(signature).to.be.string;
		});
	});

	describe("SetFeeRecipient()", () => {
		before(async () => {
			const tx = await lendContract.setFeeRecipient(feeRecipient.address);
			await tx.wait();
		});
		it("Check whether feeRecipient is setted value", async () => {
			expect(await lendContract.feeRecipient()).to.be.eq(feeRecipient.address);
		});
	});

	describe("StartLoan()", () => {
		describe("Success()", () => {
			describe("Start loan without interestIsProRated", () => {
				let borrowerSignature;
				let lenderSignature;
				let tx;
				before(async () => {
					const borrowerData = {
						nftCollateralContract: [n721Mock.address, n721Mock.address],
						nftCollateralId: [0, 1],
						borrower: owner.address,
						nonce: 1,
						chainId: 31337,
					};
					const lenderData = {
						principalPaymentAmount: 1000,
						maximumPaymentAmount: 1500,
						duration: 86400,
						maxDuration: 100000,
						interestRateOnBasisPoints: 5000,
						interestIsProRated: false,
						nftCollateralContract: [n721Mock.address, n721Mock.address],
						nftCollateralId: [0, 1],
						erc20CollateralContract: daiMock.address,
						lender: addr1.address,
						nonce: 2,
						chainId: 31337,
					};

					borrowerSignature = await createBorrowerSignature(
						owner,
						borrowerData
					);
					lenderSignature = await createLenderSignature(addr1, lenderData);
					const { nonce, chainId, ...data } = {
						...borrowerData,
						...lenderData,
						borrowerSignature,
						lenderSignature,
					};
					// Aprove NFT
					tx = await n721Mock.setApprovalForAll(lendContract.address, true);
					await tx.wait();
					// Approve ERC20
					tx = await daiMock.approve(lendContract.address, 1000);
					await tx.wait();
					console.log("===============", await lendContract.connect(owner).getChainID());
					// EXECUTE
					tx = await lendContract.connect(owner).startLoan({
						...data,
						nonces: [1, 2],
					});
					await tx.wait();
				});

				// TEST CASES
				it("Validate whether token is transfer to Contract", async () => {
					expect(await n721Mock.ownerOf(0)).to.be.eq(lendContract.address);
					expect(await n721Mock.ownerOf(1)).to.be.eq(lendContract.address);
				});

				it("Validate interestInProRate field is false", async () => {
					const data = await lendContract.loanInformations(0);
					expect(data[9]).to.be.eq(false);
				});
				it("Validate borrower field", async () => {
					const data = await lendContract.loanInformations(0);
					expect(data[1]).to.be.eq(owner.address);
				});
				it("Validate lender field", async () => {
					const data = await lendContract.loanInformations(0);
					expect(data[2]).to.be.eq(addr1.address);
				});
				it("Validate erc20CollateralContract field", async () => {
					const data = await lendContract.loanInformations(0);
					expect(data[0]).to.be.eq(daiMock.address);
				});
				// xit("Validate length of assembly", async () => {
				// 	const data = await lendContract._getNFTContractCollateralLength(0);
				// 	expect(parseInt(data)).to.be.eq(2);
				// });
			});

			describe("Start loan with interestIsProRated", () => {
				let borrowerSignature;
				let lenderSignature;
				let tx;
				before(async () => {
					const borrowerData = {
						nftCollateralContract: [n721Mock.address, n721Mock.address],
						nftCollateralId: [2, 3],
						borrower: owner.address,
						nonce: 9999,
						chainId: 31337,
					};
					const lenderData = {
						principalPaymentAmount: 1000,
						maximumPaymentAmount: 1500,
						duration: 86400,
						maxDuration: 100000,
						interestRateOnBasisPoints: 5000,
						interestIsProRated: true,
						nftCollateralContract: [n721Mock.address, n721Mock.address],
						nftCollateralId: [2, 3],
						erc20CollateralContract: daiMock.address,
						lender: addr1.address,
						nonce: 9999,
						chainId: 31337,
					};

					borrowerSignature = await createBorrowerSignature(
						owner,
						borrowerData
					);
					lenderSignature = await createLenderSignature(addr1, lenderData);
					const { nonce, chainId, ...data } = {
						...borrowerData,
						...lenderData,
						borrowerSignature,
						lenderSignature,
					};
					// Aprove NFT
					tx = await n721Mock.setApprovalForAll(lendContract.address, true);
					await tx.wait();
					// Approve ERC20
					tx = await daiMock.approve(lendContract.address, 1000);
					await tx.wait();

					// EXECUTE
					tx = await lendContract.connect(owner).startLoan({
						...data,
						nonces: [9999, 9999],
					});
					await tx.wait();
				});

				// TEST CASES
				it("Validate whether token is transfer to Contract", async () => {
					expect(await n721Mock.ownerOf(2)).to.be.eq(lendContract.address);
					expect(await n721Mock.ownerOf(3)).to.be.eq(lendContract.address);
				});
				it("Validate interestInProRate field is true", async () => {
					const data = await lendContract.loanInformations(1);
					expect(data[9]).to.be.eq(true);
				});
				it("Validate borrower field", async () => {
					const data = await lendContract.loanInformations(1);
					expect(data[1]).to.be.eq(owner.address);
				});
				it("Validate lender field", async () => {
					const data = await lendContract.loanInformations(1);
					expect(data[2]).to.be.eq(addr1.address);
				});
				it("Validate erc20CollateralContract field", async () => {
					const data = await lendContract.loanInformations(1);
					expect(data[0]).to.be.eq(daiMock.address);
				});
			});
		});
		describe("Fail()", () => {
			let borrowerData;
			let lenderData;
			before(async () => {
				borrowerData = {
					nftCollateralContract: [n721Mock.address, n721Mock.address],
					nftCollateralId: [4, 5],
					borrower: owner.address,
					nonce: 3,
					chainId: 31337,
				};
				lenderData = {
					principalPaymentAmount: 1000,
					maximumPaymentAmount: 1500,
					duration: 86400,
					maxDuration: 100000,
					interestRateOnBasisPoints: 5000,
					interestIsProRated: false,
					nftCollateralContract: [n721Mock.address, n721Mock.address],
					nftCollateralId: [4, 5],
					erc20CollateralContract: daiMock.address,
					lender: addr1.address,
					nonce: 4,
					chainId: 31337,
				};
			});

			it("Fail because collide nonce in borrower", async () => {
				const borrowerSignature = await createBorrowerSignature(owner, {
					...borrowerData,
					nonce: 1,
				});
				const lenderSignature = await createLenderSignature(addr1, {
					...lenderData,
					nonce: 2,
				});
				const { nonce, chainId, ...data } = {
					...{
						...borrowerData,
						nonce: 1,
					},
					...{
						...lenderData,
						nonce: 2,
					},
					borrowerSignature,
					lenderSignature,
				};

				await expect(
					lendContract.startLoan({
						...data,
						nonces: [1, 2],
					})
				).to.be.revertedWith("PolftLend: Invalid nonce in borrower!");
			});

			it("Fail because collide nonce in lender", async () => {
				const borrowerSignature = await createBorrowerSignature(owner, {
					...borrowerData,
					nonce: 3,
				});
				const lenderSignature = await createLenderSignature(addr1, {
					...lenderData,
					nonce: 2,
				});
				const { nonce, chainId, ...data } = {
					...{
						...borrowerData,
						nonce: 3,
					},
					...{
						...lenderData,
						nonce: 2,
					},
					borrowerSignature,
					lenderSignature,
				};

				await expect(
					lendContract.connect(owner).startLoan({
						...data,
						nonces: [3, 2],
					})
				).to.be.revertedWith("PolftLend: Invalid nonce in lender!");
			});

			it("Fail because caller is not borrower", async () => {
				const borrowerSignature = await createBorrowerSignature(owner, {
					...borrowerData,
					nonce: 3,
				});
				const lenderSignature = await createLenderSignature(addr1, {
					...lenderData,
					nonce: 4,
				});
				const { nonce, chainId, ...data } = {
					...{ ...borrowerData, nonce: 3 },
					...{
						...lenderData,
						nonce: 4,
					},
					borrowerSignature,
					lenderSignature,
				};

				await expect(
					lendContract.connect(addr1).startLoan({
						...data,
						nonces: [3, 4],
					})
				).to.be.revertedWith("PolftLend: caller is not borrower!");
			});

			it("Fail because transfer nft is not your owned", async () => {
				const borrowerSignature = await createBorrowerSignature(owner, {
					...borrowerData,
					nftCollateralId: [11, 12],
				});
				const lenderSignature = await createLenderSignature(addr1, {
					...lenderData,
					nftCollateralId: [11, 12],
				});

				const { nonce, chainId, ...data } = {
					...{
						...borrowerData,
						nftCollateralId: [11, 12],
					},
					...{
						...lenderData,
						nftCollateralId: [11, 12],
					},
					borrowerSignature,
					lenderSignature,
				};

				await expect(
					lendContract.connect(owner).startLoan({
						...data,
						nonces: [3, 4],
					})
				).to.be.revertedWith("ERC721: caller is not token owner nor approved");
			});

			it("Fail because max duration is smaller than duration", async () => {
				const borrowerSignature = await createBorrowerSignature(
					owner,
					borrowerData
				);
				const lenderSignature = await createLenderSignature(addr1, lenderData);
				const { nonce, chainId, ...data } = {
					...borrowerData,
					...{ ...lenderData, maxDuration: 5000 },
					borrowerSignature,
					lenderSignature,
				};
				await expect(
					lendContract.connect(owner).startLoan({
						...data,
						nonces: [3, 4],
					})
				).to.be.revertedWith(
					"PolftLend: Max duration has to be greater than duration!"
				);
			});

			it("Fail because duration is zero", async () => {
				const borrowerSignature = await createBorrowerSignature(
					owner,
					borrowerData
				);
				const lenderSignature = await createLenderSignature(addr1, lenderData);
				const { nonce, chainId, ...data } = {
					...borrowerData,
					...{ ...lenderData, duration: 0 },
					borrowerSignature,
					lenderSignature,
				};
				await expect(
					lendContract.connect(owner).startLoan({
						...data,
						nonces: [3, 4],
					})
				).to.be.revertedWith("PolftLend: Duration can not be zero!");
			});

			it("Fail because length of nftContrat is different to length of nftId", async () => {
				const borrowerSignature = await createBorrowerSignature(
					owner,
					borrowerData
				);
				const lenderSignature = await createLenderSignature(addr1, lenderData);
				const { nonce, chainId, ...data } = {
					...borrowerData,
					...{ ...lenderData, nftCollateralContract: [n721Mock.address] },
					borrowerSignature,
					lenderSignature,
				};
				await expect(
					lendContract.connect(owner).startLoan({
						...data,
						nonces: [3, 4],
					})
				).to.be.revertedWith(
					"PolftLend: nftCollateralContract length is equal to nftCollateralId!"
				);
			});

			it("Fail because not valid currency", async () => {
				const borrowerSignature = await createBorrowerSignature(
					owner,
					borrowerData
				);
				const lenderSignature = await createLenderSignature(addr1, lenderData);
				const { nonce, chainId, ...data } = {
					...borrowerData,
					...{ ...lenderData, erc20CollateralContract: usdtMock.address },
					borrowerSignature,
					lenderSignature,
				};
				await expect(
					lendContract.connect(owner).startLoan({
						...data,
						nonces: [3, 4],
					})
				).to.be.revertedWith("PolftLend: not valid currency");
			});

			it("Fail because invalid borrower signature", async () => {
				const borrowerSignature = await createBorrowerSignature(owner, {
					...borrowerData,
					nonce: 9998,
				});
				const lenderSignature = await createLenderSignature(addr1, lenderData);
				const { nonce, chainId, ...data } = {
					...borrowerData,
					...lenderData,
					borrowerSignature,
					lenderSignature,
				};
				await expect(
					lendContract.connect(owner).startLoan({
						...data,
						nonces: [3, 4],
					})
				).to.be.revertedWith("PolftLend: Borrower signature is invalid");
			});

			it("Fail because invalid borrower signature", async () => {
				const borrowerSignature = await createBorrowerSignature(owner, {
					...borrowerData,
				});
				const lenderSignature = await createLenderSignature(addr1, {
					...lenderData,
					nonce: 5,
				});
				const { nonce, chainId, ...data } = {
					...borrowerData,
					...lenderData,
					borrowerSignature,
					lenderSignature,
				};
				await expect(
					lendContract.connect(owner).startLoan({
						...data,
						nonces: [3, 4],
					})
				).to.be.revertedWith("PolftLend: Lender signature is invalid");
			});
		});
	});

	describe("RepaidLoan()", () => {
		// We will use loanId with index of 0, which was created in StartLoan() testcase
		// For more detail go to line 130-200
		describe("Success", () => {
			describe("Repaid the loan that don't have interestInProRate", () => {
				let tx;
				let beforeBalanceBorrower;
				let beforeBalanceLender;
				before(async () => {
					beforeBalanceBorrower = await daiMock.balanceOf(owner.address);
					beforeBalanceLender = await daiMock.balanceOf(addr1.address);
					tx = await daiMock.approve(lendContract.address, 1500);
					await tx.wait();
					tx = await lendContract.repaidLoan(0);
					await tx.wait();
				});
				it("Check loanRepaidOrLiquidated is true", async () => {
					tx = await lendContract.loanRepaidOrLiquidated(0);
					expect(tx).to.be.eq(true);
				});
				it("Check whether borrower have return 1500 tokens to lender", async () => {
					const afterBalanceBorrower = await daiMock.balanceOf(owner.address);

					expect(
						ethers.BigNumber.from(beforeBalanceBorrower).sub(
							afterBalanceBorrower
						)
					).to.be.eq(1500);
				});
				it("Check whether lender only receive the amount of 1500 minus fee", async () => {
					const afterBalanceLender = await daiMock.balanceOf(addr1.address);
					const feeBps = await lendContract.feeBps();
					const moneyPaidFee = 1500 - parseInt((1500 * 50) / 10000);

					expect(feeBps).to.be.eq(50);
					expect(
						ethers.BigNumber.from(afterBalanceLender).sub(beforeBalanceLender)
					).to.be.eq(moneyPaidFee);
				});
				it("Check whether nft is transfered to borrower", async () => {
					expect(await n721Mock.ownerOf(0)).to.be.eq(owner.address);
					expect(await n721Mock.ownerOf(1)).to.be.eq(owner.address);
				});
			});

			describe("Repaid the loan that have interestInProRate", () => {
				async function createDummyLoan() {
					const borrowerData = {
						nftCollateralContract: [n721Mock.address, n721Mock.address],
						nftCollateralId: [4, 5],
						borrower: owner.address,
						nonce: 9998,
						chainId: 31337,
					};
					const lenderData = {
						principalPaymentAmount: 1000,
						maximumPaymentAmount: 1500,
						duration: 86400,
						maxDuration: 100000,
						interestRateOnBasisPoints: 3500,
						interestIsProRated: true,
						nftCollateralContract: [n721Mock.address, n721Mock.address],
						nftCollateralId: [4, 5],
						erc20CollateralContract: daiMock.address,
						lender: addr1.address,
						nonce: 9998,
						chainId: 31337,
					};

					borrowerSignature = await createBorrowerSignature(
						owner,
						borrowerData
					);
					lenderSignature = await createLenderSignature(addr1, lenderData);
					const { nonce, chainId, ...data } = {
						...borrowerData,
						...lenderData,
						borrowerSignature,
						lenderSignature,
					};
					// Aprove NFT
					tx = await n721Mock.setApprovalForAll(lendContract.address, true);
					await tx.wait();
					// Approve ERC20
					tx = await daiMock.approve(lendContract.address, 1000);
					await tx.wait();

					// EXECUTE
					tx = await lendContract.connect(owner).startLoan({
						...data,
						nonces: [9998, 9998],
					});
					await tx.wait();

					return data;
				}

				async function calculateTimeFromNow(startTime) {
					const time = (await ethers.provider.getBlock("latest")).timestamp;
					return time - startTime;
				}

				async function calculateLoan({
					principlePaymentAmount,
					maximumPaymentAmount,
					startTime,
					duration,
					interestRateOnBasisPoints,
					interestIsProRated,
				}) {
					const time = await calculateTimeFromNow(startTime);
					let adminFee;
					let payoffAmount;
					if (interestIsProRated) {
						let interestAfterEntireDuration =
							(principlePaymentAmount * interestRateOnBasisPoints) / 10000;
						payoffAmount =
							principlePaymentAmount +
							(interestAfterEntireDuration * time) / duration;
						if (payoffAmount > maximumPaymentAmount) {
							adminFee = maximumPaymentAmount - payoffAmount;
						} else {
							adminFee = (payoffAmount * 50) / 10000;
						}
					} else {
						adminFee = (maximumPaymentAmount * 50) / 10000;
					}
					payoffAmount = maximumPaymentAmount - parseInt(adminFee);

					return [payoffAmount, parseInt(adminFee)];
				}

				let tx;
				let beforeBalanceBorrower;
				let beforeBalanceLender;
				let loanData;
				let startLoanTime;
				before(async () => {
					// Start Loan a dummy value
					loanData = await createDummyLoan();

					// Get Loan data
					const data = await lendContract.loanInformations(2);
					startLoanTime = parseInt(data[3]);

					// Repaid Loan
					beforeBalanceBorrower = await daiMock.balanceOf(owner.address);
					beforeBalanceLender = await daiMock.balanceOf(addr1.address);
					// tx = await daiMock.approve(lendContract.address, 1500);
					// await tx.wait();
					// tx = await lendContract.repaidLoan(2);
					// await tx.wait();
				});

				it("Check if we increase 5 blocks that mean current time is greater than 5 seconds", async () => {
					await mine(5);
					const time = (await ethers.provider.getBlock("latest")).timestamp;
					expect(time - parseInt(startLoanTime)).to.be.eq(5);
				});

				// Because mine function will increase up in each testcase instead of reset
				// So you have to plus num_of_blocks that you mined before it
				it("Increase to 1000 blocks and do payment", async () => {
					await mine(595); // 600 - 5 (previous test case)
					const [paymentAmount, adminFee] = await calculateLoan({
						principlePaymentAmount: parseInt(loanData.principalPaymentAmount),
						maximumPaymentAmount: parseInt(loanData.maximumPaymentAmount),
						startTime: parseInt(startLoanTime),
						duration: parseInt(loanData.duration),
						interestRateOnBasisPoints: parseInt(
							loanData.interestRateOnBasisPoints
						),
						interestIsProRated: loanData.interestIsProRated,
					});

					tx = await daiMock.approve(lendContract.address, 1500);
					tx = await lendContract.repaidLoan(2);
					await tx.wait();

					const afterBalanceBorrower = await daiMock.balanceOf(owner.address);
					const afterBalanceLender = await daiMock.balanceOf(addr1.address);

					expect(await lendContract.loanRepaidOrLiquidated(2)).to.be.eq(true);
					expect(
						ethers.BigNumber.from(afterBalanceLender).sub(beforeBalanceLender)
					).to.be.eq(ethers.BigNumber.from(paymentAmount));
					expect(
						ethers.BigNumber.from(beforeBalanceBorrower).sub(
							afterBalanceBorrower
						)
					).to.be.eq(ethers.BigNumber.from(paymentAmount + adminFee));
				});
				it("Check whether nft is transfered to borrower", async () => {
					expect(await n721Mock.ownerOf(4)).to.be.eq(owner.address);
					expect(await n721Mock.ownerOf(5)).to.be.eq(owner.address);
				});
			});
		});

		describe("Fail", () => {
			it("Try to recall repaidLoan", async () => {
				await expect(lendContract.repaidLoan(2)).to.be.revertedWith(
					"PolftLend: Loan has been liquidated or repaid!"
				);
			});

			it("Caller is not loan borrower", async () => {
				await expect(
					lendContract.connect(addr1).repaidLoan(2)
				).to.be.revertedWith("PolftLend: Loan has been liquidated or repaid!");
			});
		});
	});

	describe("SetFeeBps()", () => {
		it("Success", async () => {
			const tx = await lendContract.setFeeBps(10);
			await tx.wait();
			expect(await lendContract.feeBps()).to.be.eq(10);
		});
	});

	describe("LiquidateLoan()", () => {
		describe("Fail", () => {
			it("Can not liquidate loan again", async () => {
				await expect(
					lendContract.connect(owner).liquidateLoan(2)
				).to.be.revertedWith("PolftLend: Loan has been liquidated or repaid!");
			});

			it("Can not liquidate loan if you are not borrower", async () => {
				await expect(
					lendContract.connect(owner).liquidateLoan(1)
				).to.be.revertedWith("PolftLend: You are not borrower!");
			});

			it("Can not liquidate loan if current time is not greater than maxDuration", async () => {
				await expect(
					lendContract.connect(addr1).liquidateLoan(1)
				).to.be.revertedWith(
					"PolftLend: It is not time for you to liquidate the loan!"
				);
			});
		});

		describe("Success", () => {
			let tx;
			before(async () => {
				await mine(100000);

				tx = await lendContract.connect(addr1).liquidateLoan(1);
				await tx.wait();
			});

			it("Check loanRepaidOrLiquidated == true", async () => {
				const data = await lendContract.loanRepaidOrLiquidated(1);
				expect(data).to.be.eq(true);
			});

			it("Check nft is transferred to lender", async () => {
				expect(await n721Mock.ownerOf(2)).to.be.eq(addr1.address);
				expect(await n721Mock.ownerOf(3)).to.be.eq(addr1.address);
			});
		});
	});
});
