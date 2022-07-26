export interface ICampaignProps {
  /**
   * Address of the NFT Collection
   */
  campaignAddress: string;
  coverImgUrl?: string;
  name?: string;
  description?: string;
  goal?: string;
}

export interface IOrgProps {
  /**
   * Address of the NFT Collection
   */
  organizationAddress: string;
  coverImgUrl?: string;
  name?: string;
  description?: string;
  creator?: string;
}

/**
 * NFT-Metadata-Standard: https://docs.opensea.io/docs/metadata-standards
 */
export type TNFTMetadata = {
  animation_url?: string;
  attributes?: Array<any>;
  background_color?: string;
  description?: string;
  image?: string;
  image_url?: string;
  name?: string;
  traits?: Array<any>;
  youtube_url?: string;
};
