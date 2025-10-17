"use client";

import {useState} from "react";
import {
	connectWallet,
	disconnectWallet,
	switchToBaseSepolia,
} from "../utils/wallet-services";
import {checkPaymasterService} from "../utils/walletProvider";
import {
	sendTransaction,
	waitForBatchConfirmation,
} from "../utils/payment-service";
import {Button} from "./ui/button";
import {Card} from "./ui/card";
import {
	Loader2,
	Wallet,
	CheckCircle2,
	XCircle,
	ExternalLink,
} from "lucide-react";

export function ClaimReward() {
	const [provider, setProvider] = useState(null);
	const [sdk, setSdk] = useState(null);
	const [status, setStatus] = useState("idle");
	const [batchId, setBatchId] = useState("");
	const [batchStatus, setBatchStatus] = useState(null);
	const [error, setError] = useState(null);
	const [walletConnected, setWalletConnected] = useState("");
	const [userAddress, setUserAddress] = useState("");

	const contractAddress = import.meta.env.VITE_REWARDS_CONTRACT_ADDRESS;
	const paymasterUrl = import.meta.env.VITE_PAYMASTER_SERVICE_URL;

	const handleConnectWallet = async () => {
		try {
			setStatus("connecting");
			setError(null);

			const result = await connectWallet();

			if (!result || !result.address) {
				throw new Error("Failed to connect wallet");
			}

			const {address, provider: walletProvider, sdk: accountSdk} = result;
			setProvider(walletProvider);
			setSdk(accountSdk);
			setUserAddress(address);

			await switchToBaseSepolia(walletProvider);

			setWalletConnected(true);
			setStatus("connected");
		} catch (error) {
			setError(`Failed to connect: ${error} `);
		}
	};

	const handleDisconnectWallet = async () => {
		await disconnectWallet(sdk);
		setWalletConnected(false);
		setUserAddress("");
		setProvider(null);
		setSdk(null);
		setBatchId("");
		setBatchStatus(null);
		setStatus("idle");
	};

	const claimReward = async () => {
		try {
			if (!contractAddress || !paymasterUrl) {
				throw new Error("Configuration missing!");
			}

			if (!walletConnected || !userAddress) {
				throw new Error("Please connect your wallet first");
			}

			setStatus("claiming");
			setError("");
			setBatchId("");
			setBatchStatus(null);

			const isPaymasterConfigured = await checkPaymasterService(
				paymasterUrl,
				provider
			);
			if (!isPaymasterConfigured) {
				throw new Error("Paymaster service is not configured");
			}

			const result = await sendTransaction(
				provider,
				userAddress,
				contractAddress,
				paymasterUrl
			);
			setBatchId(result);
			setStatus("claimed");

			if (result) {
				setStatus("confirming");
				const finalStatus = await waitForBatchConfirmation(
					provider,
					result
				);
				setBatchStatus(finalStatus);
				setStatus("confirmed");
			}
		} catch (error) {
			setError(error?.message || `Failed to claim reward: ${error}`);
			setStatus("error");
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<Card className="border-2 border-border bg-card/50 backdrop-blur-sm p-8">
				<div className="space-y-6">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<div className="w-1 h-8 bg-primary" />
							<h2 className="text-3xl font-bold tracking-tight">
								CLAIM REWARD
							</h2>
						</div>
						<p className="text-muted-foreground font-mono text-sm">
							Gasless transaction powered by Coinbase Paymaster
						</p>
					</div>

					{!walletConnected ? (
						<Button
							onClick={handleConnectWallet}
							disabled={status === "connecting"}
							className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
							size="lg"
						>
							{status === "connecting" ? (
								<>
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
									CONNECTING...
								</>
							) : (
								<>
									<Wallet className="mr-2 h-5 w-5" />
									CONNECT BASE ACCOUNT
								</>
							)}
						</Button>
					) : (
						<div className="space-y-4">
							<div className="border-2 border-primary/20 bg-primary/5 p-4">
								<div className="flex items-center justify-between">
									<div className="space-y-1">
										<p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
											Connected Account
										</p>
										<p className="font-mono text-lg font-semibold">
											{userAddress.substring(0, 6)}...
											{userAddress.substring(
												userAddress.length - 4
											)}
										</p>
									</div>
									<div className="w-3 h-3 bg-primary animate-pulse" />
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<Button
									onClick={claimReward}
									disabled={
										status === "claiming" ||
										status === "confirming"
									}
									className="h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
									size="lg"
								>
									{status === "claiming" ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											CLAIMING...
										</>
									) : status === "confirming" ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											CONFIRMING...
										</>
									) : (
										"CLAIM REWARD"
									)}
								</Button>
								<Button
									onClick={handleDisconnectWallet}
									variant="outline"
									className="h-14 text-base font-semibold border-2 bg-transparent"
									size="lg"
								>
									DISCONNECT
								</Button>
							</div>
						</div>
					)}
				</div>
			</Card>

			{error && (
				<Card className="border-2 border-destructive bg-destructive/10 p-6">
					<div className="flex items-start gap-3">
						<XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
						<div className="space-y-1">
							<p className="font-semibold text-destructive">
								ERROR
							</p>
							<p className="text-sm text-destructive/90 font-mono">
								{error}
							</p>
						</div>
					</div>
				</Card>
			)}

			{batchId && batchStatus && (
				<Card className="border-2 border-primary bg-primary/5 p-6">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							{batchStatus.status === "CONFIRMED" ? (
								<CheckCircle2 className="h-6 w-6 text-primary" />
							) : (
								<Loader2 className="h-6 w-6 text-primary animate-spin" />
							)}
							<h3 className="text-xl font-bold tracking-tight">
								TRANSACTION STATUS
							</h3>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between border-l-2 border-primary pl-4 py-2">
								<span className="text-sm text-muted-foreground font-mono uppercase">
									Status
								</span>
								<span className="font-semibold font-mono">
									{batchStatus.status === "CONFIRMED"
										? "SUCCESS - REWARD CLAIMED!"
										: batchStatus.status === "PENDING"
										? "PENDING..."
										: "FAILED"}
								</span>
							</div>

							{batchStatus.receipts &&
								batchStatus.receipts.length > 0 && (
									<>
										<div className="border-l-2 border-primary pl-4 py-2 space-y-2">
											<span className="text-sm text-muted-foreground font-mono uppercase block">
												Transaction Hash
											</span>
											<div className="flex items-center gap-2">
												<code className="text-xs bg-background/50 px-2 py-1 font-mono break-all">
													{
														batchStatus.receipts[0]
															.transactionHash
													}
												</code>
												<ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
											</div>
										</div>

										{batchStatus.receipts[0]
											.blockNumber && (
											<div className="flex items-center justify-between border-l-2 border-primary pl-4 py-2">
												<span className="text-sm text-muted-foreground font-mono uppercase">
													Block
												</span>
												<span className="font-semibold font-mono">
													{
														batchStatus.receipts[0]
															.blockNumber
													}
												</span>
											</div>
										)}
									</>
								)}
						</div>
					</div>
				</Card>
			)}
		</div>
	);
}
