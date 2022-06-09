import React, { Attributes, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Input, Button, DatePicker, Select } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery } from 'react-moralis';

const Campaigns = () => {
  const { Moralis } = useMoralis();
  const [list, setList] = useState<any>();
  const { data, isLoading, error } = useMoralisQuery('Campaign');
  const history = useHistory();
  const campaigns = [
    {
      _id: '615db44061c08b12f6b79cc6',
      name: 'nft4charity Demo Campaign',
      description: 'Raise $1M worth of medical device & vaccine for COVID-19 in Ho Chi Minh City, Donate easy to public wallets',
      goal: 1000000,
      startedAt: 1633091705613,
      endedAt: 1669857077727,
      coverImgUrl:
        'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxOTc1MzF8MHwxfHNlYXJjaHwxfHxjaGFyaXR5fGVufDB8MHx8fDE2Mzc3NzQ4Mjg&ixlib=rb-1.2.1&q=80&w=1080',
      thumbnailImgUrl:
        'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxOTc1MzF8MHwxfHNlYXJjaHwxfHxjaGFyaXR5fGVufDB8MHx8fDE2Mzc3NzQ4Mjg&ixlib=rb-1.2.1&q=80&w=200',
      type: 'FUND_RAISE',
      createdAt: 1633530944950,
      updatedAt: 1633530944950,
      userId: '615db44061c08b12f6b79cc3',
      wallets: [
        {
          _id: '618d4d64a193433621496d00',
          address: '0x9d1a9c75b643db4cff39dad5e2cacbeda6df85ae',
          balance: 0.0007899999999999999,
          numberOfTransaction: 11,
        },
      ],
      nftMetadata: null,
    },
    {
      _id: '618d4a9fe9e66033750b39b4',
      name: 'Rada Builder Fund',
      description: 'Raise $10000 to build MVP',
      goal: 10000,
      startedAt: 1636138864728,
      endedAt: 1640721076306,
      coverImgUrl:
        'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxOTc1MzF8MHwxfHNlYXJjaHwyfHxjaGFyaXR5fGVufDB8MHx8fDE2Mzc3NzQ4Mjg&ixlib=rb-1.2.1&q=80&w=1080',
      thumbnailImgUrl:
        'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxOTc1MzF8MHwxfHNlYXJjaHwyfHxjaGFyaXR5fGVufDB8MHx8fDE2Mzc3NzQ4Mjg&ixlib=rb-1.2.1&q=80&w=200',
      type: 'FUND_RAISE',
      createdAt: 1636649631533,
      updatedAt: 1636649631533,
      userId: '615db44061c08b12f6b79cc4',
      wallets: [
        {
          _id: '618d4aa0e9e66033750b39b8',
          address: '0xbfaaf05f031bb5bcc4cbeedd3eec1c0aeb0dd2c7',
          balance: 0.0008117,
          numberOfTransaction: 8,
        },
      ],
      nftMetadata: null,
    },
    {
      _id: '618d4a9fe9e66033750b39b5',
      name: 'McLaughlin Inc',
      description:
        'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
      goal: 5309,
      startedAt: 1635664358964,
      endedAt: 1639224784277,
      coverImgUrl:
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxOTc1MzF8MHwxfHNlYXJjaHwzfHxjaGFyaXR5fGVufDB8MHx8fDE2Mzc3NzQ4Mjg&ixlib=rb-1.2.1&q=80&w=1080',
      thumbnailImgUrl:
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxOTc1MzF8MHwxfHNlYXJjaHwzfHxjaGFyaXR5fGVufDB8MHx8fDE2Mzc3NzQ4Mjg&ixlib=rb-1.2.1&q=80&w=200',
      type: 'FUND_RAISE',
      createdAt: 1636649631709,
      updatedAt: 1636649631709,
      userId: '615db44061c08b12f6b79cc5',
      wallets: [
        {
          _id: '618d4aa0e9e66033750b39b9',
          address: '0xcd4bbfa2befe41c41cfbdc8e300f5770ee79b773',
          balance: 0.0011529000000000003,
          numberOfTransaction: 16,
        },
      ],
      nftMetadata: null,
    },
    {
      _id: '618d4a9fe9e66033750b39b6',
      name: 'Wisozk - Bechtelar',
      description:
        'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
      goal: 8201,
      startedAt: 1635693658687,
      endedAt: 1638002983944,
      coverImgUrl:
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxOTc1MzF8MHwxfHNlYXJjaHw0fHxjaGFyaXR5fGVufDB8MHx8fDE2Mzc3NzQ4Mjg&ixlib=rb-1.2.1&q=80&w=1080',
      thumbnailImgUrl:
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxOTc1MzF8MHwxfHNlYXJjaHw0fHxjaGFyaXR5fGVufDB8MHx8fDE2Mzc3NzQ4Mjg&ixlib=rb-1.2.1&q=80&w=200',
      type: 'FUND_RAISE',
      createdAt: 1636649631853,
      updatedAt: 1636649631853,
      userId: '615db44061c08b12f6b79cc5',
      wallets: [
        {
          _id: '618d4aa0e9e66033750b39ba',
          address: '0x012c47db5cdedfbcffb773be34f4cbaaaba9944c',
          balance: 0.0006395,
          numberOfTransaction: 9,
        },
        {
          _id: '618d4aa1e9e66033750b39e2',
          address: '0xea1407e2eae60e3ce9ca6fd51afaad01d02c7b79',
          balance: 0.0004626,
          numberOfTransaction: 5,
        },
      ],
      nftMetadata: null,
    },
    {
      _id: '618d4aa0e9e66033750b39b7',
      name: 'Hane, Orn and Conroy',
      description:
        'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
      goal: 8814,
      startedAt: 1633495299679,
      endedAt: 1637813551199,
      coverImgUrl:
        'https://images.unsplash.com/photo-1459183885421-5cc683b8dbba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxOTc1MzF8MHwxfHNlYXJjaHw1fHxjaGFyaXR5fGVufDB8MHx8fDE2Mzc3NzQ4Mjg&ixlib=rb-1.2.1&q=80&w=1080',
      thumbnailImgUrl:
        'https://images.unsplash.com/photo-1459183885421-5cc683b8dbba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxOTc1MzF8MHwxfHNlYXJjaHw1fHxjaGFyaXR5fGVufDB8MHx8fDE2Mzc3NzQ4Mjg&ixlib=rb-1.2.1&q=80&w=200',
      type: 'FUND_RAISE',
      createdAt: 1636649632003,
      updatedAt: 1636649632003,
      userId: '615db44061c08b12f6b79cc4',
      wallets: [
        {
          _id: '618d4aa0e9e66033750b39bb',
          address: '0xe8b3bc1f88ffdbb731a54e7cbb4ad6d922f3d14a',
          balance: 0.0012688,
          numberOfTransaction: 16,
        },
      ],
      nftMetadata: null,
    },
    {
      _id: '61a141e81998d34796f65639',
      name: 'NFT Campaign for Charity',
      description: 'NFT Campaign for Charity',
      goal: 100,
      startedAt: 0,
      endedAt: 1640908800000,
      coverImgUrl:
        'https://images.unsplash.com/photo-1591522810850-58128c5fb089?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      thumbnailImgUrl:
        'https://images.unsplash.com/photo-1591522810850-58128c5fb089?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      type: 'NFT',
      createdAt: 1637958119995,
      updatedAt: 1637958119995,
      userId: '618252e74e44ec001f1e64dd',
      wallets: [
        {
          _id: '61a141e81998d34796f6563b',
          address: '0x2b51185516bdb5e4ab6dc02b2e8972ef6aeacc0a',
          balance: 0.0004888,
          numberOfTransaction: 5,
        },
      ],
      nftMetadata: {
        _id: '61a141e81998d34796f6563a',
        campaignId: '61a141e81998d34796f65639',
        nftMetaData: {
          folderId: 'QmNnQ2WwSMpdjtD5xvDXUtKqpP9raDcanPBqeXwxXjFWZa',
          startNumber: '0000000000000000000000000000000000000000000000000000000000000001',
          total: 10,
        },
        ipfsBaseUrl: 'ipfs://QmNnQ2WwSMpdjtD5xvDXUtKqpP9raDcanPBqeXwxXjFWZa/metadata',
        nftUrls: [
          'https://ipfs.moralis.io:2053/ipfs/QmNnQ2WwSMpdjtD5xvDXUtKqpP9raDcanPBqeXwxXjFWZa/metadata/0000000000000000000000000000000000000000000000000000000000000001.json',
          'https://ipfs.moralis.io:2053/ipfs/QmNnQ2WwSMpdjtD5xvDXUtKqpP9raDcanPBqeXwxXjFWZa/metadata/0000000000000000000000000000000000000000000000000000000000000002.json',
          'https://ipfs.moralis.io:2053/ipfs/QmNnQ2WwSMpdjtD5xvDXUtKqpP9raDcanPBqeXwxXjFWZa/metadata/0000000000000000000000000000000000000000000000000000000000000003.json',
          'https://ipfs.moralis.io:2053/ipfs/QmNnQ2WwSMpdjtD5xvDXUtKqpP9raDcanPBqeXwxXjFWZa/metadata/0000000000000000000000000000000000000000000000000000000000000004.json',
          'https://ipfs.moralis.io:2053/ipfs/QmNnQ2WwSMpdjtD5xvDXUtKqpP9raDcanPBqeXwxXjFWZa/metadata/0000000000000000000000000000000000000000000000000000000000000005.json',
          'https://ipfs.moralis.io:2053/ipfs/QmNnQ2WwSMpdjtD5xvDXUtKqpP9raDcanPBqeXwxXjFWZa/metadata/0000000000000000000000000000000000000000000000000000000000000006.json',
          'https://ipfs.moralis.io:2053/ipfs/QmNnQ2WwSMpdjtD5xvDXUtKqpP9raDcanPBqeXwxXjFWZa/metadata/0000000000000000000000000000000000000000000000000000000000000007.json',
          'https://ipfs.moralis.io:2053/ipfs/QmNnQ2WwSMpdjtD5xvDXUtKqpP9raDcanPBqeXwxXjFWZa/metadata/0000000000000000000000000000000000000000000000000000000000000008.json',
          'https://ipfs.moralis.io:2053/ipfs/QmNnQ2WwSMpdjtD5xvDXUtKqpP9raDcanPBqeXwxXjFWZa/metadata/0000000000000000000000000000000000000000000000000000000000000009.json',
          'https://ipfs.moralis.io:2053/ipfs/QmNnQ2WwSMpdjtD5xvDXUtKqpP9raDcanPBqeXwxXjFWZa/metadata/0000000000000000000000000000000000000000000000000000000000000010.json',
        ],
      },
    },
  ];
  const getCampaign = () => {
    console.log(data);
  };
  const donate = id => {
    history.push(`/campaign/${id}`);
  };
  return (
    <>
      <div className="row main">
        <div className="col-md-6 col-sm-12 pt-5 pl-5">
          <div className="h1  text-center">All Campaigns</div>
          <div className=" text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum reiciendis illum eius nisi temporibus aliquid sit quis quasi, non
            assumenda ab quaerat eos natus blanditiis in soluta exercitationem optio enim!
          </div>
          {/* <Button id="test-button-primary" onClick={getCampaign} text="Create" theme="primary" type="button" /> */}
        </div>
        <div className="col-md-6 col-sm-12">
          <img
            style={{
              maxWidth: '60%',
              height: 'auto',
            }}
            alt=""
            src="content/images/bluezoneApp.png"
          ></img>
        </div>

        {data.map((item, index: number) => {
          return (
            <div className="col-md-6 mt-5" key={index}>
              <Link to={`/campaign/${item.attributes?.uid}`}>
                <div
                  style={{
                    position: 'relative',
                  }}
                >
                  <img
                    src={item.attributes?.coverImgUrl}
                    alt=""
                    className="ml-5"
                    style={{
                      width: '483px',
                      height: '300px',
                      objectFit: 'cover',
                      maxWidth: '70%',
                    }}
                  ></img>
                  <div
                    className="ml-5 font-bold"
                    style={{
                      position: 'absolute',
                      bottom: '0px',
                      width: '70%',
                      backgroundColor: 'rgba(10, 10, 10, 0.25)',
                    }}
                  >
                    <div
                      className="text-white ml-2"
                      style={{
                        opacity: '100%',
                      }}
                    >
                      {item.attributes?.name}
                    </div>
                    <div
                      className="text-white text-truncate ml-2"
                      style={{
                        maxWidth: '400px',
                      }}
                    >
                      {item.attributes?.description}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="ml-5">
                <span className="h3">Total Raised : </span>
                <span className="h3 text-success">{Math.round(item.attributes?.total) / 100000}</span>
                {/* <div className="col-md-6">{numberOfTransaction} Donation</div> */}
                <button className="btn btn-primary btn-border ml-5" onClick={() => donate(item.attributes?.uid)}>
                  Donate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Campaigns;
