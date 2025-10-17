# Base Paymaster Frontend

A gasless transaction application built for the Base blockchain that allows users to claim rewards without paying gas fees, powered by Coinbase's Paymaster service.

## 🚀 Features

-   **Gasless Transactions**: Claim rewards without paying gas fees using Coinbase Paymaster
-   **Base Account Integration**: Connect with Coinbase Base smart accounts using `@base-org/account`
-   **Real-time Status**: Track transaction status and batch confirmations
-   **Base Sepolia Support**: Built for Base Sepolia testnet
-   **Modern UI**: Clean, responsive interface built with React, Tailwind CSS, and shadcn/ui components

## 🛠️ Tech Stack

-   **Frontend Framework**: React 19 + Vite
-   **Blockchain**: Base (Sepolia testnet)
-   **Web3 Libraries**:
    -   `@base-org/account` - Base smart account integration
    -   `@coinbase/wallet-sdk` - Wallet connectivity
    -   `viem` - Ethereum interactions
-   **UI Components**:
    -   Tailwind CSS
    -   Radix UI primitives
    -   Lucide React icons
-   **Build Tool**: Vite with SWC

## 📋 Prerequisites

-   Node.js (v16 or higher)
-   A Coinbase Wallet or Base-compatible wallet
-   Base Sepolia testnet ETH (for wallet setup)

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
VITE_REWARDS_CONTRACT_ADDRESS=your_contract_address
VITE_PAYMASTER_SERVICE_URL=your_paymaster_url
```

## 🚀 Getting Started

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd paymaster-frontend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    - Copy `.env.example` to `.env` (if available)
    - Add your contract address and paymaster service URL

4. **Start the development server**

    ```bash
    npm run dev
    ```

5. **Open your browser**
    - Navigate to `http://localhost:5173`

## 📦 Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build
-   `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ClaimReward.jsx      # Main reward claiming component
│   └── ui/                  # Reusable UI components (button, card)
├── utils/
│   ├── payment-service.js   # Transaction and batch status handling
│   ├── wallet-services.js   # Wallet connection and network switching
│   └── walletProvider.js    # Paymaster service configuration
├── lib/
│   └── utils.js            # Utility functions
├── App.jsx                  # Main app component
├── main.jsx                # App entry point
└── index.css               # Global styles
```

## 🔧 How It Works

1. **Connect Wallet**: Users connect their Base-compatible wallet
2. **Network Check**: Automatically switches to Base Sepolia if needed
3. **Claim Reward**: Initiates a gasless transaction to claim rewards
4. **Paymaster Service**: Coinbase Paymaster sponsors the gas fees
5. **Transaction Tracking**: Real-time status updates until confirmation

## 🌐 Smart Contract Integration

The app interacts with a Rewards contract that has a `claimReward()` function. The ABI is defined in `payment-service.js`.

## 🎨 UI Components

Built with shadcn/ui principles:

-   Custom Button component with variants
-   Card component for content containers
-   Responsive design with Tailwind CSS
-   Smooth animations and loading states

## 📝 License

This project is part of the 10 Days of Base learning series.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Resources

-   [Base Documentation](https://docs.base.org/)
-   [Coinbase Paymaster](https://www.coinbase.com/developer-platform/products/paymaster)
-   [Base Account SDK](https://github.com/base-org/account-sdk)
-   [Viem Documentation](https://viem.sh/)
