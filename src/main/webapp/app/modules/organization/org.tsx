import React, { useEffect, useState } from 'react';
import { getEllipsisTxt } from 'app/web3utils';
import { useNotificationCustom } from 'app/web3utils/notification';
import axios from 'axios';
import { ethers } from 'ethers';
import { Controller, useForm } from 'react-hook-form';
import { translate } from 'react-jhipster';
import { useMoralis, useMoralisQuery, useWeb3Transfer } from 'react-moralis';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Input, Loading, Table } from 'web3uikit';
import * as cam from '../contract/campaign.json';
import * as usdcabi from '../contract/USDT.json';
import * as org from '../contract/Organization.json';
import CreateProposal from './create-proposal';
import Proposal from './proposal';
import * as orgabi from '../contract/Organization.json';
interface transactionType {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  tokenSymbol: string;
}
interface ProposalType {
  description: string;
  amount: number;
  deadline: number;
  endPrice: number;
  id: number;
  isProposalForNFT: boolean;
  passed: boolean;
  startingPrice: number;
  status: number;
  token: string;
  votesDown: number;
  votesUp: number;
}
const Organization = () => {
  const { id } = useParams<{ id: string }>();
  const [balanceOf, setBalanceOf] = useState<number>(0);
  const [transaction, setTransaction] = useState<transactionType[]>();
  const { data, error } = useMoralisQuery('Orgss', query => query.contains('OrganizationAddress', id));
  const { Moralis, account, isInitialized } = useMoralis();
  const { fetch, error: error2, isFetching } = useWeb3Transfer();
  const { handleNewNotification } = useNotificationCustom();
  const [sub, setSub] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposal, setProposal] = useState<ProposalType>();
  const history = useHistory();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  var count;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    mode: 'onTouched',
  });

  const onSubmit = async (data, e) => {
    const USDT = new ethers.Contract('0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684', usdcabi.abi, provider.getSigner());
    try {
      const transaction = await USDT.transfer(id, Moralis.Units.Token(data.amount, 18));
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        console.log(res);
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for your donation!`);
        setSub(!sub);
      }
      reset();
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
    if (isInitialized) {
      const getTransaction = async () => {
        const data = await axios.get(
          `https://api-testnet.bscscan.com/api?module=account&action=tokentx&contractaddress=0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684&address=${id}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=FH674SA8K1BFH2SFB7KXYZXFB5GS63IXM4`
        );
        if (data?.data?.result) {
          setTransaction(data?.data?.result);
        }
      };

      const getBalanceOf = async () => {
        const data = await axios.get(
          `https://api-testnet.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684&address=${id}&tag=latest&apikey=FH674SA8K1BFH2SFB7KXYZXFB5GS63IXM4`
        );
        if (data?.data?.result) {
          if (data?.data?.result == '0') {
            setBalanceOf(0);
          } else {
            setBalanceOf(parseInt(data?.data?.result) / 1000000000000000000);
          }
        }
      };
      const getProposal = async () => {
        const Organization = new ethers.Contract(id, org.abi, provider.getSigner(account));
        const res = await Organization.nextProposal();
        console.log(res);
        count = parseInt(res._hex, 16);
        console.log(count);
        if (count == 1) {
          setProposal({
            description: '',
            amount: 0,
            deadline: 123,
            endPrice: 0,
            id: 1,
            isProposalForNFT: false,
            passed: false,
            startingPrice: 0,
            status: 2,
            token: '',
            votesDown: 0,
            votesUp: 0,
          });
        } else {
          const proposalList = [...Array(count - 1).keys()];
          console.log(proposalList);
          Promise.allSettled(proposalList.map(async item => await Organization.Proposals(item + 1))).then(values => {
            console.log(values);
            setProposal(
              values
                .filter(item => item.status == 'fulfilled')
                .map(item => item?.value)
                .map(item => {
                  const obj = {
                    description: item?.description,
                    amount: parseInt(item?.amount._hex, 16),
                    deadline: parseInt(item?.deadline._hex, 16),
                    endPrice: parseInt(item?.endPrice._hex, 16),
                    id: parseInt(item?.id._hex, 16),
                    isProposalForNFT: item?.isProposalForNFT,
                    passed: item?.passed,
                    startingPrice: parseInt(item?.startingPrice._hex, 16),
                    status: parseInt(item?.status._hex, 16),
                    token: item?.token,
                    votesDown: parseInt(item?.votesDown._hex, 16),
                    votesUp: parseInt(item?.votesUp._hex, 16),
                  };
                  return obj;
                })[count - 2]
            );
          });
        }
      };
      getTransaction();
      getBalanceOf();
      getProposal();
    }
  }, [isInitialized, sub]);
  const lastestTxn = () => {
    if (transaction && transaction.length != 0) {
      const lastest = transaction.filter(item => item.from !== id).reverse()[0];
      return (
        <div className="row py-3 justify-content-center">
          <div className="col-md-auto col-sm-4">
            <img src="content/icons/cryptoPurple.svg" className="pb-1"></img>
          </div>
          <div className="col-md-auto col-sm-8">
            <a
              href={'https://testnet.bscscan.com/tx/' + `${lastest.hash}`}
              target="_blank"
              style={{
                textDecoration: 'none',
              }}
            >
              {getEllipsisTxt(lastest.hash, 3)}
            </a>
          </div>
          <div className="col-md-auto col-sm-4 text-warning">{parseInt(lastest.value) / 1000000000000000000} USDT</div>
          <div className="col-md-auto col-sm-4 font-weight-bold">Lastest</div>
          <div className="col-md-auto col-sm-4 font-italic">Thank for great action!</div>
        </div>
      );
    } else
      return (
        <div className="row py-3 justify-content-center">
          <div className="col-md-auto col-sm-4 text-warning">{translate('campaign.crypto.no')}</div>
        </div>
      );
  };
  const dataTable = transaction
    ? transaction
        .filter(item => item.from != id)
        .map((item, key) => [
          <a
            href={'https://testnet.bscscan.com/tx/' + `${item?.hash}`}
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
          parseInt(item?.value) / 1000000000000000000,
          item.tokenSymbol,
        ])
    : [];
  const withDrawDataTable = transaction
    ? transaction
        .filter(item => item.from == id)
        .map((item, key) => [
          <a
            href={'https://testnet.bscscan.com/tx/' + `${item?.hash}`}
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
          parseInt(item?.value) / 1000000000000000000,
          item.tokenSymbol,
        ])
    : [];
  const countVote = async () => {
    try {
      const Organization = new ethers.Contract(id, orgabi.abi, provider.getSigner(account));
      var transaction;
      if (new Date().getTime() > proposal.deadline * 1000) {
        transaction = await Organization.countVoteWithEndTime(proposal.id);
      } else {
        transaction = await Organization.countVoteBeforeEnd(proposal.id);
      }
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      console.log(provider.getSigner());
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for your donation!`);
        setSub(!sub);
      }
      reset();
    } catch (error: any) {
      console.log(JSON.parse(JSON.stringify(error)));
      handleNewNotification(
        'error',
        JSON.parse(JSON.stringify(error))?.error?.message
          ? JSON.parse(JSON.stringify(error))?.error?.message
          : JSON.parse(JSON.stringify(error))?.message
      );
      reset();
    }
  };
  const withDraw = async () => {
    try {
      const Organization = new ethers.Contract(id, orgabi.abi, provider.getSigner(account));
      const transaction = await Organization.withDraw(proposal.id);
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      console.log(provider.getSigner());
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for your donation!`);
        setSub(!sub);
      }
      // reset();
    } catch (error: any) {
      console.log(JSON.parse(JSON.stringify(error)));
      handleNewNotification(
        'error',
        JSON.parse(JSON.stringify(error))?.error?.message
          ? JSON.parse(JSON.stringify(error))?.error?.message
          : JSON.parse(JSON.stringify(error))?.message
      );
      // reset();
    }
  };
  if (!data) {
    return <div>No Response</div>;
  }

  if (proposal) {
    console.log(proposal);
    console.log(proposal.status == 0);
    console.log(new Date().getTime() < proposal.deadline * 1000);
  }
  return (
    <>
      {data.length === 0 ? (
        <div
          style={{
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <Loading />
        </div>
      ) : (
        <>
          <div className="row  justify-content-center main mt-5">
            <div className="col-md-4 col-sm-12 pl-5">
              <div className="h1">{data[0].attributes?.name.toString()}</div>
              <div className="h3">{data[0].attributes?.description}</div>
              <div className=" font-weight-bold h3">
                {translate('campaign.crypto.balance') + ': '}
                {balanceOf} USD
              </div>
              <div>
                {proposal && (proposal.status == 2 || (proposal.status == 1 && proposal.passed != true)) && (
                  <Button
                    id="test-button-primary"
                    onClick={() => setShowModal(true)}
                    text={translate('org.create')}
                    theme="primary"
                    type="button"
                    size="large"
                  ></Button>
                )}
              </div>
            </div>
            <div className="col-md-5 col-sm-12">
              <img
                style={{
                  width: '400px',
                  height: '250px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                }}
                alt=""
                src={`${data[0].attributes?.coverImgUrl}`}
              ></img>
            </div>
          </div>
          {/* {
              <>
                <div className="col-md-5"></div>
                <div className="col-md-7 ">
                  <Button
                    id="test-button-primary"
                    onClick={() => {
                      history.push('/email/new-camp');
                    }}
                    text={translate('campaign.crypto.email')}
                    theme="primary"
                    type="button"
                    size="large"
                    // disabled={isEnd}
                  ></Button>
                </div>
              </>
            } */}
          <div className="row  justify-content-center main mt-2">
            <div className="col-md-9 donate mt-5">
              {proposal && proposal.status != 2 && (
                <Table
                  columnsConfig="0.5fr 2fr 0.5fr 0.75fr 0.75fr 1fr 1fr 1.5fr"
                  data={[
                    [
                      proposal.id,
                      proposal.description,
                      proposal.amount / 1000000000000000000,
                      proposal.votesUp,
                      proposal.votesDown,
                      proposal.status == 0 && new Date().getTime() < proposal.deadline * 1000
                        ? `${translate('org.ongoing')}`
                        : proposal.status == 1
                        ? proposal.passed
                          ? `${translate('org.true')}`
                          : `${translate('org.false')}`
                        : `${translate('org.wait-count')}`,
                      <Button
                        id="test-button-primary"
                        onClick={() => setShowProposalModal(true)}
                        text={translate('org.vote')}
                        theme="primary"
                        type="button"
                        size="large"
                        disabled={proposal.status != 0}
                      ></Button>,
                      proposal.status == 0 ? (
                        <Button
                          id="test-button-primary"
                          onClick={() => countVote()}
                          text={translate('org.count')}
                          theme="primary"
                          type="button"
                          size="large"
                        ></Button>
                      ) : (
                        <Button
                          id="test-button-primary"
                          onClick={() => withDraw()}
                          text={translate('org.implement')}
                          theme="primary"
                          type="button"
                          size="large"
                          disabled={proposal.status == 2 || proposal.passed != true}
                        ></Button>
                      ),
                    ],
                  ]}
                  header={[
                    <span>ID</span>,
                    <span>{translate('org.des')}</span>,
                    <span>{translate('org.value')}</span>,
                    <span>{translate('org.up')}</span>,
                    <span>{translate('org.down')}</span>,
                    <span>{translate('org.status')}</span>,
                  ]}
                  maxPages={3}
                  noPagination
                  onPageNumberChanged={function noRefCheck() {}}
                  onRowClick={function noRefCheck() {}}
                  pageSize={5}
                />
              )}
            </div>
          </div>
          <div className="row  justify-content-center main mt-2">
            <div className="col-md-6 donate mt-5">
              <div className="row justify-content-center">
                <div className="col-md-3 mt-4 text-center">
                  <img src="content/icons/cryptoYellow.svg"></img>
                </div>
                <div className="col-md-4 text-center mt-2">
                  <img src="content/icons/qrCode.svg" alt="" />
                </div>
                <div className="col-md-4 justify-content-center ">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div
                      style={{
                        width: '150px',
                      }}
                    >
                      <Controller
                        name="amount"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            name={field.name}
                            value={field.value}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            label={translate('campaign.crypto.amount')}
                            validation={{
                              required: true,
                              numberMin: 2,
                            }}
                            type="number"
                            style={{
                              marginTop: '30px',
                            }}
                          />
                        )}
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-3 mb-1 "
                      style={{
                        borderRadius: '15px',
                        width: '100px',
                        height: '40px',
                        backgroundColor: '#21BF96',
                        color: 'white',
                        border: 'hidden',
                        marginLeft: '20px',
                        fontWeight: 'bold',
                        // opacity: `${isEnd ? '50%' : 'none'}`,
                      }}
                      // disabled={isEnd}
                    >
                      {translate('org.donate')}{' '}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row  justify-content-center main mt-3">
            <div className="col-md-8 tran-lastest my-5">{lastestTxn()}</div>
          </div>
          <div className="row  justify-content-center main mt-3">
            <div className="col-md-8 h4 text-center mt-5">{translate('campaign.crypto.recent')}</div>
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
          </div>
          {/* <div className="row  justify-content-center main mt-3">
            <div className="col-md-6 donate mt-5">
              <div className="row justify-content-center">
                <div className="col-md-3 mt-3 text-center">
                  <img src="content/icons/cryptoYellow.svg"></img>
                </div>
                <div className="col-md-4 text-center">
                  <img src="content/icons/qrCode.svg" alt="" />
                </div>
                <div className="col-md-5 text-center mt-4">
                  {withDrawDataTable.length == 0 ? (
                    <Button
                      id="test-button-primary"
                      onClick={() => withDraw()}
                      text="With Draw"
                      theme="primary"
                      type="button"
                      size="large"
                    ></Button>
                  ) : (
                    <Button
                      id="test-button-primary"
                      //onClick={}
                      text="Drawed"
                      theme="primary"
                      type="button"
                      size="large"
                      disabled={true}
                    ></Button>
                  )}
                </div>
              </div>
            </div>
          </div> */}
          <div className="row  justify-content-center main mt-3">
            <div className="col-md-8 h4 text-center mt-5">{translate('org.implement-history')}</div>
            <div className="col-md-8">
              <Table
                columnsConfig="2fr 3fr 2fr 2fr 2fr 2fr"
                data={withDrawDataTable}
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
          </div>
          <div>
            {showModal && (
              <CreateProposal
                setShowModal={setShowModal}
                transaction={transaction}
                sub={sub}
                setSub={setSub}
                balanceOf={balanceOf && balanceOf}
                creator={data[0].attributes?.creator.toString()}
              />
            )}
          </div>
          <div>
            {showProposalModal && <Proposal setShowProposalModal={setShowProposalModal} sub={sub} setSub={setSub} proposal={proposal} />}
          </div>
        </>
      )}
    </>
  );
};

export default Organization;
