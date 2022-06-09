import React, { useState, useRef, useEffect, useContext } from 'react';
import { Translate, translate } from 'react-jhipster';
import './create-campaign.scss';
import { Avatar, Button, Icon, Table, Tag, useNotification } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from 'react-moralis';
import { defaultImgs } from '../../shared/util/defaultImgs';
import { messages } from 'app/config/constants';
import { IPosition, notifyType } from 'web3uikit/dist/components/Notification/types';
import { TIconType } from 'web3uikit/dist/components/Icon/collection';
import { Link, useLocation } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { AppContext } from 'app/provider/appContext';

const CreateNftCampaign = () => {
  const { nftAution, setnftAution } = useContext(AppContext);
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
    console.log('53');
    if (!theFile) {
      handleNewNotification('error', 'Please select image banner for Campaign');
      return;
    } else {
      const imgFile = theFile;
      const file = new Moralis.File(imgFile.name, imgFile);
      await file.saveIPFS();
      const coverImgUrl = 'https://ipfs.moralis.io:2053/ipfs/' + file.name().slice(0, file.name().length - 5);
      const res = {
        coverImgUrl,
        name: data?.name,
        des: data?.des,
        nftAution,
      };
      console.log(res);
      // const options = {
      //   contractAddress: '0x75e8E1898d1b74fb369e5C68aEA30A4dB2004Fc3',
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
      //           name: 'startedAt',
      //           type: 'uint256',
      //         },
      //         {
      //           internalType: 'uint256',
      //           name: 'endedAt',
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
      //     startedAt: new Date(data?.startTime).getTime(),
      //     endedAt: new Date(data?.endTime).getTime(),
      //     coverImgUrl: coverImgUrl,
      //     campaignType: data?.name,
      //   },
      // };
      //console.log(options);
      // await contractProcessor.fetch({
      //   params: options,
      //   onSuccess: res => {
      //     console.log('Success');
      //   },
      //   onError: error => {
      //     console.log('Error');
      //     console.log(error);
      //   },
      // });
      setSelectedFile(defaultImgs[1]);
      setTheFile(null);
      e.target.reset();
    }
  };
  useEffect(() => {
    console.log(nftAution);
  }, [nftAution]);
  const removeNftAution = tokenId => {
    const newNftAution = nftAution.filter(item => item.tokenId != tokenId);
    setnftAution(newNftAution);
    window.localStorage.setItem('nftAution', JSON.stringify(newNftAution));
  };
  const dataTable = nftAution.map(item => [
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
    <Tag color="yellow" text={item.discountRate.toString() + ' %'} />,
    <Button text="X" onClick={() => removeNftAution(item.tokenId)}></Button>,
  ]);
  return (
    <>
      <div className="row mt-5">
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
        <div className="col-md-9 col-sm-12">
          <div className="settingsPage justify-content-center ">
            <div className="pfp">
              <div className="h4 font-weight-bold">Campaign NFT Banner</div>

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
                {errors.des && <p>{errors.des.message}</p>}
              </div>
              <div className="row mt-2">
                <div className="col-md-10">
                  <Table
                    columnsConfig="1fr 2fr 2fr 1fr 2fr 2fr 1fr"
                    data={dataTable}
                    header={[
                      '',
                      <span>Name</span>,
                      <span>Address</span>,
                      <span>Token Id</span>,
                      <span>Starting Price</span>,
                      <span>Discount Rate</span>,
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

export default CreateNftCampaign;
