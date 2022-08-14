import { Radios } from 'app/components/Radios';
import { useNotificationCustom } from 'app/web3utils/notification';
import { ethers } from 'ethers';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { translate } from 'react-jhipster';
import { useMoralis } from 'react-moralis';
import { useHistory, useParams } from 'react-router-dom';
import { Input, Modal } from 'web3uikit';
import * as abi from '../contract/Organization.json';

interface ICreateProposalProps {
  setShowModal: (e: boolean) => void;
  setSub: (e: boolean) => void;
  sub: boolean;
  transaction: transactionType[];
  balanceOf: number;
  creator?: string;
}
interface transactionType {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  tokenSymbol: string;
}
const CreateProposal: React.FC<ICreateProposalProps> = ({ setShowModal, transaction, sub, setSub, balanceOf, creator }) => {
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
  console.log(creator);
  if (transaction) {
    console.log(transaction.map(item => item.from));
  }
  const { Moralis, account, isInitialized } = useMoralis();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const history = useHistory();
  const onSubmit = async (data, e) => {
    const obj = {
      des: data?.des,
      canVote: transaction.map(item => item.from),
      token: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
      amount: Moralis.Units.Token(data.value, 18),
      endTime: parseInt(data?.endTime) + 1,
      NFT: false,
      startingPrice: 0,
      endPrice: 0,
    };
    console.log(data);
    console.log(obj);
    console.log(['0x6fD11ff94Ca57389F3bDe9036127404F4D82b81d', '0x8194589111EEbFa77CdB9BF37F07E066fCB5C543']);
    try {
      function onlyUnique(value, index, self) {
        console.log(self.indexOf(value));
        console.log(self.indexOf(value) === index);
        return self.indexOf(value) === index;
      }
      var canVote = transaction.filter(item => item.from != id).map(item => item.from);
      creator ? canVote.push(creator) : '';
      canVote = canVote.filter(onlyUnique);
      console.log(id);
      console.log(canVote);
      const Organization = new ethers.Contract(id, abi.abi, provider.getSigner(account));
      console.log(Organization);
      const transaction2 = await Organization.createProposal(
        data?.des,
        canVote,
        '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
        Moralis.Units.Token(data?.value, 18),
        parseInt(data?.endTime) + 1,
        false,
        0,
        0
      );
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      console.log(provider.getSigner());
      const res = await transaction2.wait();
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
    }
  };
  console.log(balanceOf);
  if (balanceOf) {
    console.log(balanceOf);
  }
  return (
    <Modal
      isVisible
      isCentered
      hasFooter={false}
      headerHasBottomBorder={false}
      title={translate('org.create')}
      onCloseButtonPressed={() => setShowModal(false)}
    >
      <div className="row ">
        <div className="col-md-5 col-sm-12">
          <img
            style={{
              maxWidth: '90%',
              height: 'auto',
            }}
            alt=""
            src="content/images/bluezoneApp.png"
          ></img>
        </div>
        <div className="col-md-7 col-sm-12 mt-2 mb-3">
          <div className="h4 font-weight-bold">{translate('org.create')}</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="des"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  label={translate('campaign.crypto.des')}
                  validation={{
                    required: true,
                    characterMinLength: 5,
                    characterMaxLength: 200,
                    // regExp: '^[^@s]+@[^@s]+.[^@s]+$',
                    // regExpInvalidMessage: 'That is not a valid email address',
                  }}
                  type="text"
                  style={{
                    marginTop: '30px',
                  }}
                />
              )}
            />

            <Controller
              name="value"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  label="Value"
                  validation={{
                    required: true,
                    numberMin: 1,
                    numberMax: balanceOf,
                  }}
                  type="number"
                  style={{
                    marginTop: '30px',
                  }}
                />
              )}
            />

            <div className="mt-3">
              <Controller
                name="endTime"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Radios
                    id="radios2"
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    items={['1 days', '2 days', '3 days']}
                    title={translate('org.time')}
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
              {translate('campaign.nft.mint.create')}
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

export default CreateProposal;
