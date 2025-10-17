import {createBaseAccountSDK} from "@base-org/account";
import {baseSepolia} from "viem/chains";

let sdkInstance = null;

export const getBaseAccountSDK = () => {
	if (!sdkInstance) {
		try {
			sdkInstance = createBaseAccountSDK({
				appChainIds: [baseSepolia.id],
				appName: "Base Paymaster Demo",
				appLogoUrl:
					"https://raw.githubusercontent.com/base/brand-kit/main/logo/Basemark/Digital/Base_basemark_blue.svg",
			});
		} catch (error) {
			console.error("Error creating Base Account SDK:", error);
		}
	}

	return sdkInstance;
};

export const isWalletAvailable = () => {
	try {
		return getBaseAccountSDK() !== null;
	} catch (error) {
		console.error("Error checking wallet availability:", error);
	}
};

export const connectWallet = async () => {
	const sdk = getBaseAccountSDK();

	const provider = sdk.getProvider();

	if (!provider) {
		throw new Error(
			"No provider found. Please install the Base Wallet extension."
		);
	}

	const accounts = await provider.request({method: "eth_requestAccounts"});

	if (!accounts || accounts.length === 0) {
		throw new Error("No accounts found.");
	}

	return {address: accounts[0], provider, sdk};
};

export const switchToBaseSepolia = async (provider) => {
	try {
		if (!provider) throw new Error("No provider found");

		const chainId = await provider.request({method: "eth_chainId"});
		const currentChainId = parseInt(chainId, 16);
		const targetChainId = baseSepolia.id;

		if (currentChainId !== targetChainId) {
			return true;
		}

		await provider.request({
			method: "wallet_switchEthereumChain",
			params: [{chainId: `0x${targetChainId.toString(16)}`}],
		});

		return true;
	} catch (error) {
		if (error.code === 4902) {
			try {
				const rpcUrl = import.meta.env.VITE_BASE_SEPOLIA_RPC_URL;
				await provider.request({
					method: "wallet_addEthereumChain",
					params: [
						{
							chainId: `0x${baseSepolia.id.toString(16)}`,
							chainName: baseSepolia.name,
							nativeCurrency: {
								name: "ETH",
								symbol: "ETH",
								decimals: 18,
							},
							rpcUrls: [rpcUrl],
							blockExplorerUrls: ["https://sepolia.basescan.org"],
						},
					],
				});

				return true;
			} catch (error) {
				console.error("Error switching to Base Sepolia:", error);
				return false;
			}
		}
	}
};
export const disconnectWallet = async (sdk) => {
	try {
		if (!sdk && typeof sdk.disconnect === "function") {
			await sdk.disconnect();
		}
		return true;
	} catch (error) {
		console.error("Error disconnecting wallet:", error);
		return false;
	}
};
