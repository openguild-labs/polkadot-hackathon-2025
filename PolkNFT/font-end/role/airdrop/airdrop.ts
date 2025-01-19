import axios from "axios";

export const handleAirdrop = (address: string) => {
   const FAUCET_AMOUNT = 1000000; // 1 ADA in lovelaces (1 ADA = 1,000,000 lovelaces)

   // Initialize Blockfrost API client
   const blockfrostClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BLOCKFROST_BASE_URL,
      headers: {
         project_id: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
      },
   });

   // Function to create a raw transaction
   async function createRawTransaction(receiverAddress: string): Promise<any> {
      try {
         // Fetch UTXOs from the sender's public address
         const utxosResponse = await blockfrostClient.get(
            `/addresses/${address}/utxos`,
         );
         const utxos = utxosResponse.data;

         if (!utxos || utxos.length === 0) {
            throw new Error("No UTXOs available for the transaction.");
         }

         // Select the first UTXO to fund the transaction (for simplicity)
         const selectedUtxo = utxos[0];

         if (selectedUtxo.amount < FAUCET_AMOUNT) {
            throw new Error("Insufficient funds in the selected UTXO.");
         }

         // Calculate transaction outputs
         const outputs = [
            {
               address: receiverAddress,
               amount: FAUCET_AMOUNT.toString(), // Amount to send
            },
            {
               address: address, // Return remaining balance to the sender
               amount: (selectedUtxo.amount - FAUCET_AMOUNT).toString(),
            },
         ];

         // Prepare the raw transaction structure
         const rawTransaction = {
            inputs: [
               {
                  transaction_id: selectedUtxo.tx_hash,
                  index: selectedUtxo.tx_index,
               },
            ],
            outputs,
         };

         return rawTransaction;
      } catch (error) {
         console.error("Error creating raw transaction:", error);
      }
   }
};
