import React, { useEffect, useState } from 'react';
import './campaign.scss';
// import { Table } from 'reactstrap';
import { getEllipsisTxt, timeStampToDateTime } from 'app/web3utils';
import { useNotificationCustom } from 'app/web3utils/notification';
import axios from 'axios';
import { ethers } from 'ethers';
import { translate } from 'react-jhipster';
import { useMoralis, useMoralisCloudFunction, useWeb3ExecuteFunction } from 'react-moralis';
import { useParams } from 'react-router-dom';
import { Button, Loading, Table } from 'web3uikit';
import * as campaignabi from '../../contract/campaignStore.json';
import * as abi from '../../contract/nftStore.json';
interface transactionType {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  tokenSymbol: string;
}

interface User {
  ethAddress: string;
  username: string;
  email: string;
  isUpdateProfile: boolean;
  isAdmin: boolean;
  createAt: string;
  updatedAt: string;
  isCryptoCampaignBlacklist: boolean;
  isNFTAuctionBlacklist: boolean;
}

export default function UserManage() {
  const { account, Moralis } = useMoralis();
  const { id } = useParams<{ id: string }>();
  const [balanceOf, setBalanceOf] = useState<number>();
  const [transaction, setTransaction] = useState<transactionType[]>();
  const [userList, setUserList] = useState<User[]>([]);
  const { fetch, data } = useMoralisCloudFunction('getUsers');
  // const { userList, setUserList } = useContext(AppContext);
  const contractProcessor = useWeb3ExecuteFunction();
  const { handleNewNotification } = useNotificationCustom();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [sub, setSub] = useState(true);
  useEffect(() => {
    const getBalanceOf = async () => {
      const res = await axios.get(
        'https://syiflvfo6dcs.usemoralis.com:2053/server/functions/getUsers?_ApplicationId=Cd8QyvZnJDKwubQYunl0xuqn9my8FR9fM3KZcVss'
      );
      if (res.status == 200 && res?.data?.result) {
        const user: User[] = res.data.result
          .filter(item => item?.username != 'coreservices')
          .map(item => {
            const obj = {
              ethAddress: item?.ethAddress,
              username: item?.username,
              email: item?.email,
              isUpdateProfile: item?.isUpdateProfile,
              isAdmin: item?.isAdmin,
              createAt: item?.createdAt,
              updatedAt: item.updatedAt,
              isCryptoCampaignBlacklist: false,
              isNFTAuctionBlacklist: false,
            };
            return obj;
          });
        const campaignStore = new ethers.Contract(
          '0xc7E8AF279f798e6632f91708946B0e78b451DA3C',
          campaignabi.abi,
          provider.getSigner(account)
        );
        Promise.allSettled(user.map(async item => await campaignStore.isBlackLister(item.ethAddress))).then(values => {
          console.log(values);
          var newUserList: User[] = user.map((item, index) => {
            console.log(values[index]?.value);
            return {
              ...item,
              isCryptoCampaignBlacklist: values[index]?.value ? values[index]?.value : false,
            };
          });
          setUserList(newUserList);
          const nftStore = new ethers.Contract('0xAa6190916A4f25039A50de315081f419e8A55FE2', abi.abi, provider.getSigner());
          Promise.allSettled(user.map(async item => await nftStore.isBlackLister(item.ethAddress))).then(values => {
            console.log(values);
            const newUserList2: User[] = newUserList.map((item, index) => {
              console.log(values[index]?.value);
              return {
                ...item,
                isNFTAuctionBlacklist: values[index]?.value ? values[index]?.value : false,
              };
            });
            setUserList(newUserList2);
            setSub(!sub);
          });
        });
      }
    };
    getBalanceOf();
  }, [sub]);

  if (!data) {
    return (
      <div className="row justify-content-center ">
        <div
          className="col-md-1"
          style={{
            //backgroundColor: '#ECECFE',
            //borderRadius: '8px',
            padding: '50px',
            //width: '150px',
            //height: '150px',
          }}
        >
          <Loading size={40} spinnerColor="#2E7DAF" text="Loading..." />
        </div>
      </div>
    );
  }
  // if (data && userList.length == 0) {
  //   console.log(JSON.parse(JSON.stringify(data)));
  //   setUserList(JSON.parse(JSON.stringify(data)));
  // }

  const addCampaign = async (add: string) => {
    try {
      const campaignStore = new ethers.Contract('0xc7E8AF279f798e6632f91708946B0e78b451DA3C', campaignabi.abi, provider.getSigner());
      const transaction = await campaignStore.addBlackLister(add);
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for!`);
        setSub(!sub);
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
  const addNft = async (add: string) => {
    try {
      const nftStore = new ethers.Contract('0xAa6190916A4f25039A50de315081f419e8A55FE2', abi.abi, provider.getSigner());
      const transaction = await nftStore.addBlackLister(add);
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for!`);
        setSub(!sub);
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
  const removeCampaign = async (add: string) => {
    try {
      const campaignStore = new ethers.Contract('0xc7E8AF279f798e6632f91708946B0e78b451DA3C', campaignabi.abi, provider.getSigner());
      const transaction = await campaignStore.removeBlackLister(add);
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for!`);
        setSub(!sub);
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
  const removeNft = async (add: string) => {
    try {
      const nftStore = new ethers.Contract('0xAa6190916A4f25039A50de315081f419e8A55FE2', abi.abi, provider.getSigner());
      const transaction = await nftStore.removeBlackLister(add);
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for!`);
        setSub(!sub);
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
  if (!userList) {
    return <></>;
  }
  return (
    <>
      {userList.length == 0 ? (
        <div
          style={{
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <Loading />
        </div>
      ) : (
        <div className="row  justify-content-center main">
          <div className="col-md-8 h1 text-center">{translate('user.title')}</div>
          <div className="col-md-12">
            <Table
              columnsConfig="0.75fr 1fr 1fr 0.75fr 1fr 1fr 1fr 1fr 1fr"
              data={
                userList.length > 1
                  ? userList.map(item => [
                      getEllipsisTxt(item.ethAddress) || '---',
                      item.username.toString().length > 10 ? item.username.slice(0, 10) + '...' : item.username || '---',
                      item.email || '---',
                      item.isUpdateProfile.toString(),
                      item.isAdmin.toString(),
                      timeStampToDateTime(item.createAt.toString()),
                      timeStampToDateTime(item.updatedAt.toString()),
                      !item.isCryptoCampaignBlacklist ? (
                        <Button
                          color="green"
                          id="test-button-status"
                          onClick={() => addCampaign(item.ethAddress)}
                          text="Add"
                          theme="status"
                          type="button"
                        />
                      ) : (
                        <Button
                          color="red"
                          id="test-button-status"
                          onClick={() => removeCampaign(item.ethAddress)}
                          text="Remove"
                          theme="status"
                          type="button"
                        />
                      ),
                      !item.isNFTAuctionBlacklist ? (
                        <Button
                          color="green"
                          id="test-button-status"
                          onClick={() => addNft(item.ethAddress)}
                          text="Add"
                          theme="status"
                          type="button"
                        />
                      ) : (
                        <Button
                          color="red"
                          id="test-button-status"
                          onClick={() => removeNft(item.ethAddress)}
                          text="Remove"
                          theme="status"
                          type="button"
                        />
                      ),
                    ])
                  : []
              }
              header={[
                <span>{translate('user.add')}</span>,
                <span>{translate('user.name')}</span>,
                <span>{translate('user.email')}</span>,
                <span>{translate('user.info')}</span>,
                <span>{translate('user.admin')}</span>,
                <span>{translate('user.create')}</span>,
                <span>{translate('user.update')}</span>,
                <span>{translate('user.crypto')}</span>,
                <span>{translate('user.nft')}</span>,
              ]}
              maxPages={5}
              onPageNumberChanged={function noRefCheck() {}}
              pageSize={10}
            />
          </div>
        </div>
      )}
    </>
  );
}
