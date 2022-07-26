import React, { Attributes, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Input, Button, DatePicker, Select, TabList, Tab, Icon } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery } from 'react-moralis';
import axios from 'axios';
import { translate } from 'react-jhipster';
import OrgItem from '../campaign/orgItem';

const Organizations = () => {
  const { Moralis } = useMoralis();
  const [list, setList] = useState<any>();
  const { data, isLoading, error } = useMoralisQuery('Orgs');
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
  if (data) {
    console.log(data);
  }
  return (
    <>
      <div className="row main">
        {data.map((item, index: number) => {
          return (
            <div className="col-md-4 mt-5" key={index}>
              {/* <Link to={`/campaign/${item.attributes?.campaignAddress}`}> */}
              <OrgItem
                organizationAddress={item.attributes?.OrganizationAddress}
                name={item.attributes?.name}
                description={item.attributes?.description}
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

export default Organizations;
