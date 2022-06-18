import { NFT } from 'app/components/NFT';
import { Tab, TabList } from 'app/components/Tabs';
import { AppContext } from 'app/provider/appContext';
import React, { useContext, useEffect, useState } from 'react';
import { useMoralis, useNFTBalances, useNFTTransfers, useERC20Transfers } from 'react-moralis';
import { useParams } from 'react-router-dom';
import { Button, Icon, Table, Tag } from 'web3uikit';
import { getEllipsisTxt, timeStampToDateTime } from '../../web3utils/formatters';
import './profile.scss';
export type NFTTransfer = {
  total: number;
  page: number;
  page_size: number;
  result: {
    token_address: string;
    token_id: string;
    from_address?: string | undefined;
    to_address: string;
    value?: string | undefined;
    amount?: string | undefined;
    contract_type: string;
    block_number: string;
    block_timestamp: string;
    block_hash: string;
    transaction_hash: string;
    transaction_type?: string | undefined;
    transaction_index?: string | undefined;
    log_index: number;
    operator?: string | undefined;
  }[];
  block_exists?: boolean | undefined;
  index_complete?: boolean | undefined;
} | null;

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useMoralis();
  const { myNft, setMyNft } = useContext(AppContext);
  const { getNFTBalances, data, error } = useNFTBalances();
  const { getNFTTransfers, data: nftTransfer, error: nftTransferErr, isFetching } = useNFTTransfers();
  const { fetchERC20Transfers, data: erc20Transfer, error: erc20TransferErr } = useERC20Transfers();

  useEffect(() => {
    const getNFTData = async () => {
      console.log(id);
      await getNFTBalances({
        params: {
          chain: 'ropsten',
          address: id,
        },
      });
      await getNFTTransfers({
        params: {
          chain: 'ropsten',
          address: id,
        },
      });
    };
    getNFTData();
  }, []);
  if (data) {
    !window.localStorage.getItem('myNft')
      ? window.localStorage.setItem('myNft', JSON.stringify(data.result.filter(item => item.token_uri && item.metadata)))
      : [];
  }
  return (
    <>
      <div
        className="mx-auto "
        style={{
          maxWidth: '1200px',
          paddingBottom: '56px',
          position: 'relative',
        }}
      >
        <div
          className=""
          style={{
            height: '256px',
            borderRadius: '32px',
            backgroundColor: '#e7e3eb',
            flex: 'none',
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              boxSizing: 'border-box',
              display: 'block',
              overflow: 'hidden',
              width: 'initial',
              height: 'initial',
              background: 'none',
              opacity: 1,
              position: 'absolute',
              inset: '0px',
            }}
          >
            <img
              alt=""
              src="content/images/no-team-banner.png"
              style={{
                position: 'absolute',
                boxSizing: 'border-box',
                padding: '0px',
                border: 'none',
                margin: 'auto',
                display: 'block',
                width: '0px',
                height: '0px',
                minWidth: '100%',
                maxWidth: '100%',
                minHeight: '100%',
                maxHeight: '100%',
                objectFit: 'cover',
              }}
            ></img>
          </div>
        </div>
        <div
          className=""
          style={{
            position: 'absolute',
            bottom: '0px',
            left: '10px',
          }}
        >
          <img
            alt=""
            src="content/images/no-profile-md.png"
            style={{
              //left: '-4px',
              objectFit: 'cover',
              // height: '90px',
              //width: '100%',
            }}
          ></img>
        </div>
      </div>
      <div className="row">
        <div className="col-md-1"></div>
        <div
          className="col-md-5 h1"
          style={{
            color: '#7645d9',
            fontWeight: '600',
          }}
        >
          {getEllipsisTxt(id, 3)}
        </div>
        <div className="col-md-5 tran-lastest">
          <div className="row py-3 justify-content-center">
            <div className="col-md-auto col-sm-4 text-danger mx-auto">
              <div className=" text-center">ETH</div>
              <div>
                <Tag color="red" text="3.2"></Tag>
              </div>
            </div>
            <div className="col-md-auto col-sm-4 text-success mx-auto">
              <div className=" text-center">USDC</div>
              <div>
                <Tag color="green" text="1000"></Tag>
              </div>
            </div>
            <div className="col-md-auto col-sm-4 text-primary mx-auto">
              <div className=" text-center">NFT</div>
              <Tag color="blue" text={myNft.length.toString()}></Tag>
            </div>
            <div className="col-md-auto col-sm-4 text-warning mx-auto">
              <div className=" text-center">Transaction</div>
              <Tag color="yellow" text={erc20Transfer && erc20Transfer.result.length.toString()}></Tag>
            </div>
          </div>
        </div>
        <div className="col-md-1"></div>
      </div>
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-10">
          <TabList defaultActiveKey={1} tabStyle="bar">
            <Tab
              tabKey={1}
              tabName={
                <div style={{ display: 'flex' }}>
                  <Icon fill="black" size={22} svg="messageCircle" /> <span style={{ paddingLeft: '4px' }}>Profile </span>
                </div>
              }
            >
              <div>
                <span className=" font-weight-bold ">User name </span>
                <span>{user && user.attributes?.username}</span>
              </div>
              <div>
                <span className=" font-weight-bold ">Email </span>
                <span>{user && user.attributes?.email}</span>
              </div>
              <div>
                <span className=" font-weight-bold ">Phone Number </span>
                <span>{user && user.attributes?.phoneNumber}</span>
              </div>
              <div>
                <span className=" font-weight-bold ">Work </span>
                <span>{user && user.attributes?.work}</span>
              </div>
            </Tab>
            <Tab
              tabKey={2}
              tabName={
                <div style={{ display: 'flex' }}>
                  <Icon fill="black" size={22} svg="bell" />
                  <span style={{ paddingLeft: '4px' }}>NFT </span>
                </div>
              }
            >
              <div className="row">
                {myNft.length != 0
                  ? myNft.map(item => (
                      <div className="col-md-4 col-sm-12" key={item.token_address + '/' + item.token_id}>
                        <NFT address={item.token_address} chain="ropsten" fetchMetadata tokenId={item.token_id} />
                      </div>
                    ))
                  : []}
              </div>
            </Tab>
            <Tab
              tabKey={3}
              tabName={
                <div style={{ display: 'flex' }}>
                  <Icon fill="black" size={22} svg="bell" />
                  <span style={{ paddingLeft: '4px' }}>NFT Transaction </span>
                </div>
              }
            >
              <div className="col-md-10">
                <Table
                  columnsConfig="1fr 2fr 1fr 1fr 1fr 1fr"
                  data={
                    nftTransfer
                      ? nftTransfer.result.map((item, key) => [
                          getEllipsisTxt(item.transaction_hash),
                          timeStampToDateTime(item.block_timestamp),
                          getEllipsisTxt(item.from_address),
                          getEllipsisTxt(item.to_address),
                          getEllipsisTxt(item.token_address),
                          item.token_id,
                        ])
                      : []
                  }
                  header={[
                    <span>TxT Hash</span>,
                    <span>Time</span>,
                    <span>From </span>,
                    <span>To</span>,
                    <span>Token Address</span>,
                    <span>Token Id</span>,
                  ]}
                  maxPages={5}
                  onPageNumberChanged={function noRefCheck() {}}
                  pageSize={10}
                  isColumnSortable={[true, true, false, false, false, true]}
                />
              </div>
            </Tab>
            <Tab
              tabKey={4}
              tabName={
                <div style={{ display: 'flex' }}>
                  <Icon fill="black" size={22} svg="bell" />
                  <span style={{ paddingLeft: '4px' }}>ERC20 Transaction </span>
                </div>
              }
            >
              <div className="col-md-10">
                <Table
                  columnsConfig="1fr 2fr 1fr 1fr 1fr 1fr"
                  data={
                    erc20Transfer
                      ? erc20Transfer.result.map((item, key) => [
                          getEllipsisTxt(item.transaction_hash),
                          timeStampToDateTime(item.block_timestamp),
                          getEllipsisTxt(item.from_address),
                          getEllipsisTxt(item.to_address),
                          getEllipsisTxt(item.address),
                          parseInt(item.value) / 100000,
                        ])
                      : []
                  }
                  header={[
                    <span>TxT Hash</span>,
                    <span>Time</span>,
                    <span>From </span>,
                    <span>To</span>,
                    <span>Token Address</span>,
                    <span>value</span>,
                  ]}
                  maxPages={5}
                  onPageNumberChanged={function noRefCheck() {}}
                  pageSize={10}
                  isColumnSortable={[false, true, false, false, false, true]}
                />
              </div>
            </Tab>
          </TabList>
        </div>
      </div>
    </>
  );
}
