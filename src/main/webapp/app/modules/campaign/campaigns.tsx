import React, { Attributes, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Input, Button, DatePicker, Select, TabList, Tab, Icon, Tag } from 'web3uikit';
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
      <div>
        <div className="row justify-content-center">
          <Tag color="blue" text={translate('global.ongoing')} fontSize="20px"></Tag>
        </div>
        <div className="row main mt-5">
          {data.map((item, index: number) => {
            return (
              <CampaignItem
                campaignAddress={item.attributes?.campaignAddress}
                name={item.attributes?.name}
                goal={item.attributes?.goal}
                coverImgUrl={item.attributes?.coverImgUrl}
                onGoing={true}
              />
            );
          })}
        </div>
      </div>
      <div>
        <div className="row justify-content-center mt-5">
          <Tag color="blue" text={translate('global.ended')} fontSize="20px"></Tag>
        </div>
        <div className="row main mt-5">
          {data.map((item, index: number) => {
            return (
              <CampaignItem
                campaignAddress={item.attributes?.campaignAddress}
                name={item.attributes?.name}
                goal={item.attributes?.goal}
                coverImgUrl={item.attributes?.coverImgUrl}
                onGoing={false}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Campaigns;
