import { NFT } from 'app/components/NFT';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Icon, Modal, Typography } from 'web3uikit';

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
      <div className="row">
        <div className="col-md-4 col-sm-12">
          <NFT address="0xfab34f6DB9657A74F7Ea96A5308C84c4f34B9A91" chain="ropsten" fetchMetadata tokenId="5" />
        </div>
        <div className="col-md-4 col-sm-12">
          <NFT address="0xfab34f6DB9657A74F7Ea96A5308C84c4f34B9A91" chain="ropsten" fetchMetadata tokenId="2" />
        </div>
        <div className="col-md-4 col-sm-12">
          <NFT address="0xfab34f6DB9657A74F7Ea96A5308C84c4f34B9A91" chain="ropsten" fetchMetadata tokenId="3" />
        </div>
        <div className="col-md-4 col-sm-12">
          <NFT address="0xfab34f6DB9657A74F7Ea96A5308C84c4f34B9A91" chain="ropsten" fetchMetadata tokenId="4" />
        </div>
        <div className="col-md-4 col-sm-12">
          <NFT address="0xfab34f6DB9657A74F7Ea96A5308C84c4f34B9A91" chain="ropsten" fetchMetadata tokenId="10" />
        </div>
      </div>
    </>
  );
}
