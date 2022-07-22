import React, { useState, useRef, useEffect, useContext } from 'react';
import { Translate, translate } from 'react-jhipster';
import './create-campaign.scss';
import { Avatar, Button, Icon, Input, Table, Tag, useNotification } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from 'react-moralis';
import { defaultImgs } from '../../shared/util/defaultImgs';
import { messages } from 'app/config/constants';
import { IPosition, notifyType } from 'web3uikit/dist/components/Notification/types';
import { TIconType } from 'web3uikit/dist/components/Icon/collection';
import { Link, useLocation } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { AppContext } from 'app/provider/appContext';
import { NFT } from 'app/components/NFT';
import { ethers } from 'ethers';
import * as abi from '../contract/nftStore.json';
const CreateNftCampaign = () => {
  const { nftAution, setnftAution, myNft, setMyNft } = useContext(AppContext);
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState(defaultImgs[1]);
  const [theFile, setTheFile] = useState<any>();
  const { Moralis } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const dispatch = useNotification();
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const handleNewNotification = (type: notifyType, message?: string, icon?: TIconType, position?: IPosition) => {
    dispatch({
      type,
      message,
      title: 'Notification',
      icon,
      position: position || 'bottomL',
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    mode: 'onTouched',
  });

  const onSubmit = async (data, e) => {
    try {
      const nftStore = new ethers.Contract('0x1fcf3d0D9A9C4a0f02519c094DE4d326dbafdE98', abi.abi, provider.getSigner());
      const transaction = await nftStore.createNftCampaign(
        data?.name,
        data?.des,
        nftAution.address,
        nftAution.tokenId,
        nftAution.startingPrice * 1000000,
        nftAution.lastPrice * 1000000,
        nftAution.discountRate
      );
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for!`);
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
  useEffect(() => {
    console.log(nftAution);
  }, [nftAution]);
  const removeNftAution = tokenId => {
    //const newNftAution = nftAution.filter(item => item.tokenId != tokenId);
    setnftAution(null);
    window.localStorage.removeItem('nftAution');
  };
  const addNftToAution = (address, tokenId) => {
    console.log(address);
    console.log(tokenId);
  };
  const dataTable = nftAution
    ? [nftAution].map(item => [
        <Avatar isRounded size={36} theme="image" />,
        item.name,
        <Link
          to={`/nft/${item.address}/${item.tokenId}`}
          style={{
            textDecoration: 'none',
          }}
        >
          {item.address.slice(0, 5) + '...' + item.address.slice(item.address.length - 3, item.address.length)}
        </Link>,
        <Tag color="blue" text={item.tokenId} />,
        <Tag color="red" text={item.startingPrice.toString() + ' USD'} />,
        <Tag color="red" text={item.lastPrice.toString() + ' USD'} />,
        <Tag color="yellow" text={item.discountRate.toString()} />,
        <Button text="X" onClick={() => removeNftAution(item.tokenId)}></Button>,
      ])
    : [];
  return (
    <>
      <div className="row">
        <div className="col-md-3 col-sm-12">
          <img
            style={{
              maxWidth: '90%',
              height: 'auto',
            }}
            alt=""
            src="content/images/bluezoneApp.png"
          ></img>
        </div>
        <div
          className="col-md-9 col-sm-12"
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '16px',
            border: 'none',
            boxSizing: 'border-box',
            lineHeight: 1,
            margin: 0,
            outline: 'none',
          }}
        >
          <div className="settingsPage justify-content-center ">
            <div className="pfp">
              <div className="h4 font-weight-bold">
                {' '}
                <Translate contentKey="campaign.nft.form"></Translate>
              </div>
              {nftAution && (
                <NFT address={nftAution?.address} chain="ropsten" fetchMetadata tokenId={nftAution?.tokenId} isAuction={false} />
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    name={field.name}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    label={translate('campaign.nft.name')}
                    validation={{
                      required: true,
                      characterMinLength: 2,
                      characterMaxLength: 50,
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
                name="des"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    name={field.name}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    label={translate('campaign.nft.des')}
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
              <div className="row mt-5">
                <div className="col-md-11">
                  <Table
                    columnsConfig="1fr 2fr 2fr 1fr 2fr 2fr 2fr 1fr"
                    data={dataTable}
                    header={[
                      '',
                      <span> {translate('campaign.nft.table.name')}</span>,
                      <span>{translate('campaign.nft.table.add')}</span>,
                      <span>{translate('campaign.nft.table.id')}</span>,
                      <span>{translate('campaign.nft.table.start')}</span>,
                      <span>{translate('campaign.nft.table.end')}</span>,
                      <span>{translate('campaign.nft.table.discount')}</span>,
                      '',
                    ]}
                    // isColumnSortable={[false, true, false, false]}
                    maxPages={3}
                    onPageNumberChanged={function noRefCheck() {}}
                    pageSize={3}
                  />
                </div>
              </div>
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
                  fontWeight: 'bold',
                }}
              >
                {translate('campaign.nft.create')}
              </button>
              <button
                type="reset"
                className=" ml-1 mt-2"
                style={{
                  borderRadius: '15px',
                  width: '150px',
                  height: '40px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'hidden',
                  fontWeight: 'bold',
                }}
                onClick={() => reset()}
              >
                {translate('campaign.nft.clear')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNftCampaign;
