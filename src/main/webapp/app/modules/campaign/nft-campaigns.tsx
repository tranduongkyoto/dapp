import React, { Attributes, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Input, Button, DatePicker, Select, TabList, Tab, Icon } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery } from 'react-moralis';
import { NFT } from 'app/components/NFT';
import { ethers } from 'ethers';
import * as abi from '../contract/nftAution.json';
import { translate } from 'react-jhipster';
const NftCampaigns = () => {
  const { account, Moralis } = useMoralis();
  const [list, setList] = useState<any>();
  const { data, isLoading, error } = useMoralisQuery('Campaign');
  const { data: auction, error: auctinErr } = useMoralisQuery('Auctionss');
  const history = useHistory();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const buy = id => {
    history.push(`/auction/${id}`);
  };
  if (auction) {
    console.log(JSON.parse(JSON.stringify(auction))[0]?.block_hash);
  }
  const start = async (nft, tokenId, owner: string) => {};
  if (!auction) {
    return <div>No Response</div>;
  }
  const check = (nft: string) => {};
  if (auction) {
    const data = auction.filter(async item => {
      const res = await start(item.attributes?.nft, item.attributes?.tokenId, item.attributes?.campaignAddress);
      return res;
    });
    console.log(data);
  }

  return (
    <>
      <div className="row main">
        {auction &&
          auction
            .filter(item => item.attributes?.isStart)
            .map((item, index: number) => {
              return (
                <div className="col-md-4 mt-5" key={index}>
                  <NFT
                    address={item.attributes?.nft}
                    chain="bsc testnet"
                    fetchMetadata
                    tokenId={item.attributes?.tokenId}
                    isAuction={false}
                    auctionLink={`/auction/${item.attributes?.campaignAddress}`}
                  />

                  <div className="row ml-5 justify-content-center ">
                    {/* <div className="col-md-6">
                      {!item.attributes?.isStart && (
                        <Button
                          id="test-button-primary"
                          onClick={() => start(item.attributes?.nft, item.attributes?.tokenId, account)}
                          text="Start"
                          theme="primary"
                          type="button"
                        />
                      )}
                    </div> */}
                    <div className="col-md-6">
                      <Button
                        id="test-button-primary"
                        onClick={() => buy(item.attributes?.campaignAddress)}
                        text={translate('campaign.nft.buy')}
                        theme="primary"
                        type="button"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
};

export default NftCampaigns;
