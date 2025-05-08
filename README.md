# Oriro - Decentralized DAO Platform

Oriro is a private decentralized DAO platform with multi-chain infrastructure, secure governance, digital banking integration, and a marketplace for tokens, NFTs, and bonds.

## Features

- **Multi-Chain Infrastructure**: Support for Ethereum, Polygon, BSC, and custom private chains with secure cross-chain bridges.
- **Secure Governance**: Custom DAO smart contracts for transparent, secure voting and governance processes.
- **Marketplace**: Trading platform for tokens, NFTs, and bonds backed by real-world assets.
- **Digital Banking Integration**: Virtual IBANs, digital wallets, and payment cards linked to blockchain assets.
- **Privacy & Compliance**: Multi-Party Computation for secure custody with manual KYC approval system.

## Site Access Control System

Oriro includes a comprehensive site access control system that allows the platform to operate in different modes:

### Access Modes

- **Private Beta Mode**: When enabled, users need an access password to enter the platform. This mode is useful during early development and testing phases.
- **Registration Control**: Administrators can enable or disable user registration as needed.
- **Maintenance Mode**: When enabled, only administrators can access the platform while it's under maintenance.

### Administration

The admin dashboard provides:

- **Site Access Management**: Controls for enabling/disabling site access restrictions and setting access passwords.
- **User Registration Management**: Toggle user registration on/off.
- **KYC Approval System**: Interface for reviewing and approving KYC verification requests.
- **User Management**: View, edit, and manage all platform users.

### Technical Implementation

- JWT-based access tokens stored in localStorage
- Server-side middleware for access control validation
- Configuration stored in JSON files for persistence
- React components for access gates and admin interfaces

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend** (Coming soon): Node.js, Express
- **Blockchain**: Ethereum, Polygon, BSC, Hyperledger
- **Web3**: Smart contracts, Wallet integration, Multi-chain infrastructure

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/oriro.git
cd oriro
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
oriro/
├── public/            # Static files
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   │   ├── common/     # Common UI components
│   │   ├── layout/     # Layout components
│   │   └── ...         # Other domain-specific components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── context/        # React context providers
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── .env               # Environment variables
├── vite.config.js     # Vite configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## License

This project is proprietary and confidential.

## Contact

For any inquiries, please contact [your-email@example.com](mailto:your-email@example.com)
