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

  if (!data) {
    return <div>No Response</div>;
  }
  return (
    <>
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
