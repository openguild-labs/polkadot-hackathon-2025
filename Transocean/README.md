# **Transocean**  
This project aims to create a decentralized platform for identifying and tracking the ports visited by ships during their journeys. By utilizing blockchain technology, the platform ensures transparency and immutability of data, providing a reliable and verifiable record of the ship's journey. Upon launching, each ship is registered with a unique identifier, and its journey details are recorded as it visits various ports, allowing easy traceability and accountability.

## **Team Members**  
- **Kaitou** - Blockchain Developer
- **Young Clement** - Frontend Developer
- **kennynguyen1603** - Frontend Developer
- **Contact Information:** hoangquan.tran.work@gmail.com

## Development Guidelines
- Fork the repo: [Transocean](https://github.com/WeTranscend-labs/Transocean.git)

## **Project Description**

### What does your project do?

PortTrack is a blockchain-based platform designed to track and authenticate the journey of ships across ports. By assigning a unique identifier to each ship and recording its arrival at every port on the blockchain, PortTrack ensures transparency and accountability in maritime logistics, providing immutable and accessible tracking data.

### Inspiration

PortTrack was inspired by the need for greater transparency and traceability in global shipping. By leveraging blockchain technology, the platform addresses challenges in tracking ships' journeys securely and efficiently, ensuring real-time updates and tamper-proof records.

## **Technical Stack**  
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Smart Contracts Language**: Solidity
- **Blockchain Interaction**: Ethers.js, Wagmi, Viem
- **Others**: React Hook Form, React Query, Zod

## **Features**  
- **Ship Identification**: Each ship is registered with a unique identifier upon launch.
- **Port Tracking**: Records the ports a ship visits along its journey.
- **Blockchain Integration**: Data is stored securely on the blockchain, ensuring transparency and immutability.
- **Decentralized Platform**: No central authority controlling the platform, enabling trustless interactions.
- **Public Accessibility**: Anyone can view the journey and port history of a ship.

## **How It Works**  

### Architecture
PortTrack uses a decentralized architecture powered by blockchain to ensure transparency and security. Ships are registered with unique identifiers on the platform, and as they arrive at each port, the port authority records the event on the blockchain. This creates an immutable, traceable log of the ship's journey, which is accessible through an API gateway and presented to users via an easy-to-use interface. Blockchain ensures that all data is secure, transparent, and cannot be altered.


### Demo Instructions  
#### Prerequisites

Before you start, ensure you have the following installed on your machine:

- Node.js (v16 or later)
- npm or yarn
- Blockchain wallet (e.g., MetaMask)

#### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/WeTranscend-labs/FE-PortTrack.git
    cd FE-PortTrack
    ```

2. **Install Node.js dependencies**:
    ```bash
    npm install
    ```
3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     NEXT_PUBLIC_APP_NAME=YourAppName
	 NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-wallet-connect-project-id
	 NEXT_PUBLIC_CONTRACT_ADDRESS=your-contract-address
     ```

4. **Start the platform**:
    ```bash
    npm run dev
    ```
5. **Access the platform**:
Open your browser and navigate to `http://localhost:3000` to access the platform. You can now start registering ships, tracking their journey, and interacting with the system.

## **Challenges**  
The main challenge was setting up the initial platform for ship registration and ensuring smooth communication with the blockchain. A key difficulty was configuring the development environment and connecting the platform to the blockchain network. 

## **Future Development**  
Next, we plan to expand PortTrack by adding the functionality to record ship arrivals at ports and automatically update the blockchain with arrival details. We'll also focus on improving the user interface for easier navigation and interaction. Future features include real-time tracking of ships, integration with more ports, and advanced security measures. Additionally, we aim to scale the platform to handle a larger number of ships and ports while maintaining system performance and reliability.

## **Submission Details**  
- **GitHub Repository:**  
	- [Transocean Repo](https://github.com/WeTranscend-labs/Transocean.git)
- **Live Demo:**  
	- [Transocean Deployment](https://transocean.vercel.app/)
	- [Transocean Demo Video](https://www.youtube.com/watch?v=3BRXqVBozb4)
- **Presentation Slides:**  
	- [Transocean Vision](https://www.canva.com/design/DAGbZU0XUm0/T4V603ILE3v-_dTHukQRlg/edit)


## Contributing

We welcome contributions! If you have an idea to improve the platform, feel free to fork the repository, create a branch, and submit a pull request. Please follow these steps:

1. Fork the project.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Push your changes to your fork.
5. Open a pull request to the main repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
