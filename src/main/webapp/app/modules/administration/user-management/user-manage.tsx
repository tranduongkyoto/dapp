import './campaign.scss';
import React, { useState, useEffect, useContext } from 'react';
import { convertDateTimeFromServer, convertDateTimeToServer, convertTimeStampToDate } from 'app/shared/util/date-utils';
// import { Table } from 'reactstrap';
import { Loading, CryptoCards, Table, Button } from 'web3uikit';
import {
  useMoralis,
  useMoralisWeb3Api,
  useWeb3ExecuteFunction,
  useMoralisQuery,
  useWeb3Transfer,
  useERC20Balances,
  useMoralisCloudFunction,
  MoralisCloudFunctionParameters,
} from 'react-moralis';
import MoralisType from 'moralis';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { result } from 'lodash';
import { getEllipsisTxt, timeStampToDateTime } from 'app/web3utils';
import { AppProvider } from 'app/provider/appProvider';
import { AppContext } from 'app/provider/appContext';
import { UserCustom } from 'app/provider/styles';
interface transactionType {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  tokenSymbol: string;
}

export default function UserManage() {
  const { id } = useParams<{ id: string }>();
  const [balanceOf, setBalanceOf] = useState<number>();
  const [transaction, setTransaction] = useState<transactionType[]>();
  const [user, setUser] = useState<MoralisType.User[]>();
  const { fetch, data } = useMoralisCloudFunction('getUsers', { autoFetch: false });
  const { userList, setUserList } = useContext(AppContext);
  // const { fetch, error: error2, isFetching } = useWeb3Transfer();
  const contractProcessor = useWeb3ExecuteFunction();

  const onSubmit = async (data, e) => {
    console.log(data);
    console.log(parseInt(data.amount));
    // await fetch({
    //   params: {
    //     type: 'erc20',
    //     amount: Moralis.Units.Token(data.amount, 6),
    //     receiver: `${id}`,
    //     contractAddress: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    //   },
    // })
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    e.target.reset();
  };
  useEffect(() => {
    const getUser = async () => {
      await fetch({
        onSuccess: (data: UserCustom[]) => {
          console.log(data);
          if (data && userList.length == 0) {
            window.localStorage.setItem('userList', JSON.stringify(data));
            setUserList(window.localStorage.getItem('userList') ? JSON.parse(window.localStorage.getItem('userList')) : []);
          }
        },
      });
    };
    if (userList.length == 0) {
      getUser();
    }
  }, []);
  if (userList.length > 1) {
    console.log(userList);
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
          <div className="col-md-8 h1 text-center">User Management</div>
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
                        //item.username || '---',
                        item.email || '---',
                        item.isUpdateProfile,
                        item.isAdmin,
                        timeStampToDateTime(item.createdAt.toString()),
                        timeStampToDateTime(item.updatedAt.toString()),
                        !item.isCryptoWhiteLister ? (
                          <Button id="test-button-primary" onClick={function noRefCheck() {}} text="Add" theme="primary" type="button" />
                        ) : (
                          'V'
                        ),
                        !item.isNFTWhiteLister ? (
                          <Button id="test-button-primary" onClick={function noRefCheck() {}} text="Add" theme="primary" type="button" />
                        ) : (
                          'V'
                        ),
                      ])
                  : []
              }
              header={[
                <span>Address</span>,
                <span>User Name</span>,
                <span>Email</span>,
                <span> Update Info</span>,
                <span>Is Admin</span>,
                <span>Created Date</span>,
                <span>Updated Date</span>,
                <span>Crypto WhiteLister</span>,
                <span>NFT WhiteLister</span>,
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
