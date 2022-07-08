export interface NFTAutionProps {
  startingPrice?: number;
  discountRate?: number;
  name?: string;
  address: string;
  tokenId: string;
  lastPrice?: number;
}
export interface UserCustom {
  createdAt: string;
  updatedAt: string;
  ethAddress: string;
  email: string;
  isAdmin: boolean;
  isUpdateProfile: boolean;
  username: string;
  isCryptoWhiteLister: boolean;
  isNFTWhiteLister: boolean;
  objectId: string;
}
export type MyNftProps =
  | {
      token_address: string;
      token_id: string;
      contract_type: string;
      owner_of: string;
      block_number: string;
      block_number_minted: string;
      token_uri?: string | undefined;
      metadata?: string | undefined;
      synced_at?: string | undefined;
      amount?: string | undefined;
      name: string;
      symbol: string;
    }
  | {
      token_address: string;
      token_id: string;
      contract_type: string;
      owner_of: string;
      block_number: string;
      block_number_minted: string;
      token_uri?: string | undefined;
      metadata?: string | undefined;
      synced_at?: string | undefined;
      amount?: string | undefined;
      name: string;
      symbol: string;
    }
  | {
      image: string | null | undefined;
      metadata: any;
      token_address: string;
      token_id: string;
      contract_type: string;
      owner_of: string;
      block_number: string;
      block_number_minted: string;
      token_uri?: string | undefined;
      synced_at?: string | undefined;
      amount?: string | undefined;
      name: string;
      symbol: string;
    }
  | null;
