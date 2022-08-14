import { Radios } from 'app/components/Radios';
import { useNotificationCustom } from 'app/web3utils/notification';
import { ethers } from 'ethers';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { translate } from 'react-jhipster';
import { useMoralis } from 'react-moralis';
import { useHistory, useParams } from 'react-router-dom';
import { Input, Modal, Skeleton } from 'web3uikit';
import * as abi from '../contract/Organization.json';

interface IProposalProps {
  setShowProposalModal: (e: boolean) => void;
  setSub: (e: boolean) => void;
  sub: boolean;
  proposal: ProposalType;
}
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
const Proposal: React.FC<IProposalProps> = ({ setShowProposalModal, proposal, sub, setSub }) => {
  const { id } = useParams<{ id: string }>();
  const { handleNewNotification } = useNotificationCustom();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
    getValues,
    control,
  } = useForm({
    mode: 'onTouched',
  });

  const { Moralis, account, isInitialized } = useMoralis();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const history = useHistory();
  const onSubmit = async (data, e) => {
    console.log(data.vote == '0' ? true : false);
    try {
      const Organization = new ethers.Contract(id, abi.abi, provider.getSigner(account));
      const transaction = await Organization.voteOnProposal(proposal.id, data.vote == '0' ? true : false);
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
  if (!proposal) {
    <Modal
      isVisible
      isCentered
      hasFooter={false}
      headerHasBottomBorder={false}
      title="Vote on Proposal"
      onCloseButtonPressed={() => setShowProposalModal(false)}
    >
      <></>
    </Modal>;
  }
  return (
    <Modal
      isVisible
      isCentered
      hasFooter={false}
      headerHasBottomBorder={false}
      title="Vote on Proposal"
      onCloseButtonPressed={() => setShowProposalModal(false)}
    >
      <div className="row ">
        <div className="col-md-4 col-sm-12">
          <img
            style={{
              maxWidth: '90%',
              height: 'auto',
            }}
            alt=""
            src="content/images/bluezoneApp.png"
          ></img>
        </div>
        <div className="col-md-8 col-sm-12 mt-2 mb-3">
          <div className="h4 font-weight-bold">Vote on Proposal #{proposal.id}</div>
          <div className="">{proposal.description}</div>
          <div className="">Withdraw Value {proposal.amount / 1000000000000000000} USD</div>
          <div>For: {proposal.votesUp}</div>
          <span>Against: {proposal.votesDown}</span>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-3">
              <Controller
                name="vote"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Radios
                    id="radios2"
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    items={['For', 'Against']}
                    title="Your choice"
                    validation={{
                      required: true,
                    }}
                  />
                )}
              />
            </div>

            <button
              type="submit"
              className="mt-4"
              style={{
                borderRadius: '15px',
                width: '100px',
                height: '40px',
                backgroundColor: '#21BF96',
                color: 'white',
                border: 'hidden',
              }}
            >
              Vote
            </button>
            <button
              type="reset"
              className=" ml-2 mt-4"
              style={{
                borderRadius: '15px',
                width: '100px',
                height: '40px',
                backgroundColor: 'red',
                color: 'white',
                border: 'hidden',
              }}
            >
              {translate('campaign.nft.mint.clear')}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default Proposal;
