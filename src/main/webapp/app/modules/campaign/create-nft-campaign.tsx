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
  const { nftAution, setnftAution, myNft, setMyNft } = useContext(AppContext);
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
    if (!theFile) {
      handleNewNotification('error', 'Please select image banner for Campaign');
      return;
    } else {
      const imgFile = theFile;
      const file = new Moralis.File(imgFile.name, imgFile);
      await file.saveIPFS();
      console.log(file);
      console.log(file.name());
      console.log(file.name().slice(0, file.name().length - 4));
      const coverImgUrl = 'https://ipfs.moralis.io:2053/ipfs/' + file.name().slice(0, file.name().length - 4);
      const options = {
        contractAddress: '0x6863bc3f2f179003b8101fA4a87b304340C174eA',
        functionName: 'createNftCampaign',
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
                internalType: 'string',
                name: 'coverImgUrl',
                type: 'string',
              },
              {
                internalType: 'address',
                name: '_address',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: '_startingPrice',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: '_discountRate',
                type: 'uint256',
              },
            ],
            name: 'createNftCampaign',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        params: {
          name: data?.name,
          description: data?.des,
          coverImgUrl: coverImgUrl,
          _address: nftAution.address,
          _tokenId: nftAution.tokenId,
          _startingPrice: nftAution.startingPrice * 1000000,
          _discountRate: nftAution.discountRate,
        },
      };
      console.log(options);
      await contractProcessor.fetch({
        params: options,
        onSuccess: res => {
          console.log(res);
          handleNewNotification('success', 'Contract is pending, please wait ');
          setSelectedFile(defaultImgs[1]);
          setTheFile(null);
          e.target.reset();
          setnftAution(null);
          window.localStorage.removeItem('myNft');
        },
        onError: error => {
          console.log(error);
          handleNewNotification(
            'error',
            JSON.parse(JSON.stringify(error))?.error?.message
              ? JSON.parse(JSON.stringify(error))?.error?.message
              : JSON.parse(JSON.stringify(error))?.message
          );
        },
        onComplete: () => {
          console.log('Complete');
        },
      });
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
        <Tag color="yellow" text={item.discountRate.toString() + ' %'} />,
        <Button text="X" onClick={() => removeNftAution(item.tokenId)}></Button>,
      ])
    : [];
  // const allData = myNft.map(item => [
  //   <Avatar isRounded size={36} theme="image" image="https://academy.moralis.io/wp-content/uploads/2021/12/Illustration4_home.svg" />,
  //   item.metadata?.name,
  //   <Link
  //     to={`/nft/${item.token_address}/${item.token_id}`}
  //     style={{
  //       textDecoration: 'none',
  //     }}
  //   >
  //     {item.token_address.slice(0, 5) + '...' + item.token_address.slice(item.token_address.length - 3, item.token_address.length)}
  //   </Link>,
  //   <Tag color="blue" text={item.token_id} />,
  //   <Button text="V" onClick={() => console.log('TEST')}></Button>,
  //   <Button
  //     icon="plus"
  //     iconLayout="icon-only"
  //     id="test-button-primary-icon-only"
  //     onClick={() => addNftToAution(item.token_address, item.token_id)}
  //     size="large"
  //     text="Primary icon only"
  //     theme="primary"
  //     type="button"
  //   />,
  // ]);
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
              <div className="row">
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
        {/* <div className="row">
          <div className="col-md-6">
            <Table
              columnsConfig="1fr 1fr 1fr 1fr 1fr 1fr"
              data={allData}
              header={['', <span>Name</span>, <span>Address</span>, <span>Token Id</span>, '', '']}
              // isColumnSortable={[false, true, false, false]}
              maxPages={3}
              onPageNumberChanged={function noRefCheck() {}}
              pageSize={5}
            />
          </div>
          <div className="col-md-6">
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
        </div> */}
      </div>
    </>
  );
};

export default CreateNftCampaign;
