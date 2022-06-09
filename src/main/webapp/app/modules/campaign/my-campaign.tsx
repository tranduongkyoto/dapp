import React, { Attributes, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Input, Button, DatePicker, Select } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery } from 'react-moralis';

const MyCampaign = () => {
  const { Moralis } = useMoralis();
  const [list, setList] = useState<any>();
  const { data, isLoading, error } = useMoralisQuery('Campaign');
  const history = useHistory();

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

export default MyCampaign;
