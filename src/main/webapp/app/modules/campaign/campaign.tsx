import './campaign.scss';
import React, { useState, useEffect } from 'react';
import { convertDateTimeFromServer, convertDateTimeToServer, convertTimeStampToDate } from 'app/shared/util/date-utils';
import { Table } from 'reactstrap';
import { Loading, CryptoCards } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery, useWeb3Transfer } from 'react-moralis';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Campaign = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error } = useMoralisQuery('Campaign', query => query.contains('uid', id));
  const { Moralis } = useMoralis();
  const { fetch, error: error2, isFetching } = useWeb3Transfer();
  const contractProcessor = useWeb3ExecuteFunction();

  const Web3Api = useMoralisWeb3Api();
  const [price, setPrice] = useState<number>();
  const transactions = [
    {
      _id: '618d4d66a193433621496d0b',
      sourceAddress: '0xccedfeb67e2aca552deccfca220da7ec11b9f7c7',
      walletId: '618d4d64a193433621496d00',
      description: 'At quae nobis sit beatae distinctio repellendus cupiditate.',
      currency: 'ETH',
      amount: 0.0000699,
      status: '1',
      networkFee: 0.0001271,
      transactionId: '0xa743Cbfc7f594A78ff08d4F9Aaad7EaB9458Ebd8d77e2aeFFAFcFF0EC18C8b1a',
      createdAt: 1636650342324,
    },
    {
      _id: '618d4d66a193433621496d0a',
      sourceAddress: '0xcecdc86e5d386eef88cf0c8a020390bcab242026',
      walletId: '618d4d64a193433621496d00',
      description: 'Minus ullam nemo quaerat quia.',
      currency: 'ETH',
      amount: 0.0000899,
      status: '1',
      networkFee: 0.0000896,
      transactionId: '0xd07Ad76AE0FD1dDEc3de8BEB6c8C5cf0fEadDa50FCB8A6D9b7AFd9f0ba7ADcf9',
      createdAt: 1636650342174,
    },
    {
      _id: '618d4d66a193433621496d09',
      sourceAddress: '0xfac0be4b16f64caddb03b9cb9cdccf0fdbaaeb52',
      walletId: '618d4d64a193433621496d00',
      description: 'Possimus aliquid consequatur error ea iusto.',
      currency: 'ETH',
      amount: 0.0000668,
      status: '1',
      networkFee: 0.0000731,
      transactionId: '0xcCe93fF4dfE80b14Eb0b23d3C73859dDE814B0FADCb9c71f880CcEf4ed1bE0ac',
      createdAt: 1636650342029,
    },
    {
      _id: '618d4d65a193433621496d08',
      sourceAddress: '0xfd1fabf448dbec3ddd5f7fee8d31dcebe2828f22',
      walletId: '618d4d64a193433621496d00',
      description: 'Voluptatem reiciendis debitis consequatur facilis quia eveniet natus.',
      currency: 'ETH',
      amount: 0.0001224,
      status: '1',
      networkFee: 0.0000876,
      transactionId: '0xf483CD8F0a070A9bD4FEbD6beEE5a7F527cfcc3e0eDDf6ab79FADdB8faf95f37',
      createdAt: 1636650341885,
    },
    {
      _id: '618d4d65a193433621496d07',
      sourceAddress: '0xdbdf5aacfcbc46adc8eeaa27dc04bd83e28ee2ad',
      walletId: '618d4d64a193433621496d00',
      description: 'Voluptate enim nulla.',
      currency: 'ETH',
      amount: 0.0000613,
      status: '1',
      networkFee: 0.0000813,
      transactionId: '0x71baceC5CCCacFD3F65eA7DaE9FdD5B5d6766A3F79856Eda4CDF4af3d3C0EFb9',
      createdAt: 1636650341526,
    },
    {
      _id: '618d4d65a193433621496d06',
      sourceAddress: '0xd94308dc5ea3882eb8bbb5830a63217d9db0cdfa',
      walletId: '618d4d64a193433621496d00',
      description: 'Doloribus quisquam accusantium voluptatem qui sed qui.',
      currency: 'ETH',
      amount: 0.000107,
      status: '1',
      networkFee: 0.0000994,
      transactionId: '0xcDb51FF0E8bEeE7dcE2FE37eB7B0DBbAcdea5CF53D9c0Feed4322Fa6CA5ff8a1',
      createdAt: 1636650341224,
    },
    {
      _id: '618d4d65a193433621496d05',
      sourceAddress: '0x8c0ad0fa72d3835cc0d4f58aaf06aeddedefc7aa',
      walletId: '618d4d64a193433621496d00',
      description: 'Et quia sit inventore labore qui.',
      currency: 'ETH',
      amount: 0.0000295,
      status: '1',
      networkFee: 0.0001489,
      transactionId: '0xfd2ACC3A0a6ded36daBE5C6a0dBE1Fb5e1C7Cd2Ea59D3ED4626ca7C4FEFf09AE',
      createdAt: 1636650341074,
    },
    {
      _id: '618d4d64a193433621496d04',
      sourceAddress: '0x82f41a81a31ae4eab1c63c7b18da2b29cec1b0fb',
      walletId: '618d4d64a193433621496d00',
      description: 'Minus dolorum optio culpa officiis reiciendis.',
      currency: 'ETH',
      amount: 0.0000186,
      status: '1',
      networkFee: 0.0000833,
      transactionId: '0x8a2cCb30A9AeFC34CEaC4Db93F0d6A4eac2F82e20EAEe4a32864cEa24fcbb6Ac',
      createdAt: 1636650340925,
    },
    {
      _id: '618d4d64a193433621496d03',
      sourceAddress: '0x888dcda14fde59fff57611aa9ab5965300ee0eae',
      walletId: '618d4d64a193433621496d00',
      description: 'Adipisci sit eaque non debitis.',
      currency: 'ETH',
      amount: 0.0000311,
      status: '1',
      networkFee: 0.0000561,
      transactionId: '0xCDA79b8CF5F4c12Fe83bcfCDbDD7aDFFd6c0c3cf389258B12A19F8b2dDcb4fD6',
      createdAt: 1636650340778,
    },
    {
      _id: '618d4d64a193433621496d02',
      sourceAddress: '0x1b3916cb8cbf6906b27218113ef2649182febe29',
      walletId: '618d4d64a193433621496d00',
      description: 'Rerum rerum omnis ut dicta sed quae.',
      currency: 'ETH',
      amount: 0.000081,
      status: '1',
      networkFee: 0.0001226,
      transactionId: '0x2A1cFc4c1b10c61BFA2bA1cb6BCDd972D48b92ad06bfc0D3de65C964F8fa360c',
      createdAt: 1636650340626,
    },
    {
      _id: '618d4d64a193433621496d01',
      sourceAddress: '0x8bdeb64e0a1f14d292ba358c6e5516aedc12b91c',
      walletId: '618d4d64a193433621496d00',
      description: 'Ipsam molestiae quaerat.',
      currency: 'ETH',
      amount: 0.0001125,
      status: '1',
      networkFee: 0.0000715,
      transactionId: '0xbc2DDFe7A68AA8bc38bfF7ee2cedEdDbf7B799A63434eae2fE38B63a42F9D9c5',
      createdAt: 1636650340486,
    },
  ];
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
        receiver: id,
        contractAddress: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
      },
    });

    e.target.reset();
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
              <div>{new Date(parseInt(data[0].attributes?.startedAt)).toString()}</div>
              <div>{data[0].attributes.total}</div>
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
            <div className="col-md-8 tran-lastest my-5">
              <div className="row py-3 justify-content-center">
                <div className="col-md-auto col-sm-4">
                  <img src="content/icons/cryptoPurple.svg" className="pb-1"></img>
                </div>
                <div className="col-md-auto col-sm-8">0x6C35Bae9EC2C7Bbbb366AD5008444A6D354334ee</div>
                <div className="col-md-auto col-sm-4 text-warning">10 ETH</div>
                <div className="col-md-auto col-sm-4 font-weight-bold">Lastest</div>
                <div className="col-md-auto col-sm-4 font-italic">Thank for great action!</div>
              </div>
            </div>
            <div className="col-md-8 h1 text-center">Recent Donate</div>
            <div className="col-md-10">
              <Table responsive striped>
                <thead>
                  <tr>
                    <th className="hand">
                      ID
                      {/* <FontAwesomeIcon icon="sort" /> */}
                    </th>
                    <th className="hand">
                      Wallet Address
                      {/* <FontAwesomeIcon icon="sort" /> */}
                    </th>
                    <th className="hand">
                      Amount
                      {/* <FontAwesomeIcon icon="sort" /> */}
                    </th>
                    {/* <th /> */}
                    <th>Sent Date</th>
                    <th className="hand">
                      Description
                      {/* <FontAwesomeIcon icon="sort" /> */}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((item, i) => (
                    <tr id={item._id} key={`user-${i}`}>
                      <td>
                        <button color="link">{item._id}</button>
                      </td>
                      <td>{item.sourceAddress}</td>
                      <td>{item.amount}</td>
                      <td>{convertDateTimeFromServer(item.createdAt)}</td>
                      <td>{item.description}</td>
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
