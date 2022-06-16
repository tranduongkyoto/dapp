import { NFT } from 'app/components/NFT';
import { time } from 'console';
import React, { useEffect, useState } from 'react';
import { useNFTBalances } from 'react-moralis';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Icon, Modal, Typography } from 'web3uikit';
type NftResProps =
  | {
      status?: string | undefined;
      total?: number | undefined;
      page?: number | undefined;
      page_size?: number | undefined;
      result?:
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
          }[]
        | undefined;
    }
  | {
      result: (
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
      )[];
      status?: string | undefined;
      total?: number | undefined;
      page?: number | undefined;
      page_size?: number | undefined;
    }
  | null;

export default function Nfts() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances();
  const [nftData, setNftData] = useState<NftResProps>();
  useEffect(() => {
    const getNFTData = async () => {
      console.log(id);
      await getNFTBalances({
        params: {
          chain: 'ropsten',
          address: id,
        },
      });
      // if (data) {
      //   console.log(data);
      // }
      //setNftData(data);
    };
    getNFTData();
  }, []);
  if (data) {
    console.log(data);
    window.localStorage.setItem('myNft', JSON.stringify(data.result.filter(item => item.token_uri && item.metadata)));
  }
  return (
    <>
      <div className="row justify-content-center">
        <Link
          to={'/campaign/create/nft'}
          style={{
            textDecoration: 'none',
          }}
        >
          <div className="h4">Add NFT to Aution</div>
        </Link>
      </div>
      <div className="row">
        {data &&
          data.result
            .filter(item => item.token_uri && item.metadata)
            .map(item => (
              <div className="col-md-4 col-sm-12" key={item.token_address + '/' + item.token_id}>
                <NFT address={item.token_address} chain="ropsten" fetchMetadata tokenId={item.token_id} />
              </div>
            ))}
      </div>
    </>
  );
}
