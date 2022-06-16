import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import * as abi from './nftAution.json';
import { useMoralisQuery } from 'react-moralis';
import { useParams } from 'react-router-dom';
import { Loading, Tag, Button, Hero } from 'web3uikit';
import { useForm } from 'react-hook-form';
import { NFT } from 'app/components/NFT';
import { start } from 'repl';

declare global {
  interface Window {
    ethereum?: any;
  }
}
export default function NftCampaign() {
  const { id } = useParams<{ id: string }>();
  const { data, error } = useMoralisQuery('Auctions', query => query.contains('campaignAddress', id));
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [price, setPrice] = useState<number>();
  const [currentPrice, setCurrentPrice] = useState<number>();
  const [discountRate, setDiscountRate] = useState<number>();
  const [end, setEnd] = useState<number>();

  const buy = () => {
    const startTime = end - 7 * 24 * 60 * 60;
    console.log(startTime);
    const time = new Date().getTime() / 1000 - startTime;
    const discount = (discountRate * time) / 1000000;
    console.log(discount);
    const newPrice = price - discount + 0.01;
    setCurrentPrice(Number(newPrice.toFixed(6)));
    const myNFT = new ethers.Contract(id, abi.abi, provider.getSigner());
    const res = myNFT.buy('0x07865c6E87B9F70255377e024ace6630C1Eaa37F', Number(newPrice.toFixed(6)) * 1000000);
  };

  useEffect(() => {
    if (data.length !== 0) {
      if (price === undefined && discountRate === undefined) {
        setPrice(parseInt(data[0].attributes?.startingPrice) / 1000000);
        setCurrentPrice(parseInt(data[0].attributes?.startingPrice) / 1000000);
        setDiscountRate(parseInt(data[0].attributes?.discountRate));
        setEnd(parseInt(data[0].attributes?.end));
        const startTime = data[0].attributes?.end - 7 * 24 * 60 * 60;
        const time = new Date().getTime() / 1000 - startTime;
        const discount = (parseInt(data[0].attributes?.discountRate) * time) / 1000000;
        const newPrice = data[0].attributes?.startingPrice / 1000000 - discount + 0.01;
        setCurrentPrice(Number(newPrice.toFixed(6)));
      }
    }
  });

  return (
    <>
      {data.length === 0 ? (
        <div
          style={{
            // backgroundColor: '#ECECFE',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <Loading />
        </div>
      ) : (
        <>
          {/* <Hero backgroundURL="https://moralis.io/wp-content/uploads/2021/06/blue-blob-background-2.svg" title="" height="1000px"> */}
          <div className="row  justify-content-center main">
            <div className="col-md-2"></div>
            <div className="col-md-4 col-sm-12 pt-5 pl-5">
              <div className="h1">{data[0].attributes?.name}</div>
              <div className="">{data[0].attributes?.description}</div>
              <div>{new Date(parseInt(data[0].attributes?.end)).toString()}</div>
              <NFT address={data[0].attributes?.nft} chain="ropsten" fetchMetadata tokenId={data[0].attributes?.tokenId} />
            </div>
            <div className="col-md-6 col-sm-12">
              <img
                style={{
                  maxWidth: '60%',
                  height: 'auto',
                }}
                alt=""
                src="content/images/bluezoneApp.png"
              ></img>
            </div>
            <div className="col-md-6 donate mt-5">
              <div className="row justify-content-center">
                <div className="col-md-1"></div>
                <div className="col-md-4 mt-2">
                  <Button
                    id="test-button-primary"
                    onClick={() => {
                      const startTime = end - 7 * 24 * 60 * 60;
                      const time = new Date().getTime() / 1000 - startTime;
                      console.log(startTime);
                      console.log(time);
                      const discount = (discountRate * time) / 1000000;
                      const newPrice = price - discount + 0.01;
                      setCurrentPrice(Number(newPrice.toFixed(6)));
                    }}
                    size="large"
                    text="Get Price"
                    theme="primary"
                    type="button"
                  />
                </div>
                <div className="col-md-4">
                  <Tag color="blue" text={`${currentPrice} USD`}></Tag>
                </div>
                <div className="col-md-3">
                  {/* <Tag color="blue" text={}></Tag> */}
                  <Button id="test-button-primary" onClick={() => buy()} size="large" text="Buy" theme="primary" type="button" />
                </div>
              </div>
            </div>
          </div>
          {/* </Hero> */}
        </>
      )}
    </>
  );
}
