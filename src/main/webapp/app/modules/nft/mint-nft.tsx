import React, { useState, useRef, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import './mint-nft.scss';
import { Input, useNotification } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from 'react-moralis';
import { defaultImgs } from '../../shared/util/defaultImgs';
import { messages } from 'app/config/constants';
import { IPosition, notifyType } from 'web3uikit/dist/components/Notification/types';
import { TIconType } from 'web3uikit/dist/components/Icon/collection';
import { Controller, useForm } from 'react-hook-form';
import { encode } from 'js-base64';
import { ethers } from 'ethers';
import * as abi from '../contract/myNft.json';
const MintNft = () => {
  const { account } = useMoralis();
  const inputFile = useRef(null);
  const [isImage, setIsImage] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState(defaultImgs[1]);
  const [theFile, setTheFile] = useState<any>();
  const { Moralis } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const dispatch = useNotification();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const onBannerClick = () => {
    inputFile.current.click();
  };

  const changeHandler = async event => {
    const file = event.target.files[0];
    console.log(file);
    console.log(file.type.slice(0, 5));
    if (file.type.slice(0, 5) !== 'image') {
      setIsImage(true);
    } else setIsImage(false);
    setSelectedFile(URL.createObjectURL(file));
    const imgFile = file;
    const newFile = new Moralis.File(imgFile.name, imgFile);
    await newFile.saveIPFS();
    const nftImageJ = 'https://ipfs.moralis.io:2053/ipfs/' + newFile.name().slice(0, newFile.name().length - 4);
    setTheFile(nftImageJ);
    //setSelectedFile(URL.createObjectURL(file));
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

  const onSubmit = async (data, e) => {
    console.log(data);
    console.log(theFile);
    if (!theFile) {
      handleNewNotification('error', 'Please select image banner for Campaign');
      return;
    } else {
      const metadata = {
        description: data.des,
        image: theFile,
        name: data.name,
      };
      console.log(metadata);
      const metadataStr = JSON.stringify(metadata);
      console.log(metadataStr);
      const base64 = encode(metadataStr);
      const res = new Moralis.File('test.json', { base64 });
      await res.saveIPFS();
      const uri = 'https://ipfs.moralis.io:2053/ipfs/' + res.name().slice(0, res.name().length - 4);
      try {
        const myNft = new ethers.Contract('0xca0797Bd5397b8822A05CCb7f733f67829c3039d', abi.abi, provider.getSigner());
        const transaction = await myNft.mintNFT(data?.to ? data.to : account, uri);
        handleNewNotification('success', 'Contract is pending, Please wait! ');
        const res = await transaction.wait();
        if (res?.status == 1) {
          handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. NFT is created!`);
        }
      } catch (error: any) {
        console.log(error);
        console.log(JSON.parse(JSON.stringify(error)));
        handleNewNotification(
          'error',
          JSON.parse(JSON.stringify(error))?.error?.message
            ? JSON.parse(JSON.stringify(error))?.error?.message
            : JSON.parse(JSON.stringify(error))?.message
        );
      }
      setSelectedFile(defaultImgs[1]);
      setTheFile(null);
    }
  };
  return (
    <>
      <div className="row mt-5">
        {/* <button onClick={() => test()}>TEST</button> */}
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
          className="col-md-4 col-sm-12"
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
            <div className="h4 font-weight-bold">{translate('campaign.nft.mint.title')}</div>
            <div className="banner-border">
              <img src={selectedFile} onClick={onBannerClick} className="banner"></img>
              <input
                accept="image/*"
                type="file"
                name="file"
                ref={inputFile}
                onChange={changeHandler}
                style={{ display: 'none' }}
                required
              />
              {isImage && <p>{translate('campaign.nft.mint.image')}</p>}
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
                    label={translate('campaign.nft.mint.name')}
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
              {/* <div>
                <div className="h4">External Link</div>
                <input
                  type="text"
                  {...register('link', {
                    //required: 'This field is required',
                    minLength: {
                      value: 5,
                      message: 'Min length is 5',
                    },
                    maxLength: {
                      value: 200,
                      message: 'Max length is 200',
                    },
                  })}
                  style={{
                    borderRadius: '15px',
                    width: '500px',
                    height: '40px',
                  }}
                />
                {errors.link && <p>{errors.link.message}</p>}
              </div> */}
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
                    label={translate('campaign.nft.mint.to')}
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
                name="des"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    name={field.name}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    label={translate('campaign.nft.mint.des')}
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
      </div>
    </>
  );
};

export default MintNft;
