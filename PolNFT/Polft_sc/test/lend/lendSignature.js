const { ethers } = require("hardhat");

async function createBorrowerSignature(
	signer,
	{ nftCollateralContract, nftCollateralId, borrower, nonce, chainId }
) {
	const encode = ethers.utils.solidityPack(
		["address[]", "uint256[]", "address", "uint256", "uint256"],
		[nftCollateralContract, nftCollateralId, borrower, nonce, chainId]
	);
	const hash = ethers.utils.keccak256(encode);
	const result = await signer.signMessage(ethers.utils.arrayify(hash));
	return result;
}

async function createLenderSignature(
	signer,
	{
		principalPaymentAmount,
		maximumPaymentAmount,
		duration,
		maxDuration,
		interestRateOnBasisPoints,
		interestIsProRated,
		nftCollateralContract,
		nftCollateralId,
		erc20CollateralContract,
		lender,
		nonce,
		chainId,
	}
) {
	const encode = ethers.utils.solidityPack(
		[
			"uint256",
			"uint256",
			"uint256",
			"uint256",
			"uint256",
			"bool",
			"address[]",
			"uint256[]",
			"address",
			"address",
			"uint256",
			"uint256",
		],
		[
			principalPaymentAmount,
			maximumPaymentAmount,
			duration,
			maxDuration,
			interestRateOnBasisPoints,
			interestIsProRated,
			nftCollateralContract,
			nftCollateralId,
			erc20CollateralContract,
			lender,
			nonce,
			chainId,
		]
	);
	const hash = ethers.utils.keccak256(encode);
	const result = await signer.signMessage(ethers.utils.arrayify(hash));
	return result;
}

module.exports = {
	createBorrowerSignature,
	createLenderSignature,
};
