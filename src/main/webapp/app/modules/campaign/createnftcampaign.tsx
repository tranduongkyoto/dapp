import React, { useState, useRef, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import './create-campaign.scss';
import { useNotification } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from 'react-moralis';
import { defaultImgs } from '../../shared/util/defaultImgs';
import { messages } from 'app/config/constants';
import { IPosition, notifyType } from 'web3uikit/dist/components/Notification/types';
import { TIconType } from 'web3uikit/dist/components/Icon/collection';
import { useLocation } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

const CreateNftCampaign = () => {
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState(defaultImgs[1]);
  const [theFile, setTheFile] = useState<any>();
  const { Moralis } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();
  // const [price, setPrice] = useState<number>();
  const getETHPrice = async () => {
    const price = await Web3Api.token.getTokenPrice({
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      chain: 'eth',
      exchange: 'uniswap-v3',
    });
    //console.log(price);
    //setPrice(parseInt(price.usdPrice.toString()));
  };
  // useEffect(() => {}, []);
  const onBannerClick = () => {
    inputFile.current.click();
  };

  const changeHandler = event => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };
  const handleNewNotification = (type: notifyType, message?: string, icon?: TIconType, position?: IPosition) => {
    dispatch({
      type,
      message,
      title: 'Error Notification',
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
    const priceData = await Web3Api.token.getTokenPrice({
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      chain: 'eth',
      exchange: 'uniswap-v3',
    });
    const price = priceData.usdPrice;
    console.log(data);
    if (!theFile) {
      handleNewNotification('error', 'Please select image banner for Campaign');
      return;
    } else {
      const imgFile = theFile;
      const file = new Moralis.File(imgFile.name, imgFile);
      await file.saveIPFS();
      const coverImgUrl = 'https://ipfs.moralis.io:2053/ipfs/' + file.name().slice(0, file.name().length - 5);
      setSelectedFile(defaultImgs[1]);
      setTheFile(null);
      const options = {
        contractAddress: '0x75e8E1898d1b74fb369e5C68aEA30A4dB2004Fc3',
        functionName: 'createCampaign',
        abi: [
          {
            inputs: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'description',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'goal',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'startedAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'endedAt',
                type: 'uint256',
              },
              {
                internalType: 'string',
                name: 'coverImgUrl',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'campaignType',
                type: 'string',
              },
            ],
            name: 'createCampaign',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        params: {
          name: data?.name,
          description: data?.des,
          goal: Moralis.Units.Token(data.goal, 6),
          startedAt: new Date(data?.startTime).getTime(),
          endedAt: new Date(data?.endTime).getTime(),
          coverImgUrl: coverImgUrl,
          campaignType: data?.name,
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
        <div className="col-md-8 col-sm-12">
          {/* <div className=" text-center font-weight-bold ">Create Campaign</div> */}
          <div className="settingsPage justify-content-center ">
            <div className="pfp">
              <div className="h4 font-weight-bold">Campaign Banner</div>
              <div className="pfpOptions">
                <img src={selectedFile} onClick={onBannerClick} className="banner"></img>
                <input type="file" name="file" ref={inputFile} onChange={changeHandler} style={{ display: 'none' }} required />
              </div>
            </div>
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
                <div className="h4">Description</div>
                <input
                  type="text"
                  //placeholder="Description"
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
                    height: '40px',
                  }}
                />
                {errors.description && <p>{errors.description.message}</p>}
              </div>
              <div>
                <div className="h4">Goal</div>
                <input
                  type="number"
                  //placeholder="Amount"
                  {...register('goal', {
                    required: 'This field is required',
                    min: {
                      value: 100,
                      message: 'Min value is 100',
                    },
                    max: {
                      value: 999999,
                      message: 'Max value is 999999',
                    },
                  })}
                  style={{
                    borderRadius: '15px',
                    width: '500px',
                    height: '40px',
                  }}
                />
              </div>
              <div>
                <div className="h4">Type</div>
                <select
                  {...register('type', { required: 'This field is required' })}
                  style={{
                    borderRadius: '15px',
                    width: '100px',
                    height: '40px',
                  }}
                >
                  <option value="">Select One</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health/Medical</option>
                  <option value="Enviromental">Enviromental</option>
                  <option value="Animal">Animal/Wildlife</option>
                  <option value="Art">Arts/Culture</option>
                  <option value="Social">Social Justice</option>
                </select>
                {errors.type && <p>{errors.type.message}</p>}
              </div>
              <div>
                <div className="h4">Start Time</div>
                <input
                  type="datetime-local"
                  //placeholder="Start Date"
                  {...register('startTime', { required: 'This field is required' })}
                  style={{
                    borderRadius: '15px',
                    width: '300px',
                    height: '40px',
                  }}
                />
                {errors.startTime && <p>{errors.startTime.message}</p>}
              </div>
              <div>
                <div className="h4">End Time</div>
                <input
                  type="datetime-local"
                  //placeholder="End Date"
                  {...register('endTime', { required: 'This field is required' })}
                  style={{
                    borderRadius: '15px',
                    width: '300px',
                    height: '40px',
                  }}
                />
                {errors.endTime && <p>{errors.endTime.message}</p>}
              </div>

              <input
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
              />
              <input
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
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNftCampaign;
