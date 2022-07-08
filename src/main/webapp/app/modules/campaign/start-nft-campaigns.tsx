import React, { Attributes, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Input, Button, DatePicker, Select, TabList, Tab, Icon } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery } from 'react-moralis';
import { NFT } from 'app/components/NFT';
import { ethers } from 'ethers';
import * as abi from '../contract/myNft.json';
import { default as MoralisType } from 'moralis/types';

import { useNotificationCustom } from 'app/web3utils/notification';
const StartNftCampaigns = () => {
  const { account, Moralis } = useMoralis();
  const [list, setList] = useState<any>();
  const [Auctionss, setAuctionss] = useState<MoralisType.Object<MoralisType.Attributes>[]>();
  const { data, isLoading, error } = useMoralisQuery('Campaign');
  const { data: auction, error: auctionErr } = useMoralisQuery('Auctionss');
  const history = useHistory();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contractProcessor = useWeb3ExecuteFunction();
  const { handleNewNotification } = useNotificationCustom();
  const buy = id => {
    history.push(`/auction/${id}`);
  };
  if (auction) {
    console.log(JSON.parse(JSON.stringify(auction))[0]);
  }
  const start = async (nft, tokenId, from, to) => {
    try {
      const myNFT = new ethers.Contract(nft, abi.abi, provider.getSigner());
      const transaction = await myNFT.transferFrom(from, to, tokenId);
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        const Auctionss = Moralis.Object.extend('Auctionss');
        const query = new Moralis.Query(Auctionss);
        query.equalTo('campaignAddress', to);
        const auction = await query.first();
        auction.set('isStart', true);
        await auction.save();
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for!`);
      }
    } catch (error: any) {
      console.log(error);
      handleNewNotification(
        'error',
        JSON.parse(JSON.stringify(error))?.error?.message
          ? JSON.parse(JSON.stringify(error))?.error?.message
          : JSON.parse(JSON.stringify(error))?.message
      );
    }
  };
  console.log(auction);
  if (!auction) {
    return <div>No Response</div>;
  }

  return (
    <>
      <div className="row main">
        {auction &&
          auction
            .filter(item => item.attributes?.creator == account && !item.attributes?.isStart)
            .map((item, index: number) => {
              return (
                <div className="col-md-4 mt-5" key={index}>
                  <NFT
                    address={item.attributes?.nft}
                    chain="ropsten"
                    fetchMetadata
                    tokenId={item.attributes?.tokenId}
                    isAuction={false}
                    //auctionLink={`/nft-campaign/start/${item.attributes?.campaignAddress}`}
                  />
                  <div className="row ml-5 justify-content-center ">
                    <div className="col-md-6">
                      {
                        <Button
                          id="test-button-primary"
                          onClick={() =>
                            start(
                              item.attributes?.nft,
                              item.attributes?.tokenId,
                              item.attributes?.creator,
                              item.attributes?.campaignAddress
                            )
                          }
                          text="Start"
                          theme="primary"
                          type="button"
                        />
                      }
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
};

export default StartNftCampaigns;
