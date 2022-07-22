import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import * as abi from '../contract/nftAution.json';
import * as abi2 from '../contract/USDC.json';
import { useMoralis, useMoralisQuery, useNFTTransfers, useWeb3ExecuteFunction } from 'react-moralis';
import { useHistory, useParams } from 'react-router-dom';
import { Loading, Tag, Button, Hero, Table } from 'web3uikit';
import { useForm } from 'react-hook-form';
import { NFT } from 'app/components/NFT';
import { useNotificationCustom } from 'app/web3utils/notification';
import { getEllipsisTxt, timeStampToDateTime } from 'app/web3utils';
import { translate } from 'react-jhipster';
declare global {
  interface Window {
    ethereum?: any;
  }
}
export default function NftCampaign() {
  var isEnd;
  var isCreator;
  var isBuy;
  const { getNFTTransfers, data: nftTransfer, error: nftTransferErr, isFetching } = useNFTTransfers();
  const { account, Moralis } = useMoralis();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { data, error } = useMoralisQuery('Auctionss', query => query.contains('campaignAddress', id));
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [price, setPrice] = useState<number>();
  const [currentPrice, setCurrentPrice] = useState<number>();
  const [discountRate, setDiscountRate] = useState<number>();
  const [end, setEnd] = useState<number>();
  const [buyPrice, setBuyPrice] = useState<number>();
  const { handleNewNotification } = useNotificationCustom();
  const [isGetPrice, setIsGetPrice] = useState(false);
  const buy = async (nft, tokenId) => {
    const startTime = end - 7 * 24 * 60 * 60;
    console.log(startTime);
    const time = new Date().getTime() / 1000 - startTime;
    const discount = (discountRate * time) / 1000000000000000000;
    console.log(discount);
    const newPrice = price - discount + 0.001;
    setCurrentPrice(Number(newPrice.toFixed(6)));
    try {
      const nftAuction = new ethers.Contract(id, abi.abi, provider.getSigner());
      const price = await nftAuction.getPrice();
      const buyPrice = parseInt(price._hex, 16);
      const transaction = await nftAuction.buy('0x07865c6e87b9f70255377e024ace6630c1eaa37f', buyPrice);
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        const Auctionss = Moralis.Object.extend('Auctionss');
        const query = new Moralis.Query(Auctionss);
        query.equalTo('campaignAddress', id);
        const auction = await query.first();
        auction.set('buyer', account);
        auction.set('sellPrice', buyPrice.toString());
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

  useEffect(() => {
    const getData = async () => {
      if (data.length !== 0) {
        if (price === undefined && discountRate === undefined) {
          setPrice(parseInt(data[0].attributes?.startingPrice) / 1000000000000000000);
          setCurrentPrice(parseInt(data[0].attributes?.startingPrice) / 1000000000000000000);
          setDiscountRate(parseInt(data[0].attributes?.discountRate));
          setEnd(parseInt(data[0].attributes?.end));
          const nftAuction = new ethers.Contract(id, abi.abi, provider.getSigner());
          const price = await nftAuction.getPrice();
          setCurrentPrice(Number(parseInt(price._hex, 16) / 1000000000000000000));
        }
      }
    };
    getData();
  });
  useEffect(() => {
    const getNFTData = async () => {
      console.log(id);
      await getNFTTransfers({
        params: {
          chain: 'ropsten',
          address: id,
        },
      });
    };
    getNFTData();
  }, []);

  const approve = async () => {
    const nftAuction = new ethers.Contract(id, abi.abi, provider.getSigner());
    const price = await nftAuction.getPrice();
    setCurrentPrice(Number(parseInt(price._hex, 16) / 1000000000000000000));
    const USDC = new ethers.Contract('0x07865c6E87B9F70255377e024ace6630C1Eaa37F', abi2.abi, provider.getSigner());
    try {
      const transaction = await USDC.approve(id, parseInt(price._hex, 16));
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations.!`);
      }
    } catch (error: any) {
      console.log(JSON.parse(JSON.stringify(error)));
      handleNewNotification(
        'error',
        JSON.parse(JSON.stringify(error))?.error?.message
          ? JSON.parse(JSON.stringify(error))?.error?.message
          : JSON.parse(JSON.stringify(error))?.message
      );
    }
  };

  if (data[0]) {
    console.log(data[0]);
    isBuy = data[0].attributes?.sellPrice != 0 && data[0].attributes?.buyer != '';
    isEnd = new Date().getTime() > parseInt(data[0].attributes?.end) * 1000 || isBuy;
    //isEnd = true;
    isCreator = data[0].attributes?.creator === account;
  }
  const withDraw = async () => {
    try {
      const nftAuction = new ethers.Contract(id, abi.abi, provider.getSigner());
      const transaction = await nftAuction.withDraw2();
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        const Auctionss = Moralis.Object.extend('Auctionss');
        const query = new Moralis.Query(Auctionss);
        query.equalTo('campaignAddress', id);
        const auction = await query.first();
        //auction.set('buyer', "");
        auction.set('sellPrice', '-1');
        await auction.save();
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for your donation!`);
      }
    } catch (error: any) {
      console.log(JSON.parse(JSON.stringify(error)));
      handleNewNotification(
        'error',
        JSON.parse(JSON.stringify(error))?.error?.message
          ? JSON.parse(JSON.stringify(error))?.error?.message
          : JSON.parse(JSON.stringify(error))?.message
      );
    }
  };
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
          <div className="row  justify-content-center main">
            <div className="col-md-2"></div>
            <div className="col-md-4 col-sm-12 pt-5 pl-5">
              <div className="h1">{data[0].attributes?.name}</div>
              <div className="h3">{data[0].attributes?.description}</div>
              <div className="h4">
                {' '}
                {translate('campaign.nft.table.start') + ': '} {price} USD
              </div>
              <div className="h3">
                {isEnd
                  ? translate('campaign.nft.end')
                  : translate('campaign.nft.endAt') + `: ${new Date(parseInt(data[0].attributes?.end) * 1000).toDateString()}`}
              </div>
              {!isBuy && (
                <>
                  <Button onClick={() => withDraw()} size="large" text="With Draw" theme="primary" type="button" disabled={isBuy} />
                </>
              )}
            </div>
            <div className="col-md-6 col-sm-12">
              <NFT
                address={data[0].attributes?.nft}
                chain="ropsten"
                fetchMetadata
                tokenId={data[0].attributes?.tokenId}
                isAuction={false}
              />
            </div>

            <div
              className="col-md-8 mt-5"
              style={{
                backgroundColor: '#fff',
                borderRadius: '25px',
                padding: '20px 20px',
              }}
            >
              <div className="row justify-content-center">
                <div className="col-md-3 mt-2">
                  <Button
                    id="test-button-primary"
                    onClick={async () => {
                      setIsGetPrice(true);
                      const nftAuction = new ethers.Contract(id, abi.abi, provider.getSigner());
                      const price = await nftAuction.getPrice();
                      console.log(parseInt(price._hex, 16) / 1000000000000000000);
                      setCurrentPrice(Number(parseInt(price._hex, 16) / 1000000000000000000));
                      setTimeout(() => setIsGetPrice(false), 5000);
                    }}
                    size="large"
                    text={translate('campaign.nft.getPrice')}
                    theme="primary"
                    type="button"
                    disabled={isEnd || isGetPrice || isBuy}
                  />
                </div>
                <div className="col-md-3 mt-2">
                  <Tag color="blue" text={`${currentPrice} USD`}></Tag>
                </div>
                <div className="col-md-3 mt-2">
                  <Button
                    id="test-button-primary"
                    onClick={() => approve()}
                    size="large"
                    text={translate('campaign.nft.approve')}
                    theme="primary"
                    type="button"
                    disabled={isEnd || isBuy}
                  />
                </div>
                <div className="col-md-3 mt-2">
                  <Button
                    id="test-button-primary"
                    onClick={() => buy(data[0].attributes?.nft, data[0].attributes?.tokenId)}
                    size="large"
                    text={translate('campaign.nft.buy')}
                    theme="primary"
                    type="button"
                    disabled={isEnd || isBuy}
                  />
                </div>
              </div>
            </div>
            {isCreator && !isEnd && !isBuy && (
              <>
                <div className="col-md-5"></div>
                <div className="col-md-7 mt-5">
                  <Button
                    id="test-button-primary"
                    onClick={() => {
                      history.push('/email/new-camp');
                    }}
                    text="Send Email For User"
                    theme="primary"
                    type="button"
                    size="large"
                    disabled={isEnd || isBuy}
                  ></Button>
                </div>
              </>
            )}
            {isBuy && (
              <>
                <div className="col-md-8 mt-5">
                  <div className="h3">
                    {' '}
                    {translate('campaign.nft.buyer')} {data[0].attributes?.buyer}
                  </div>
                  <div className="h3">
                    {' '}
                    {translate('campaign.nft.price')} {parseInt(data[0].attributes?.sellPrice) / 1000000000000000000} USD
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
