import React, { Attributes, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Input, Button, DatePicker, Select, TabList, Tab, Icon } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery } from 'react-moralis';
import { NFT } from 'app/components/NFT';
import { ethers } from 'ethers';
import * as abi from '../contract/myNft.json';
import { default as MoralisType } from 'moralis/types';

import { useNotificationCustom } from 'app/web3utils/notification';
import { translate } from 'react-jhipster';
const StartNftCampaigns = () => {
  const { account, Moralis } = useMoralis();
  const [list, setList] = useState<any>();
  const [Auctionss, setAuctionss] = useState<MoralisType.Object<MoralisType.Attributes>[]>();
  const { data, isLoading, error } = useMoralisQuery('Campaign');
  const { data: auction, error: auctionErr } = useMoralisQuery('Auctionss');
  const history = useHistory();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
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
      const ids = [1, 2]; // Array of ids
      const Auctionss = Moralis.Object.extend('Auctionss');
      const query = new Moralis.Query(Auctionss);
      query.equalTo('campaignAddress', to);
      const auction = await query.first();
      auction.set('isStart', true);
      const [res1, res2] = await Promise.all([await transaction.wait(), await auction.save()]);
      console.log(res1);
      console.log(res2);
      if (res1?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res1?.confirmations} confirmations. Thank for!`);
      } else {
        auction.set('isStart', false);
        await auction.save();
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
  if (auction.filter(item => item.attributes?.creator == account && !item.attributes?.isStart).length == 0) {
    return <div>No Data</div>;
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
                    chain="bsc testnet"
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
                          text={translate('campaign.nft.start')}
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
