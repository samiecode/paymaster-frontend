import {baseSepolia} from "viem/chains";
import {createPublicClient, http, numberToHex, encodeFunctionData} from "viem";

const REWARDS_ABI = [
	{inputs: [], stateMutability: "payable", type: "constructor"},
	{
		inputs: [],
		name: "claimReward",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "rewardClaimed",
		outputs: [{internalType: "bool", name: "", type: "bool"}],
		stateMutability: "view",
		type: "function",
	},
];

export const createClient = (rpcUrl) => {
	return createPublicClient({
		chain: baseSepolia,
		transport: http(rpcUrl),
	});
};

export const sendTransaction = async (
	provider,
	fromAddress,
	contractAddress,
	paymasterUrl
) => {
	const data = encodeFunctionData({
		abi: REWARDS_ABI,
		functionName: "claimReward",
	});

	try {
		if (!provider || !provider.request()) {
			throw new Error(
				"No provider available. Please connect to a base account"
			);
		}

		if (!paymasterUrl) {
			throw new Error("No paymaster URL provided");
		}

		const calls = [
			{
				to: contractAddress,
				value: `0x0`,
				data: data,
			},
		];

		const result = await provider.request({
			method: "wallet_sendCalls",
			params: [
				{
					version: "1.0",
					chainId: numberToHex(baseSepolia.id),
					from: fromAddress,
					calls: calls,
					capabilities: {
						paymasterService: {url: paymasterUrl},
					},
				},
			],
		});

		return result;
	} catch (error) {
		console.error("Error sending transaction:", error);
		throw error;
	}
};

export const getCallsStatus = async (provider, batchId) => {
	const status = await provider.request({
		method: "wallet_getCallsStatus",
		params: [batchId],
	});

	return status;
};

export const waitForBatchConfirmation = async (
	provider,
	batchId,
	maxAttempt = 60,
	intervalMs = 2000
) => {
	for (let attempt = 0; attempt < maxAttempt; attempt++) {
		const status = await getCallsStatus(provider, batchId);

		if (status.status == "CONFIRMED") {
			return status;
		}

		if (status.status == "FAILED") {
			throw new Error(`Batch failed: ${status.error}`);
		}

		await new Promise((resolve) => setTimeout(resolve, intervalMs));
	}

	throw new Error("Batch confirmation timeout");
};
