import React, { useState, useRef, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import './create-campaign.scss';
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
import * as abi from '../contract/campaignStore.json';
import { sign } from 'crypto';

const CreateCampaign = () => {
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState(defaultImgs[1]);
  const [theFile, setTheFile] = useState<any>();
  const { Moralis, account } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();
  //console.log(window.ethereum);
  //const provider = new ethers.providers.JsonRpcProvider('https://speedy-nodes-nyc.moralis.io/cc62c6b608990d64ec2ac8ca/eth/ropsten');
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

  // if (provider) {
  //   console.log(provider.listAccounts());
  //   // console.log(signer);
  //   // console.log(provider);
  // }
  const onSubmit = async (data, e) => {
    if (!theFile) {
      handleNewNotification('error', 'Please select image banner for Campaign');
      return;
    } else {
      try {
        const campaignStore = new ethers.Contract('0xd9972bFDDd96c182f0Cd85c32a65D26485627a54', abi.abi, provider.getSigner(account));
        const transaction = await campaignStore.createCampaign(
          data?.name,
          data?.des,
          Moralis.Units.Token(data.goal, 6),
          parseInt(data.endTime),
          theFile,
          data?.type
        );
        handleNewNotification('success', 'Contract is pending, Please wait! ');
        console.log(provider.getSigner());
        const res = await transaction.wait();
        if (res?.status == 1) {
          console.log(res);
          handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for your donation!`);
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
      // const options = {
      //   contractAddress: '0xd9972bFDDd96c182f0Cd85c32a65D26485627a54',
      //   functionName: 'createCampaign',
      //   abi: [
      //     {
      //       inputs: [
      //         {
      //           internalType: 'string',
      //           name: 'name',
      //           type: 'string',
      //         },
      //         {
      //           internalType: 'string',
      //           name: 'description',
      //           type: 'string',
      //         },
      //         {
      //           internalType: 'uint256',
      //           name: 'goal',
      //           type: 'uint256',
      //         },
      //         {
      //           internalType: 'uint256',
      //           name: 'endTime',
      //           type: 'uint256',
      //         },
      //         {
      //           internalType: 'string',
      //           name: 'coverImgUrl',
      //           type: 'string',
      //         },
      //         {
      //           internalType: 'string',
      //           name: 'campaignType',
      //           type: 'string',
      //         },
      //       ],
      //       name: 'createCampaign',
      //       outputs: [],
      //       stateMutability: 'nonpayable',
      //       type: 'function',
      //     },
      //   ],
      //   params: {
      //     name: data?.name,
      //     description: data?.des,
      //     goal: Moralis.Units.Token(data.goal, 6),
      //     endTime: parseInt(data.endTime),
      //     coverImgUrl: theFile,
      //     campaignType: data?.name,
      //   },
      // };
      // console.log(options);
      // await contractProcessor.fetch({
      //   params: options,
      //   onSuccess: res => {
      //     console.log(res);
      //     handleNewNotification('success', 'Contract is pending, please wait!');
      //     reset();
      //   },
      //   onError: error => {
      //     console.log(error);
      //     console.log(JSON.parse(JSON.stringify(error))?.message);
      //     handleNewNotification(
      //       'error',
      //       JSON.parse(JSON.stringify(error))?.message
      //         ? JSON.parse(JSON.stringify(error))?.message
      //         : JSON.parse(JSON.stringify(error))?.error?.message
      //     );
      //   },
      // });
      setSelectedFile(defaultImgs[1]);
      setTheFile(null);
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
          <div className="settingsPage justify-content-center ">
            <div className="pfp">
              <div className="h4 font-weight-bold">
                {' '}
                <Translate contentKey="campaign.crypto.form"></Translate>
              </div>
              <div className="pfpOptions">
                {/* <div className="h6">
                  {' '}
                  <Translate contentKey="campaign.crypto.banner"></Translate>
                </div> */}
                <img src={selectedFile} onClick={onBannerClick} className="banner"></img>
                <input type="file" name="file" ref={inputFile} onChange={changeHandler} style={{ display: 'none' }} required />
              </div>
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
                name="goal"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    name={field.name}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    label={translate('campaign.crypto.goal')}
                    validation={{
                      required: true,
                      numberMin: 100,
                      numberMax: 9999999,
                      // regExp: '^[^@s]+@[^@s]+.[^@s]+$',
                      // regExpInvalidMessage: 'That is not a valid email address',
                    }}
                    type="number"
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
                      marginTop: '40px',
                    }}
                    validation={{
                      required: true,
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
                      items={[translate('campaign.crypto.7'), translate('campaign.crypto.14'), translate('campaign.crypto.30')]}
                      title={translate('campaign.crypto.time')}
                      validation={{
                        required: true,
                      }}
                    />
                  )}
                />
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
                }}
              >
                {translate('campaign.crypto.create')}
              </button>
              <button
                type="reset"
                className=" ml-1 mt-2"
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

export default CreateCampaign;
