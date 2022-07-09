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

const CreateCampaign = () => {
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState(defaultImgs[1]);
  const [theFile, setTheFile] = useState<any>();
  const { Moralis } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();
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

  const onSubmit = async (data, e) => {
    if (!theFile) {
      handleNewNotification('error', 'Please select image banner for Campaign');
      return;
    } else {
      const options = {
        contractAddress: '0xd9972bFDDd96c182f0Cd85c32a65D26485627a54',
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
                name: 'endTime',
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
          endTime: parseInt(data.endTime),
          coverImgUrl: theFile,
          campaignType: data?.name,
        },
      };
      console.log(options);
      await contractProcessor.fetch({
        params: options,
        onSuccess: res => {
          console.log(res);
          handleNewNotification('success', 'Contract is pending, please wait!');
          reset();
        },
        onError: error => {
          console.log(error);
          console.log(JSON.parse(JSON.stringify(error))?.message);
          handleNewNotification(
            'error',
            JSON.parse(JSON.stringify(error))?.message
              ? JSON.parse(JSON.stringify(error))?.message
              : JSON.parse(JSON.stringify(error))?.error?.message
          );
        },
      });
      setSelectedFile(defaultImgs[1]);
      setTheFile(null);
    }
  };
  const resetForm = () => {
    reset();
  };
  return (
    <>
      <div className="row mt-5">
        <div className="col-md-4 col-sm-12">
          <img
            style={{
              maxWidth: '80%',
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
                    label="Name"
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
                    label="Description"
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
                    label="Goal"
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
                    label="Label Text"
                    options={[
                      {
                        id: '1',
                        label: 'Education',
                      },
                      {
                        id: '2',
                        label: 'Health/Medical',
                      },
                      {
                        id: '3',
                        label: 'Enviromental',
                      },
                      {
                        id: '4',
                        label: 'Animal/WildLife',
                      },
                      {
                        id: '5',
                        label: 'Arts/Culture',
                      },
                      {
                        id: '6',
                        label: 'Social Justice',
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
                      items={['7 days', '14 days', '30 days']}
                      title="End Time"
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
                onClick={() => resetForm()}
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

export default CreateCampaign;
