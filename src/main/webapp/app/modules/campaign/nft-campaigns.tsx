import React, { Attributes, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Input, Button, DatePicker, Select, TabList, Tab, Icon } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery } from 'react-moralis';
import { NFT } from 'app/components/NFT';
import { ethers } from 'ethers';
import * as abi from './myNft.json';
const NftCampaigns = () => {
  const { Moralis } = useMoralis();
  const [list, setList] = useState<any>();
  const { data, isLoading, error } = useMoralisQuery('Campaign');
  const { data: auction, error: auctinErr } = useMoralisQuery('Auctions');
  const history = useHistory();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const buy = id => {
    history.push(`/auction/${id}`);
  };
  if (auction) {
    console.log(auction);
  }
  const start = async (nft, tokenId, from, to) => {
    const myNFT = new ethers.Contract(nft, abi.abi, provider.getSigner());
    await myNFT.transferFrom(from, to, tokenId);
  };
  return (
    <>
      <div className="row main">
        {auction &&
          auction.map((item, index: number) => {
            return (
              <div className="col-md-6 mt-5" key={index}>
                <Link to={`/auction/${item.attributes?.campaignAddress}`}>
                  <div
                    style={{
                      position: 'relative',
                    }}
                  >
                    <img
                      src={item.attributes?.coverImgUrl}
                      alt=""
                      className="ml-5"
                      style={{
                        width: '487px',
                        height: '300px',
                        objectFit: 'cover',
                        maxWidth: '60%',
                      }}
                    ></img>
                    <div
                      className="ml-5 font-bold"
                      style={{
                        position: 'absolute',
                        bottom: '0px',
                        width: '70%',
                        backgroundColor: 'rgba(10, 10, 10, 0.25)',
                        height: '50px',
                      }}
                    >
                      <div
                        className="text-white ml-2"
                        style={{
                          opacity: '100%',
                        }}
                      >
                        {item.attributes?.name}
                      </div>
                      <div
                        className="text-white text-truncate ml-2"
                        style={{
                          maxWidth: '400px',
                        }}
                      >
                        {item.attributes?.description}
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="row ml-5 justify-content-center ">
                  <div className="col-md-6">
                    {!item.attributes?.isStart && (
                      <Button
                        id="test-button-primary"
                        onClick={() =>
                          start(item.attributes?.nft, item.attributes?.tokenId, item.attributes?.creator, item.attributes?.campaignAddress)
                        }
                        text="Start"
                        theme="primary"
                        type="button"
                      />
                    )}
                  </div>
                  <div className="col-md-6">
                    <Button
                      id="test-button-primary"
                      onClick={() => buy(item.attributes?.campaignAddress)}
                      text="Buy"
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
