import { Connection, Keypair, VersionedTransaction, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  twitter?: string;
  telegram?: string;
  website?: string;
}

export interface DeployTokenParams {
  metadata: TokenMetadata;
  devBuyAmountSol: number;
  imageFile?: File;
}

export interface DeployTokenResult {
  success: boolean;
  mintAddress?: string;
  pumpUrl?: string;
  signature?: string;
  error?: string;
}

export interface WalletAdapter {
  publicKey: PublicKey | null;
  signTransaction: (<T extends VersionedTransaction>(transaction: T) => Promise<T>) | undefined;
}

// Minimum balance required for token deployment (0.02 SOL)
export const MINIMUM_BALANCE_SOL = 0.02;

/**
 * Get Solana connection
 */
export function getSolanaConnection(): Connection {
  // Using mainnet-beta for production
  return new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
}

/**
 * Get wallet balance in SOL
 */
export async function getWalletBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return 0;
  }
}

/**
 * Check if wallet has minimum required balance
 */
export function checkMinimumBalance(balanceInSol: number): boolean {
  return balanceInSol >= MINIMUM_BALANCE_SOL;
}

/**
 * Shorten wallet address for display
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format SOL balance with proper decimals
 */
export function formatSolBalance(balance: number): string {
  if (balance >= 1) {
    return balance.toFixed(2);
  }
  return balance.toFixed(4);
}

/**
 * Create a new token on pump.fun via PumpPortal API
 */
export async function createPumpFunToken(
  connection: Connection,
  wallet: WalletAdapter,
  params: DeployTokenParams
): Promise<DeployTokenResult> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    const { metadata, devBuyAmountSol } = params;

    // Generate a new keypair for the mint
    const mintKeypair = Keypair.generate();
    const mintAddress = mintKeypair.publicKey.toString();

    console.log('🚀 Creating token with mint:', mintAddress);

    // Prepare metadata URI
    let metadataUri = metadata.imageUrl;
    
    if (metadata.imageUrl && metadata.imageUrl.startsWith('data:')) {
      console.warn('⚠️ Base64 images should be uploaded to IPFS first');
    }

    // Get transaction from PumpPortal API
    console.log('📝 Requesting transaction from PumpPortal...');
    
    const devBuyAmount = Number(devBuyAmountSol) || 0;
    console.log('💰 Dev buy amount:', devBuyAmount, 'SOL');

    const pumpPortalUrl = 'https://pumpportal.fun/api/trade-local';
    
    const response = await fetch(pumpPortalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publicKey: wallet.publicKey.toString(),
        action: 'create',
        tokenMetadata: {
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadataUri,
        },
        mint: mintAddress,
        denominatedInSol: 'true',
        amount: devBuyAmount,
        slippage: 10,
        priorityFee: 0.0005,
        pool: 'pump',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ PumpPortal API error:', errorData);
      return { 
        success: false, 
        mintAddress,
        pumpUrl: `https://pump.fun/${mintAddress}`,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}` 
      };
    }

    const tradeData = await response.json();

    if (!tradeData?.transaction) {
      console.error('❌ No transaction returned:', tradeData);
      return { 
        success: false, 
        mintAddress,
        pumpUrl: `https://pump.fun/${mintAddress}`,
        error: tradeData?.error || 'No transaction returned from PumpPortal' 
      };
    }

    // Decode and sign the transaction
    console.log('✍️ Signing transaction...');
    
    const transactionBytes = Uint8Array.from(atob(tradeData.transaction), c => c.charCodeAt(0));
    const transaction = VersionedTransaction.deserialize(transactionBytes);

    // Sign with the mint keypair first
    transaction.sign([mintKeypair]);

    // Then sign with the user's wallet
    const signedTransaction = await wallet.signTransaction(transaction);

    // Send the transaction
    console.log('📡 Sending transaction to Solana...');
    
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });

    console.log('📨 Transaction sent:', signature);

    // Wait for confirmation
    console.log('⏳ Waiting for confirmation...');
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    if (confirmation.value.err) {
      console.error('❌ Transaction failed:', confirmation.value.err);
      return { 
        success: false, 
        mintAddress,
        pumpUrl: `https://pump.fun/${mintAddress}`,
        signature,
        error: 'Transaction failed to confirm' 
      };
    }

    console.log('🎉 Token created successfully on pump.fun!');
    
    return {
      success: true,
      mintAddress,
      pumpUrl: `https://pump.fun/${mintAddress}`,
      signature,
    };

  } catch (error) {
    console.error('❌ Error creating pump.fun token:', error);
    
    const fallbackMint = Keypair.generate().publicKey.toString();
    
    return {
      success: false,
      mintAddress: fallbackMint,
      pumpUrl: `https://pump.fun/${fallbackMint}`,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
