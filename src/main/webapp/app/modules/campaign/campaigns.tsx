import React, { Attributes, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Input, Button, DatePicker, Select, TabList, Tab, Icon } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery } from 'react-moralis';
import axios from 'axios';
import { translate } from 'react-jhipster';
import CampaignItem from './campaignItem';

const Campaigns = () => {
  const { Moralis } = useMoralis();
  const [list, setList] = useState<any>();
  const { data, isLoading, error } = useMoralisQuery('Camp');
  const history = useHistory();

  const donate = id => {
    history.push(`/campaign/${id}`);
  };
  const buy = id => {
    history.push(`/auction/${id}`);
  };

  const getBalanceOf = async (id: string) => {
    const data = await axios.get(
      `https://api-ropsten.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x07865c6E87B9F70255377e024ace6630C1Eaa37F&address=${id}&tag=latest&apikey=FH674SA8K1BFH2SFB7KXYZXFB5GS63IXM4`
    );
    if (data?.data?.result) {
      return parseInt(data?.data?.result) / 1000000;
    } else return 0;
  };
  // console.log(getBalanceOf());
  if (!data) {
    return <div>No Response</div>;
  }
  return (
    <>
      <div className="row main">
        {/* {data
          .filter(item => !item.attributes?.isEnd)
          .map((item, index: number) => {
            return (
              <div className="col-md-4 mt-5" key={index}>
                <Link to={`/campaign/${item.attributes?.campaignAddress}`}>
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
                        width: '487px',
                        height: '300px',
                        objectFit: 'cover',
                        maxWidth: '60%',
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
                  <span className="h3">{translate('campaign.crypto.raise')} </span>
                  <span className="h3 text-success">{}</span>
                  <button className="btn btn-primary btn-border ml-5" onClick={() => donate(item.attributes?.uid)}>
                    {translate('campaign.crypto.donate')}
                  </button>
                </div>
              </div>
            );
          })} */}
      </div>
      <div className="row main">
        {data
          .filter(item => !item.attributes?.isEnd)
          .map((item, index: number) => {
            return (
              <div className="col-md-4 mt-5" key={index}>
                {/* <Link to={`/campaign/${item.attributes?.campaignAddress}`}> */}
                <CampaignItem
                  campaignAddress={item.attributes?.campaignAddress}
                  name={item.attributes?.name}
                  goal={item.attributes?.goal}
                  coverImgUrl={item.attributes?.coverImgUrl}
                />
                {/* </Link> */}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Campaigns;
