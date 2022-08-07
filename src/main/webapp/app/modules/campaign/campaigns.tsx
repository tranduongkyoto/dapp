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
          <Tag color="blue" text="Ongoing" fontSize="20px"></Tag>
        </div>
        <div className="row main mt-5">
          {data.map((item, index: number) => {
            return (
              <div key={index}>
                <CampaignItem
                  campaignAddress={item.attributes?.campaignAddress}
                  name={item.attributes?.name}
                  goal={item.attributes?.goal}
                  coverImgUrl={item.attributes?.coverImgUrl}
                  onGoing={true}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="row justify-content-center">
          <Tag color="grey" text="Ended" fontSize="20px"></Tag>
        </div>
        <div className="row main mt-5">
          {data.map((item, index: number) => {
            return (
              <div key={index}>
                <CampaignItem
                  campaignAddress={item.attributes?.campaignAddress}
                  name={item.attributes?.name}
                  goal={item.attributes?.goal}
                  coverImgUrl={item.attributes?.coverImgUrl}
                  onGoing={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Campaigns;
