import {ClaimReward} from "./components/ClaimReward";

export default function App() {
	return (
		<div className="min-h-screen  relative overflow-hidden">
			
			<div className="relative z-10">
				<header className="border-b border-border/40">
					<div className="container mx-auto px-4 py-8">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10  relative">
								<img src="https://github.com/base/brand-kit/raw/main/logo/TheSquare/Digital/Base_square_blue.svg" alt="" className="size-full" />
							</div>
							<h1 className="text-4xl font-bold tracking-tight text-foreground">
								BASE PAYMASTER
							</h1>
						</div>
						<p className="text-lg text-muted-foreground font-mono">
							{">"} Claim rewards with gasless transactions
						</p>
					</div>
				</header>

				<main className="container mx-auto px-4 py-12">
					<ClaimReward />
				</main>
			</div>
		</div>
	);
}
