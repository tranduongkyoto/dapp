import React, { useState, useRef, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import { Input, useNotification } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from 'react-moralis';
import { defaultImgs } from '../../shared/util/defaultImgs';
import { messages } from 'app/config/constants';
import { IPosition, notifyType } from 'web3uikit/dist/components/Notification/types';
import { TIconType } from 'web3uikit/dist/components/Icon/collection';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Select } from 'app/components/Select';
import { Radios } from 'app/components/Radios';
import { ethers } from 'ethers';
import * as abi from '../contract/OrganizationStore.json';
import { sign } from 'crypto';
import './registerOrg.scss';
const RegisterOrg = () => {
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState(defaultImgs[2]);
  const [theFile, setTheFile] = useState<any>();
  const { Moralis, account } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const dispatch = useNotification();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(account);
  const onBannerClick = () => {
    inputFile.current.click();
  };

  const changeHandler = async event => {
    const img = event.target.files[0];
    setSelectedFile(URL.createObjectURL(img));
    const imgFile = img;
    const file = new Moralis.File(imgFile.name, imgFile);
    await file.saveIPFS();
    const coverImgUrl = 'https://ipfs.moralis.io:2053/ipfs/' + file.name().slice(0, file.name().length - 4);
    setTheFile(coverImgUrl);
  };
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
  useEffect(() => {
    const test = async () => {
      const list = await provider.listAccounts();
      console.log(provider);
      console.log(list);
    };
    test();
  }, []);

  const onSubmit = async (data, e) => {
    console.log({
      name: data?.name,
      des: data?.des,
      url: theFile,
      type: data?.type,
      to: data?.to,
    });
    if (!theFile) {
      handleNewNotification('error', 'Please select image banner for Campaign');
      return;
    } else {
      try {
        const orgStore = new ethers.Contract('0x4059d50228a8D77a5828c488bE5181216cB78C4D', abi.abi, provider.getSigner(account));
        const transaction = await orgStore.createOrganization(data?.name, data?.des, theFile, data?.type, data?.to);
        handleNewNotification('success', 'Contract is pending, Please wait! ');
        const res = await transaction.wait();
        if (res?.status == 1) {
          console.log(res);
          handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for your donation!`);
        }
        reset();
        setSelectedFile(defaultImgs[2]);
        setTheFile(null);
      } catch (error: any) {
        console.log(JSON.parse(JSON.stringify(error)));
        var message = JSON.parse(JSON.stringify(error))?.data?.message
          ? JSON.parse(JSON.stringify(error))?.data?.message
          : JSON.parse(JSON.stringify(error))?.message;
        message += '. ' + JSON.parse(JSON.stringify(error))?.reason ? JSON.parse(JSON.stringify(error))?.reason : '';
        handleNewNotification('error', message.toString());
      }
      //setSelectedFile(defaultImgs[2]);
      //setTheFile(null);
    }
  };
  return (
    <>
      <div className="row mt-5">
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
        <div
          className="col-md-6 col-sm-12"
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
          {/* <div className=" text-center font-weight-bold ">Create Campaign</div> */}
          <div className="justify-content-center ">
            <div className="h4 font-weight-bold">{translate('org.register')}</div>
            <div>
              <img src={selectedFile} onClick={onBannerClick} className="orgBanner"></img>
              <input type="file" name="file" ref={inputFile} onChange={changeHandler} style={{ display: 'none' }} required />
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
                    label={translate('campaign.crypto.name')}
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
                name="to"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    name={field.name}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    label={translate('org.owner')}
                    validation={{
                      required: true,
                      regExp: '^0x[a-fA-F0-9]{40}$',
                      regExpInvalidMessage: 'That is not a valid Ethereum Address',
                    }}
                    type="text"
                    style={{
                      marginTop: '30px',
                    }}
                  />
                )}
              />
              <Controller
                name="type"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    onBlurTraditional={field.onBlur}
                    onChange={field.onChange}
                    onChangeTraditional={field.onChange}
                    label={translate('campaign.crypto.type')}
                    options={[
                      {
                        id: '1',
                        label: translate('campaign.crypto.edu'),
                      },
                      {
                        id: '2',
                        label: translate('campaign.crypto.health'),
                      },
                      {
                        id: '3',
                        label: translate('campaign.crypto.env'),
                      },
                      {
                        id: '4',
                        label: translate('campaign.crypto.animal'),
                      },
                      {
                        id: '5',
                        label: translate('campaign.crypto.art'),
                      },
                      {
                        id: '6',
                        label: translate('campaign.crypto.social'),
                      },
                    ]}
                    traditionalHTML5={true}
                    style={{
                      marginTop: '30px',
                    }}
                    validation={{
                      required: true,
                    }}
                  />
                )}
              />

              <button
                type="submit"
                className="mt-3"
                style={{
                  borderRadius: '15px',
                  width: '100px',
                  height: '40px',
                  backgroundColor: '#21BF96',
                  color: 'white',
                  border: 'hidden',
                }}
              >
                {translate('org.register')}
              </button>
              <button
                type="reset"
                className=" ml-1 mt-3"
                style={{
                  borderRadius: '15px',
                  width: '100px',
                  height: '40px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'hidden',
                }}
                onClick={() => reset()}
              >
                {translate('campaign.crypto.clear')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterOrg;
