import React from 'react';
import { NFT } from 'web3uikit';
import { useParams } from 'react-router-dom';

export default function Nfts() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <div className="row text-center">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <div className="h1">{id}</div>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-md-4 col-sm-12">
          <NFT address="0xfab34f6DB9657A74F7Ea96A5308C84c4f34B9A91" chain="ropsten" fetchMetadata tokenId="5" />
        </div>
        <div className="col-md-4 col-sm-12">
          <NFT address="0xfab34f6DB9657A74F7Ea96A5308C84c4f34B9A91" chain="ropsten" fetchMetadata tokenId="3" />
        </div>
        <div className="col-md-4 col-sm-12">
          <NFT address="0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB" chain="eth" fetchMetadata tokenId="1" />
        </div>
        <div className="col-md-4 col-sm-12">
          <NFT address="0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB" chain="eth" fetchMetadata tokenId="1" />
        </div>
      </div>
    </>
  );
}
