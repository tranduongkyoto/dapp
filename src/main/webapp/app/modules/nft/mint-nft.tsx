import React, { useState, useRef, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import './mint-nft.scss';
import { useNotification } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from 'react-moralis';
import { defaultImgs } from '../../shared/util/defaultImgs';
import { messages } from 'app/config/constants';
import { IPosition, notifyType } from 'web3uikit/dist/components/Notification/types';
import { TIconType } from 'web3uikit/dist/components/Icon/collection';
import { useForm } from 'react-hook-form';
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
    }
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
      const nftImageJ = 'https://ipfs.moralis.io:2053/ipfs/' + file.name().slice(0, file.name().length - 5);
      setSelectedFile(defaultImgs[1]);
      setTheFile(null);
      const metadata = {
        description: data.des,
        image: nftImageJ,
        name: data.name,
      };
      const base64 = encode(JSON.stringify(metadata));
      const res = new Moralis.File('test.json', { base64 });
      await res.saveIPFS();
      const uri = 'https://ipfs.moralis.io:2053/ipfs/' + res.name().slice(0, file.name().length - 5);
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
          recipient: account,
          tokenURI: uri,
        },
      };
      console.log(options);
      await contractProcessor.fetch({
        params: options,
        onSuccess: res => {
          console.log('Success');
        },
        onError: error => {
          console.log('Error');
          console.log(error);
        },
      });
      e.target.reset();
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
        <div className="col-md-8 col-sm-12">
          {/* <div className=" text-center font-weight-bold ">Create Campaign</div> */}
          <div className="settingsPage justify-content-center ">
            <div className="h4 font-weight-bold">Mint NFT</div>
            <div className="banner-border">
              <img src={selectedFile} onClick={onBannerClick} className="banner"></img>
              <input
                //accept="image/*"
                type="file"
                name="file"
                ref={inputFile}
                onChange={changeHandler}
                style={{ display: 'none' }}
                required
              />
              {/* {isImage && <p>Please select image file</p>} */}
            </div>
            {/* <div className="banner-border">
              <img src={selectedFile} onClick={onBannerClick} className="banner"></img>
              <input
                //accept="image/*"
                type="file"
                name="file"
                ref={inputFile}
                onChange={changeHandler}
                style={{ display: 'none' }}
                required
              />
              {isImage && <p>Please select image file</p>}
            </div> */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="h4">Name</div>
                <input
                  type="text"
                  //placeholder="Name"
                  {...register('name', {
                    required: 'This field is required',
                    minLength: {
                      value: 2,
                      message: 'Min length is 2',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Max length is 50',
                    },
                  })}
                  style={{
                    borderRadius: '15px',
                    width: '500px',
                    height: '40px',
                  }}
                />
                {errors.name && <p>{errors.name.message}</p>}
              </div>
              <div>
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
              </div>
              <div>
                <div className="h4">Description</div>
                <textarea
                  {...register('des', {
                    required: 'This field is required',
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
                    height: '100px',
                  }}
                />
                {errors.des && <p>{errors.des.message}</p>}
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
                Create
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
              >
                Clear
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default MintNft;
