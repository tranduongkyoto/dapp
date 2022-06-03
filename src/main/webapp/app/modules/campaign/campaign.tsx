import './campaign.scss';
import React, { useState, useEffect } from 'react';
import { convertDateTimeFromServer, convertDateTimeToServer, convertTimeStampToDate } from 'app/shared/util/date-utils';
import { Table } from 'reactstrap';
import { Loading, CryptoCards } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery, useWeb3Transfer, useERC20Balances } from 'react-moralis';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { result } from 'lodash';
interface transactionType {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  tokenSymbol: string;
}
const Campaign = () => {
  const { id } = useParams<{ id: string }>();
  const [balanceOf, setBalanceOf] = useState<number>();
  const [transaction, setTransaction] = useState<transactionType[]>();
  const { data, error } = useMoralisQuery('Campaign', query => query.contains('uid', id));
  const { Moralis } = useMoralis();
  const { fetch, error: error2, isFetching } = useWeb3Transfer();
  const contractProcessor = useWeb3ExecuteFunction();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });
  const onSubmit = async (data, e) => {
    console.log(data);
    console.log(parseInt(data.amount));
    await fetch({
      params: {
        type: 'erc20',
        amount: Moralis.Units.Token(data.amount, 6),
        receiver: '0x95f82F63b1d3EB775E37d7D2e401700fF395128F',
        contractAddress: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
      },
    });

    e.target.reset();
  };
  useEffect(() => {
    const getBalanceOf = async () => {
      const data = await axios.get(
        'https://api-ropsten.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x07865c6E87B9F70255377e024ace6630C1Eaa37F&address=0x95f82F63b1d3EB775E37d7D2e401700fF395128F&tag=latest&apikey=FH674SA8K1BFH2SFB7KXYZXFB5GS63IXM4'
      );
      if (data?.data?.result) {
        setBalanceOf(parseInt(data?.data?.result) / 1000000);
      }
    };

    getBalanceOf();
  }, []);

  useEffect(() => {
    const getTransaction = async () => {
      const data = await axios.get(
        'https://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=0x07865c6E87B9F70255377e024ace6630C1Eaa37F&address=0x95f82F63b1d3EB775E37d7D2e401700fF395128F&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=FH674SA8K1BFH2SFB7KXYZXFB5GS63IXM4'
      );
      if (data?.data?.result) {
        setTransaction(data?.data?.result);
      }
    };
    getTransaction();
  }, []);
  const lastestTxn = () => {
    if (transaction) {
      const lastest = transaction.filter(item => item.from !== '0x95f82f63b1d3eb775e37d7d2e401700ff395128f')[0];
      return (
        <div className="row py-3 justify-content-center">
          <div className="col-md-auto col-sm-4">
            <img src="content/icons/cryptoPurple.svg" className="pb-1"></img>
          </div>
          <div className="col-md-auto col-sm-8">
            <a
              href={'https://ropsten.etherscan.io/tx/' + `${lastest.hash}`}
              target="_blank"
              style={{
                textDecoration: 'none',
              }}
            >
              {lastest.hash.slice(0, 20) + '...' + lastest.hash.slice(transaction.reverse()[0].hash.length - 20, lastest.hash.length)}
            </a>
          </div>
          <div className="col-md-auto col-sm-4 text-warning">{parseInt(lastest.value) / 1000000} USDC</div>
          <div className="col-md-auto col-sm-4 font-weight-bold">Lastest</div>
          <div className="col-md-auto col-sm-4 font-italic">Thank for great action!</div>
        </div>
      );
    } else return;
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
            <div className="col-md-1"></div>
            <div className="col-md-5 col-sm-12 pt-5 pl-5">
              <div className="h1">{data[0].attributes?.name}</div>
              <div className="">{data[0].attributes?.description}</div>
              <div className="h1">Campaign Start</div>
              <div>{new Date(parseInt(data[0].attributes?.endedAt)).toString()}</div>
              <div className=" font-weight-bold">{balanceOf} USD</div>
              <div>{Moralis.Units.FromWei(data[0].attributes.goal)}</div>
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
            <div className="col-md-6 donate">
              <div className="row justify-content-center">
                <div className="col-md-2 ml-5 mt-3">
                  <img src="content/icons/cryptoYellow.svg"></img>
                </div>
                <div className="col-md-2">
                  <img src="content/icons/qrCode.svg" alt="" />
                </div>
                <div className="col-md-4">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="h4">Amount</div>
                    {errors.amount && <p>{errors.amount.message}</p>}
                    <input
                      type="number"
                      //placeholder="Amount"
                      {...register('amount', {
                        required: 'Required',
                        min: {
                          value: 2,
                          message: 'Min is 2',
                        },
                      })}
                      style={{
                        borderRadius: '15px',
                        width: '100px',
                        height: '40px',
                      }}
                    />

                    <input
                      type="submit"
                      className="mt-2 ml-3"
                      style={{
                        borderRadius: '15px',
                        width: '100px',
                        height: '40px',
                        backgroundColor: '#21BF96',
                        color: 'white',
                        border: 'hidden',
                      }}
                    />
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-8 tran-lastest my-5">{lastestTxn()}</div>
            <div className="col-md-8 h1 text-center">Recent Donate</div>
            <div className="col-md-10">
              <Table responsive striped>
                <thead>
                  <tr>
                    <th className="hand">Txn Hash</th>
                    <th>Time</th>
                    <th className="hand">From</th>
                    <th className="hand">To</th>
                    <th className="hand">Value</th>
                    <th className="hand">Token</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction &&
                    transaction
                      .filter(item => item.from !== '0x95f82f63b1d3eb775e37d7d2e401700ff395128f')
                      .map((item, key) => (
                        <tr key={`${key}`}>
                          <th className="hand">
                            <a
                              href={'https://ropsten.etherscan.io/tx/' + `${item.hash}`}
                              target="_blank"
                              style={{
                                textDecoration: 'none',
                              }}
                            >
                              {item.hash.slice(0, 4) + '...' + item.hash.slice(item.hash.length - 4, item.hash.length)}
                            </a>
                          </th>
                          <th>{item.timeStamp}</th>
                          <th className="hand">{item.from}</th>
                          <th className="hand">{item.to}</th>
                          <th className="hand">{parseInt(item.value) / 1000000}</th>
                          <th className="hand">{item.tokenSymbol}</th>
                        </tr>
                      ))}
                </tbody>
              </Table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Campaign;
