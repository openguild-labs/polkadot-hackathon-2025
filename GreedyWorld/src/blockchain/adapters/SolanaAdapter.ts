import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { BlockchainAdapter } from "../BlockchainAdapter";
import {
  NetworkConfig,
  GameState,
  Action,
  BlockchainEvent,
  TransactionConfig,
} from "../../types";

export class SolanaAdapter extends BlockchainAdapter {
  private connection: Connection;
  private programId: PublicKey;
  private provider: AnchorProvider;
  private program: Program;
  private wallet: Keypair;

  constructor(networkConfig: NetworkConfig) {
    super(networkConfig);
    this.connection = new Connection(networkConfig.rpcUrl, "confirmed");
    this.programId = new PublicKey(networkConfig.contractAddress);
    this.wallet = Keypair.fromSecretKey(
      Buffer.from(networkConfig.privateKey || "", "hex")
    );
    
    this.provider = new AnchorProvider(
      this.connection,
      {
        publicKey: this.wallet.publicKey,
        signTransaction: async (tx: Transaction) => {
          tx.sign(this.wallet);
          return tx;
        },
        signAllTransactions: async (txs: Transaction[]) => {
          return txs.map((tx) => {
            tx.sign(this.wallet);
            return tx;
          });
        },
      },
      { commitment: "confirmed" }
    );
  }

  async connect(): Promise<boolean> {
    try {
      // Load the program IDL and create program instance
      const idl = await Program.fetchIdl(this.programId, this.provider);
      if (!idl) throw new Error("Failed to fetch program IDL");

      this.program = new Program(idl, this.programId, this.provider);
      return true;
    } catch (error) {
      console.error("Failed to connect to Solana:", error);
      return false;
    }
  }

  async getGameState(): Promise<GameState> {
    try {
      // Fetch game state account data
      const gameStateAccount = await this.program.account.gameState.fetch(
        this.getGameStateAddress()
      );

      return this.parseGameState(gameStateAccount);
    } catch (error) {
      console.error("Failed to fetch game state:", error);
      throw error;
    }
  }

  async executeTransaction(
    action: Action,
    config?: TransactionConfig
  ): Promise<boolean> {
    try {
      const instruction = await this.createInstruction(action);
      const transaction = new Transaction().add(instruction);

      // Set recent blockhash and fee payer
      transaction.recentBlockhash = (
        await this.connection.getLatestBlockhash()
      ).blockhash;
      transaction.feePayer = this.wallet.publicKey;

      // Send and confirm transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet]
      );

      console.log("Transaction confirmed:", signature);
      return true;
    } catch (error) {
      console.error("Transaction failed:", error);
      return false;
    }
  }

  subscribeToEvents(callback: (event: BlockchainEvent) => void): void {
    // Subscribe to program account changes
    this.connection.onProgramAccountChange(
      this.programId,
      async (accountInfo) => {
        try {
          const event = this.parseEvent(accountInfo);
          if (event) {
            callback(event);
          }
        } catch (error) {
          console.error("Failed to parse program account change:", error);
        }
      }
    );
  }

  private async createInstruction(action: Action): Promise<web3.TransactionInstruction> {
    switch (action.type) {
      case "MOVE":
        return this.program.methods
          .movePlayer(action.payload.x, action.payload.y)
          .accounts({
            player: this.wallet.publicKey,
            gameState: this.getGameStateAddress(),
            systemProgram: SystemProgram.programId,
          })
          .instruction();

      case "ATTACK":
        return this.program.methods
          .attack(action.payload.targetId, action.payload.weaponId)
          .accounts({
            player: this.wallet.publicKey,
            target: new PublicKey(action.payload.targetId),
            gameState: this.getGameStateAddress(),
            systemProgram: SystemProgram.programId,
          })
          .instruction();

      case "TRADE":
        return this.program.methods
          .trade(
            action.payload.resourceType,
            action.payload.amount,
            action.payload.price
          )
          .accounts({
            player: this.wallet.publicKey,
            market: this.getMarketAddress(),
            gameState: this.getGameStateAddress(),
            systemProgram: SystemProgram.programId,
          })
          .instruction();

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private getGameStateAddress(): PublicKey {
    // Derive PDA for game state account
    const [address] = PublicKey.findProgramAddressSync(
      [Buffer.from("game_state")],
      this.programId
    );
    return address;
  }

  private getMarketAddress(): PublicKey {
    // Derive PDA for market account
    const [address] = PublicKey.findProgramAddressSync(
      [Buffer.from("market")],
      this.programId
    );
    return address;
  }

  private parseGameState(account: any): GameState {
    // Implement game state parsing logic
    return {
      timestamp: Date.now(),
      players: new Map(),
      resources: new Map(),
      marketPrices: new Map(),
    };
  }

  private parseEvent(accountInfo: any): BlockchainEvent | null {
    // Implement event parsing logic
    return null;
  }

  protected async getOptimalGasPrice(): Promise<string> {
    // Solana uses fixed lamports per signature
    const feeCalculator = await this.connection.getRecentBlockhash();
    return feeCalculator.feeCalculator.lamportsPerSignature.toString();
  }
} 