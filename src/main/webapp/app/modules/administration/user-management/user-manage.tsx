import React, { useContext, useEffect, useState } from 'react';
import './campaign.scss';
// import { Table } from 'reactstrap';
import { AppContext } from 'app/provider/appContext';
import { getEllipsisTxt, timeStampToDateTime } from 'app/web3utils';
import { useNotificationCustom } from 'app/web3utils/notification';
import { ethers } from 'ethers';
import MoralisType from 'moralis';
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

export default function UserManage() {
  const { account, Moralis } = useMoralis();
  const { id } = useParams<{ id: string }>();
  const [balanceOf, setBalanceOf] = useState<number>();
  const [transaction, setTransaction] = useState<transactionType[]>();
  const [user, setUser] = useState<MoralisType.User[]>();
  const { fetch, data } = useMoralisCloudFunction('getUsers');
  const { userList, setUserList } = useContext(AppContext);
  const contractProcessor = useWeb3ExecuteFunction();
  const { handleNewNotification } = useNotificationCustom();
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  useEffect(() => {}, []);

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
  if (data && userList.length == 0) {
    console.log(JSON.parse(JSON.stringify(data)));
    setUserList(JSON.parse(JSON.stringify(data)));
  }

  const addCampaign = async (add: string, id: string) => {
    try {
      const campaignStore = new ethers.Contract('0x1fcf3d0D9A9C4a0f02519c094DE4d326dbafdE98', campaignabi.abi, provider.getSigner());
      const transaction = await campaignStore.addWhiteLister(add);
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for!`);
        const User = Moralis.Object.extend('_User', { useMasterkey: true });
        const query = new Moralis.Query(User);
        //console.log(id);
        console.log(add, id);
        query.equalTo('objectId', id);
        console.log(query);
        const user = await query.first({ useMasterKey: true });
        console.log(user);
        user.set('isCryptoWhiteLister', true);
        await user.save();
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
      const nftStore = new ethers.Contract('0x1fcf3d0D9A9C4a0f02519c094DE4d326dbafdE98', abi.abi, provider.getSigner());
      const transaction = await nftStore.addWhiteLister(add);
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for!`);
        // const User = Moralis.Object.extend('_User', { useMasterkey: true });
        // const query = new Moralis.Query(User);
        // console.log(add, id);
        // query.equalTo('objectId', id);
        // console.log(query);
        // const user = await query.first({ useMasterKey: true });
        // console.log(user);
        // user.set('isNFTWhiteLister', true);
        // await user.save();
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
      const campaignStore = new ethers.Contract('0x1fcf3d0D9A9C4a0f02519c094DE4d326dbafdE98', campaignabi.abi, provider.getSigner());
      const transaction = await campaignStore.removeWhiteLister(add);
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for!`);
        const User = Moralis.Object.extend('_User');
        const query = new Moralis.Query(User);
        query.equalTo('ethAddress', add);
        const user = await query.first();
        user.set('isNFTWhiteLister', true);
        await user.save();
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
      const nftStore = new ethers.Contract('0x1fcf3d0D9A9C4a0f02519c094DE4d326dbafdE98', abi.abi, provider.getSigner());
      const transaction = await nftStore.removeWhiteLister(add);
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for!`);
        // const User = Moralis.Object.extend('_User', { useMasterkey: true });
        // const query = new Moralis.Query(User);
        // console.log(add, id);
        // query.equalTo('objectId', id);
        // console.log(query);
        // const user = await query.first({ useMasterKey: true });
        // console.log(user);
        // user.set('isNFTWhiteLister', true);
        // await user.save();
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
              columnsConfig="0.75fr 1fr 1fr 0.75fr 0.5fr 1fr 1fr 1fr 1fr"
              data={
                userList.length > 1
                  ? userList
                      .filter(item => item.username != 'coreservices')
                      .map(item => [
                        getEllipsisTxt(item.ethAddress) || '---',
                        item.username.toString().length > 10 ? item.username.slice(0, 10) + '...' : item.username || '---',
                        item.email || '---',
                        item.isUpdateProfile.toString(),
                        item.isAdmin.toString(),
                        timeStampToDateTime(item.createdAt.toString()),
                        timeStampToDateTime(item.updatedAt.toString()),
                        !item.isCryptoWhiteLister ? (
                          <Button
                            color="green"
                            id="test-button-status"
                            onClick={() => addCampaign(item.ethAddress, item.objectId)}
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
                        !item.isNFTWhiteLister ? (
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
