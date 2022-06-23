import './campaign.scss';
import React, { useState, useEffect } from 'react';
import { convertDateTimeFromServer, convertDateTimeToServer, convertTimeStampToDate } from 'app/shared/util/date-utils';
// import { Table } from 'reactstrap';
import { Loading, CryptoCards, Table, Button } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery, useWeb3Transfer, useERC20Balances } from 'react-moralis';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { result } from 'lodash';
import { getEllipsisTxt, timeStampToDateTime } from 'app/web3utils';
import { useNotificationCustom } from 'app/web3utils/notification';
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
  const { data, error } = useMoralisQuery('Campaigns', query => query.contains('campaignAddress', id));
  const { Moralis, account } = useMoralis();
  const { fetch, error: error2, isFetching } = useWeb3Transfer();
  const contractProcessor = useWeb3ExecuteFunction();
  const { handleNewNotification } = useNotificationCustom();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });
  // const {
  //   register: register2,
  //   handleSubmit: handleSubmit2,
  //   formState: { errors: errors2 },
  // } = useForm({
  //   mode: 'onTouched',
  // });
  const onSubmit = async (data, e) => {
    console.log(data);
    console.log(parseInt(data.amount));
    await fetch({
      params: {
        type: 'erc20',
        amount: Moralis.Units.Token(data.amount, 6),
        receiver: `${id}`,
        contractAddress: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
      },
    })
      .then(res => {
        handleNewNotification('success', 'Contract is pending, please wait!');
      })
      .catch(err => {
        console.log(err);
        JSON.parse(JSON.stringify(error))?.error?.message
          ? JSON.parse(JSON.stringify(error))?.error?.message
          : JSON.parse(JSON.stringify(error))?.message;
      });

    e.target.reset();
  };
  useEffect(() => {
    const getBalanceOf = async () => {
      const data = await axios.get(
        `https://api-ropsten.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x07865c6E87B9F70255377e024ace6630C1Eaa37F&address=${id}&tag=latest&apikey=FH674SA8K1BFH2SFB7KXYZXFB5GS63IXM4`
      );
      if (data?.data?.result) {
        if (data?.data?.result == '0') {
          setBalanceOf(0);
        } else setBalanceOf(parseInt(data?.data?.result) / 1000000);
      }
    };

    getBalanceOf();
  }, []);

  useEffect(() => {
    const getTransaction = async () => {
      const data = await axios.get(
        `https://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=0x07865c6E87B9F70255377e024ace6630C1Eaa37F&address=${id}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=FH674SA8K1BFH2SFB7KXYZXFB5GS63IXM4`
      );
      if (data?.data?.result) {
        setTransaction(data?.data?.result);
      }
    };
    getTransaction();
  }, []);
  const lastestTxn = () => {
    if (transaction && transaction.length != 0) {
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
              {getEllipsisTxt(lastest.hash, 3)}
            </a>
          </div>
          <div className="col-md-auto col-sm-4 text-warning">{parseInt(lastest.value) / 1000000} USDC</div>
          <div className="col-md-auto col-sm-4 font-weight-bold">Lastest</div>
          <div className="col-md-auto col-sm-4 font-italic">Thank for great action!</div>
        </div>
      );
    } else
      return (
        <div className="row py-3 justify-content-center">
          <div className="col-md-auto col-sm-4 text-warning">No data</div>
        </div>
      );
  };
  const dataTable = transaction
    ? transaction
        .filter(item => item.from !== '0x95f82f63b1d3eb775e37d7d2e401700ff395128f')
        .map((item, key) => [
          <a
            href={'https://ropsten.etherscan.io/tx/' + `${item?.hash}`}
            target="_blank"
            style={{
              textDecoration: 'none',
            }}
          >
            {getEllipsisTxt(item.hash)}
          </a>,
          new Date(parseInt(item.timeStamp) * 1000).toString().slice(0, 25),
          getEllipsisTxt(item.from),
          getEllipsisTxt(item.to),
          parseInt(item?.value) / 1000000,
          item.tokenSymbol,
        ])
    : [];

  // const onSubmit2 = async data => {
  //   const options = {
  //     contractAddress: '0x8cCbC37eF5B63932E8703ECB0Efd30b8a670192F',
  //     functionName: 'withDraw2',
  //     abi: [
  //       {
  //         inputs: [
  //           {
  //             internalType: 'contract IERC20',
  //             name: 'token',
  //             type: 'address',
  //           },
  //           {
  //             internalType: 'uint256',
  //             name: 'amount',
  //             type: 'uint256',
  //           },
  //         ],
  //         name: 'withDraw2',
  //         outputs: [],
  //         stateMutability: 'nonpayable',
  //         type: 'function',
  //       },
  //     ],
  //     params: {
  //       token: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  //       amount: parseInt(data.amount) * 1000000,
  //     },
  //   };
  //   console.log(options);
  //   await contractProcessor.fetch({
  //     params: options,
  //     onSuccess: res => {
  //       console.log('Success');
  //       handleNewNotification('success', 'Contract is pending, please wait!');
  //     },
  //     onError: error => {
  //       console.log();
  //       JSON.parse(JSON.stringify(error))?.error?.message
  //         ? JSON.parse(JSON.stringify(error))?.error?.message
  //         : JSON.parse(JSON.stringify(error))?.message;
  //     },
  //   });
  // };
  const withDraw = async () => {
    const options = {
      contractAddress: '0x8cCbC37eF5B63932E8703ECB0Efd30b8a670192F',
      functionName: 'withDraw2',
      abi: [
        {
          inputs: [
            {
              internalType: 'contract IERC20',
              name: 'token',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'withDraw2',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      params: {
        token: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
        amount: balanceOf * 1000000,
      },
    };
    console.log(options);
    await contractProcessor.fetch({
      params: options,
      onSuccess: res => {
        console.log('Success');
        handleNewNotification('success', 'Contract is pending, please wait!');
      },
      onError: error => {
        console.log();
        JSON.parse(JSON.stringify(error))?.error?.message
          ? JSON.parse(JSON.stringify(error))?.error?.message
          : JSON.parse(JSON.stringify(error))?.message;
      },
    });
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
          <div className="row  justify-content-center main mt-5">
            <div className="col-md-3"></div>
            <div className="col-md-4 col-sm-12 pl-5">
              <div className="h1">{data[0].attributes?.name.toString()}</div>
              <div className="h3">{data[0].attributes?.description}</div>
              {/* <div className="h1">Campaign Start</div> */}
              <div className="h1">
                {new Date().getTime() > parseInt(data[0].attributes?.endTime) * 1000 ? 'Campaign End' : 'In Progress'}
              </div>
              <div>{new Date(parseInt(data[0].attributes?.endTime) * 1000).toString().slice(0, 25)}</div>
              <div className=" font-weight-bold h3">{balanceOf ? balanceOf : 0} USD</div>
              <div className="h3">{parseInt(data[0].attributes.goal) / 1000000} USD</div>
            </div>
            <div className="col-md-5 col-sm-12">
              <img
                style={{
                  //maxWidth: '50%',
                  height: 'auto',
                }}
                alt=""
                src={`${data[0].attributes?.coverImgUrl}`}
              ></img>
            </div>
            {data[0].attributes?.creator === account && (
              <>
                <div className="col-md-5"></div>
                <div className="col-md-7 ">
                  <Button
                    id="test-button-primary"
                    onClick={() => {
                      history.push('/email/new-camp');
                    }}
                    text="Send Email For Vip User"
                    theme="primary"
                    type="button"
                    size="large"
                  ></Button>
                </div>
              </>
            )}
            <div className="col-md-6 donate mt-5">
              <div className="row justify-content-center">
                <div className="col-md-3 mt-3 text-center">
                  <img src="content/icons/cryptoYellow.svg"></img>
                </div>
                <div className="col-md-4 text-center">
                  <img src="content/icons/qrCode.svg" alt="" />
                </div>
                <div className="col-md-5 text-center">
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

                    <button
                      type="submit"
                      className="mt-2"
                      style={{
                        borderRadius: '15px',
                        width: '100px',
                        height: '40px',
                        backgroundColor: '#21BF96',
                        color: 'white',
                        border: 'hidden',
                        marginLeft: '20px',
                      }}
                      disabled={new Date().getTime() > parseInt(data[0].attributes?.endTime) * 1000}
                    >
                      Donate
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-8 tran-lastest my-5">{lastestTxn()}</div>
            <div className="col-md-8 h1 text-center">Recent Donate</div>
            <div className="col-md-8">
              <Table
                columnsConfig="2fr 3fr 2fr 2fr 2fr 2fr"
                data={dataTable}
                header={[
                  <span>TxT Hash</span>,
                  <span>Time</span>,
                  <span>From</span>,
                  <span>To</span>,
                  <span>Value</span>,
                  <span>Token</span>,
                ]}
                maxPages={3}
                onPageNumberChanged={function noRefCheck() {}}
                pageSize={10}
              />
            </div>
            {data[0].attributes?.creator === account && (
              <div className="col-md-6 donate mt-5">
                <div className="row justify-content-center">
                  <div className="col-md-3 mt-3 text-center">
                    <img src="content/icons/cryptoYellow.svg"></img>
                  </div>
                  <div className="col-md-4 text-center">
                    <img src="content/icons/qrCode.svg" alt="" />
                  </div>
                  <div className="col-md-5 text-center mt-4">
                    {/* <form onSubmit={handleSubmit2(onSubmit2)}>
                      <div className="h4">Amount</div>
                      {errors2.amount && <p>{errors2.amount.message}</p>}
                      <input
                        type="number"
                        //placeholder="Amount"
                        {...register2('amount', {
                          required: 'Required',
                          min: {
                            value: 1,
                            message: 'Min is 1',
                          },
                          max: {
                            value: balanceOf,
                            message: `Min is ${balanceOf} `,
                          },
                        })}
                        style={{
                          borderRadius: '15px',
                          width: '100px',
                          height: '40px',
                        }}
                      />

                      <button
                        type="submit"
                        className="mt-2"
                        style={{
                          borderRadius: '15px',
                          width: '100px',
                          height: '40px',
                          backgroundColor: '#21BF96',
                          color: 'white',
                          border: 'hidden',
                          marginLeft: '20px',
                        }}
                      >
                        With Draw
                      </button>
                    </form> */}
                    <Button
                      id="test-button-primary"
                      onClick={() => withDraw()}
                      text="With Draw"
                      theme="primary"
                      type="button"
                      size="large"
                    ></Button>
                  </div>
                </div>
              </div>
            )}
            {new Date().getTime() > parseInt(data[0].attributes?.endTime) * 1000 && (
              <div className="col-md-8 mt-5">
                <Table
                  columnsConfig="2fr 3fr 2fr 2fr 2fr 2fr"
                  data={[]}
                  header={[
                    <span>TxT Hash</span>,
                    <span>Time</span>,
                    <span>From</span>,
                    <span>To</span>,
                    <span>Value</span>,
                    <span>Token</span>,
                  ]}
                  maxPages={3}
                  onPageNumberChanged={function noRefCheck() {}}
                  pageSize={10}
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Campaign;
