import React, { Attributes, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Input, Button, DatePicker, Select, TabList, Tab, Icon, Tag } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery } from 'react-moralis';
import { NFT } from 'app/components/NFT';
import { ethers } from 'ethers';
import * as abi from '../contract/nftAution.json';
import { translate } from 'react-jhipster';
import NftAuctionItem from './nft-auction-item';
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
      <div>
        <div className="row justify-content-center">
          <Tag color="blue" text="Ongoing" fontSize="20px"></Tag>
        </div>
        <div className="row main">
          {auction &&
            auction.map((item, index: number) => {
              return (
                <NftAuctionItem
                  nft={item.attributes?.nft}
                  tokenId={item.attributes?.tokenId}
                  campaignAddress={item.attributes?.campaignAddress}
                  onGoing={true}
                />
              );
            })}
        </div>
      </div>
      <div>
        <div className="row justify-content-center mt-5">
          <Tag color="blue" text="Ended" fontSize="20px"></Tag>
        </div>
        <div className="row main">
          {auction &&
            auction.map((item, index: number) => {
              return (
                <NftAuctionItem
                  nft={item.attributes?.nft}
                  tokenId={item.attributes?.tokenId}
                  campaignAddress={item.attributes?.campaignAddress}
                  onGoing={false}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default NftCampaigns;
