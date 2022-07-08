import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import * as abi from '../contract/nftAution.json';
import { useMoralis, useMoralisQuery, useWeb3ExecuteFunction } from 'react-moralis';
import { useHistory, useParams } from 'react-router-dom';
import { Loading, Tag, Button, Hero } from 'web3uikit';
import { useForm } from 'react-hook-form';
import { NFT } from 'app/components/NFT';
import { start } from 'repl';
import { useNotificationCustom } from 'app/web3utils/notification';
declare global {
  interface Window {
    ethereum?: any;
  }
}
export default function StartNftCampaign() {
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
  const contractProcessor = useWeb3ExecuteFunction();
  const { handleNewNotification } = useNotificationCustom();
  //   const buy = async () => {
  //     const startTime = end - 7 * 24 * 60 * 60;
  //     console.log(startTime);
  //     const time = new Date().getTime() / 1000 - startTime;
  //     const discount = (discountRate * time) / 1000000;
  //     console.log(discount);
  //     const newPrice = price - discount + 0.001;
  //     setCurrentPrice(Number(newPrice.toFixed(6)));

  //     const options = {
  //       contractAddress: id,
  //       functionName: 'buy',
  //       abi: [
  //         {
  //           inputs: [
  //             {
  //               internalType: 'contract IERC20',
  //               name: 'token',
  //               type: 'address',
  //             },
  //             {
  //               internalType: 'uint256',
  //               name: 'amount',
  //               type: 'uint256',
  //             },
  //           ],
  //           name: 'buy',
  //           outputs: [],
  //           stateMutability: 'payable',
  //           type: 'function',
  //         },
  //       ],
  //       params: {
  //         token: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  //         amount: Number(newPrice.toFixed(6)) * 1000000,
  //       },
  //     };
  //     await contractProcessor.fetch({
  //       params: options,
  //       onSuccess: res => {
  //         console.log('Success');
  //         setBuyPrice(Number(newPrice.toFixed(6)));
  //         handleNewNotification('success', 'Contract is pending, please wait!');
  //       },
  //       onError: error => {
  //         console.log(error);
  //         handleNewNotification(
  //           'error',
  //           JSON.parse(JSON.stringify(error))?.error?.message
  //             ? JSON.parse(JSON.stringify(error))?.error?.message
  //             : JSON.parse(JSON.stringify(error))?.message
  //         );
  //       },
  //     });
  //   };

  //   useEffect(() => {
  //     if (data.length !== 0) {
  //       if (price === undefined && discountRate === undefined) {
  //         setPrice(parseInt(data[0].attributes?.startingPrice) / 1000000);
  //         setCurrentPrice(parseInt(data[0].attributes?.startingPrice) / 1000000);
  //         setDiscountRate(parseInt(data[0].attributes?.discountRate));
  //         setEnd(parseInt(data[0].attributes?.end));
  //         const startTime = data[0].attributes?.end - 7 * 24 * 60 * 60;
  //         const time = new Date().getTime() / 1000 - startTime;
  //         const discount = (parseInt(data[0].attributes?.discountRate) * time) / 1000000;
  //         const newPrice = data[0].attributes?.startingPrice / 1000000 - discount + 0.001;
  //         setCurrentPrice(Number(newPrice.toFixed(6)));
  //       }
  //     }
  //   });

  const start = async (nft, tokenId, from, to) => {
    const options = {
      contractAddress: nft,
      functionName: 'transferFrom',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'transferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      params: {
        from: from,
        to: to,
        tokenId: tokenId,
      },
    };
    console.log(options);
    await contractProcessor
      .fetch({
        params: options,
        onSuccess: async res => {
          handleNewNotification('success', 'Contract is pending, please wait!');
        },
        onError: error => {
          console.log(error);
          handleNewNotification(
            'error',
            JSON.parse(JSON.stringify(error))?.error?.message
              ? JSON.parse(JSON.stringify(error))?.error?.message
              : JSON.parse(JSON.stringify(error))?.message
          );
        },
      })
      .catch(reason => {
        console.log(reason);
      });
  };
  const update = async () => {
    const Auctionss = Moralis.Object.extend('Auction');
    const query = new Moralis.Query(Auctionss);
    query.equalTo('campaignAddress', id);
    const auction = await query.first();
    auction.set('isStart', true);
    await auction.save();
    console.log(auction);
  };
  var isEnd;
  var isCreator;
  if (data[0]) {
    isEnd = new Date().getTime() > parseInt(data[0].attributes?.end) * 1000;
    isCreator = data[0].attributes?.creator === account;
  }
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
              <div className="h2">{data[0].attributes?.description}</div>
              <div className="h2"> Start Price {price} USD</div>
              <div className="h2">
                {isEnd ? 'Aution Ended' : `End at ${new Date(parseInt(data[0].attributes?.end) * 1000).toDateString()}`}
              </div>
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
              className="col-md-6 mt-5"
              style={{
                backgroundColor: '#fff',
                borderRadius: '25px',
                padding: '20px 20px',
              }}
            >
              <div className="row justify-content-center">
                {/* <div className="col-md-3 mt-2">
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
                    disabled={isEnd}
                  />
                </div> */}
                {/* <div className="col-md-3 mt-2">
                  <Tag color="blue" text={`${currentPrice} USD`}></Tag>
                </div> */}
                <div className="col-md-3 mt-2">
                  <Button
                    id="test-button-primary"
                    onClick={() => start(data[0].attributes?.nft, data[0].attributes?.tokenId, data[0].attributes?.creator, id)}
                    size="large"
                    text="Start"
                    theme="primary"
                    type="button"
                    disabled={isEnd}
                  />
                </div>
                <div className="col-md-3 mt-2">
                  <Button
                    id="test-button-primary"
                    onClick={() => update()}
                    size="large"
                    text="Update"
                    theme="primary"
                    type="button"
                    disabled={isEnd}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* {isEnd && isCreator && (
            <>
              <div className="row justify-content-center">
                <div className="col-md-5 donate mt-5">
                  <div className="row jutify-content-center">
                    <div className="col-md-4 mt-3 text-center">
                      <img src="content/icons/cryptoYellow.svg"></img>
                    </div>
                    <div className="col-md-4 text-center">
                      <img src="content/icons/qrCode.svg" alt="" />
                    </div>
                    <div className="col-md-4 text-center mt-4">
                      <Button
                        id="test-button-primary"
                        onClick={() => withDraw()}
                        size="large"
                        text="With Draw"
                        theme="primary"
                        type="button"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )} */}
        </>
      )}
    </>
  );
}
