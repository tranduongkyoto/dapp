import React, { useState, useRef } from 'react';
import { Translate, translate } from 'react-jhipster';
import './create-campaign.scss';
import { Input, Button, DatePicker, Select } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from 'react-moralis';
import { defaultImgs } from '../../shared/util/defaultImgs';
import { messages } from 'app/config/constants';
const CreateCampaign = () => {
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState(defaultImgs[1]);
  const [theFile, setTheFile] = useState<any>();
  const [name, setName] = useState<any>();
  const [description, setDescription] = useState<any>();
  const [goal, setGoal] = useState<String>();
  const [type, setType] = useState<String | Number>();
  const [startedAt, setStartedAt] = useState<Number>();
  const [endAt, setEndAt] = useState<Number>();
  const { Moralis } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const contractProcessor = useWeb3ExecuteFunction();

  const onBannerClick = () => {
    inputFile.current.click();
  };

  const changeHandler = event => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };

  const create = async () => {
    //console.log(theFile);
    if (theFile) {
      const data = theFile;
      const file = new Moralis.File(data.name, data);
      //await file.saveIPFS();
      //var coverImgUrl = 'https://ipfs.moralis.io:2053/ipfs/' + file.name().slice(0, file.name().length - 5);
      // console.log({
      //   name,
      //   description,
      //   goal,
      //   startedAt,
      //   endAt,
      //   coverImgUrl,
      //   type,
      // });
      let options = {
        contractAddress: '0xa135d59a6B102A1512769f8eDA393198cd7AD0B2',
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
          name: 'name',
          description: 'des',
          goal: 1000000000000,
          startedAt: 123456,
          endedAt: 123789,
          coverImgUrl: 'test url',
          campaignType: 'test type',
        },
        //msgValue: Moralis.Units.FromWei(1000000),
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: () => {
          //saveTweet();
          console.log('Success');
        },
        onError: error => {
          console.log(error);
        },
      });
      await Web3Api.native
        .getContractEvents({
          chain: 'ropsten',
          topic: '0x80c718400a642daaf8afd95903132666f2d8e9da6e962b52b5e78414795a60c7',
          address: '0xa135d59a6B102A1512769f8eDA393198cd7AD0B2',
        })
        .then(data => {
          console.log(data);
        });
    }
  };
  return (
    <>
      <div className="row">
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
          <div className=" text-center font-weight-bold ">Create Campaign</div>
          <div className="settingsPage justify-content-center ">
            <div className="pfp">
              <div>Campaign Banner</div>
              <div className="pfpOptions">
                <img src={selectedFile} onClick={onBannerClick} className="banner"></img>
                <input type="file" name="file" ref={inputFile} onChange={changeHandler} style={{ display: 'none' }} />
              </div>
            </div>

            <Input label="Name" name="Name" onChange={e => setName(e.target.value)} />

            <Input label="Description" name="Description" onChange={e => setDescription(e.target.value)} />

            <Input label="Goal" name="Goal" onChange={e => setGoal(e.target.value)} type="number" />

            <Select
              defaultOptionIndex={0}
              label="Label Text"
              onBlurTraditional={function noRefCheck() {}}
              onChange={e => setType(e.label)}
              onChangeTraditional={function noRefCheck() {}}
              options={[
                {
                  id: 'discord',
                  label: 'Discord',
                },
                {
                  id: 'emoji',
                  label: 'Emoji',
                },
                {
                  id: 'txt',
                  label: 'TXT',
                },
                {
                  id: 'dapp',
                  label: 'dApp',
                },
              ]}
            />
            <div
              style={{
                maxWidth: '350px',
              }}
            >
              <DatePicker
                id="date-picker"
                onChange={e => {
                  console.log(new Date(e.date).getTime());
                  setStartedAt(new Date(e.date).getTime());
                }}
                validation={{
                  max: '2050-12-31',
                  min: '2022-05-12',
                  required: true,
                }}
                label="Start Date"
              />
            </div>

            <div
              style={{
                maxWidth: '350px',
              }}
            >
              <DatePicker
                id="date-picker"
                onChange={e => {
                  console.log(e.date);
                  setEndAt(new Date(e.date).getTime());
                }}
                validation={{
                  max: '2050-12-31',
                  min: '2022-05-12',
                  required: true,
                }}
                label="End Date"
              />
            </div>
            <div className="">
              <Button id="test-button-primary" onClick={create} text="Create" theme="primary" type="button" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCampaign;
