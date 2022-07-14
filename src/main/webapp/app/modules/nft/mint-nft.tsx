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
import { encode } from 'base-64';

const MintNft = () => {
  const { account } = useMoralis();
  const inputFile = useRef(null);
  const [isImage, setIsImage] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState(defaultImgs[1]);
  const [theFile, setTheFile] = useState<any>();
  const { Moralis } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();
  const onBannerClick = () => {
    inputFile.current.click();
  };

  const changeHandler = event => {
    const file = event.target.files[0];
    console.log(file);
    console.log(file.type.slice(0, 5));
    if (file.type.slice(0, 5) !== 'image') {
      setIsImage(true);
    } else setIsImage(false);
    setTheFile(file);
    setSelectedFile(URL.createObjectURL(file));
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
      const imgFile = theFile;
      const file = new Moralis.File(imgFile.name, imgFile);
      await file.saveIPFS();
      const nftImageJ = 'https://ipfs.moralis.io:2053/ipfs/' + file.name().slice(0, file.name().length - 4);

      const metadata = {
        description: data.des,
        image: nftImageJ,
        name: data.name,
      };
      const base64 = encode(JSON.stringify(metadata));
      const res = new Moralis.File('test.json', { base64 });
      await res.saveIPFS();
      const uri = 'https://ipfs.moralis.io:2053/ipfs/' + res.name().slice(0, file.name().length - 4);
      const options = {
        contractAddress: '0xfab34f6db9657a74f7ea96a5308c84c4f34b9a91',
        functionName: 'mintNFT',
        abi: [
          {
            inputs: [
              {
                internalType: 'address',
                name: 'recipient',
                type: 'address',
              },
              {
                internalType: 'string',
                name: 'tokenURI',
                type: 'string',
              },
            ],
            name: 'mintNFT',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        params: {
          recipient: data?.to ? data.to : account,
          tokenURI: uri,
        },
      };
      console.log(options);
      await contractProcessor.fetch({
        params: options,
        onSuccess: res => {
          console.log('Success');
          handleNewNotification('success', 'Contract is pending, Please wait! ');
          setSelectedFile(defaultImgs[1]);
          setTheFile(null);
          e.target.reset();
        },
        onError: error => {
          console.log(JSON.parse(JSON.stringify(error)));
          handleNewNotification(
            'error',
            JSON.parse(JSON.stringify(error))?.error?.message
              ? JSON.parse(JSON.stringify(error))?.error?.message +
                  ' ' +
                  JSON.parse(JSON.stringify(error))?.reason +
                  '  ' +
                  JSON.parse(JSON.stringify(error))?.code
              : JSON.parse(JSON.stringify(error))?.message +
                  ' ' +
                  JSON.parse(JSON.stringify(error))?.reason +
                  '  ' +
                  JSON.parse(JSON.stringify(error))?.code
          );
        },
      });
    }
  };
  const test = async () => {
    const base64 =
      'ewoiYXR0cmlidXRlcyI6IFsKewoidHJhaXRfdHlwZSI6ICJCcmVlZCIsCiJ2YWx1ZSI6ICJNYWx0aXBvbyIKfSwKewoidHJhaXRfdHlwZSI6ICJFeWUgY29sb3IiLAoidmFsdWUiOiAiTW9jaGEiCn0KXSwKImRlc2NyaXB0aW9uIjogIlRoZSB3b3JsZCdzIG1vc3QgYWRvcmFibGUgYW5kIHNlbnNpdGl2ZSBwdXAuIiwKImltYWdlIjogImh0dHBzOi8vZ2F0ZXdheS5waW5hdGEuY2xvdWQvaXBmcy9RbVdtdlRKbUpVM3BvelI5WkhGbVFDMkRORHdpMlhKdGYzUUd5WWlpYWdGU1diIiwKIm5hbWUiOiAiUmFtc2VzIgp9';
    const file = new Moralis.File('test.json', { base64 });
    console.log(file);
    await file.saveIPFS();
    console.log(file);
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
