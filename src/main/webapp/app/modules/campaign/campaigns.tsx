import React, { Attributes, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Input, Button, DatePicker, Select, TabList, Tab, Icon } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery } from 'react-moralis';
import axios from 'axios';

const Campaigns = () => {
  const { Moralis } = useMoralis();
  const [list, setList] = useState<any>();
  const { data, isLoading, error } = useMoralisQuery('Campaigns');
  const { data: auction, error: auctinErr } = useMoralisQuery('Auction');
  const history = useHistory();

  const donate = id => {
    history.push(`/campaign/${id}`);
  };
  const buy = id => {
    history.push(`/auction/${id}`);
  };
  if (auction) {
    console.log(auction);
  }
  const getBalanceOf = async (id: string) => {
    const data = await axios.get(
      `https://api-ropsten.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x07865c6E87B9F70255377e024ace6630C1Eaa37F&address=${id}&tag=latest&apikey=FH674SA8K1BFH2SFB7KXYZXFB5GS63IXM4`
    );
    if (data?.data?.result) {
      return parseInt(data?.data?.result) / 1000000;
    } else return 0;
  };
  // console.log(getBalanceOf());
  return (
    <>
      <div className="row main">
        {/* <div className="col-md-6 col-sm-12 pt-5 pl-5">
          <div className="h1  text-center">All Campaigns</div>
          <div className=" text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum reiciendis illum eius nisi temporibus aliquid sit quis quasi, non
            assumenda ab quaerat eos natus blanditiis in soluta exercitationem optio enim!
          </div>
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
        </div> */}
        {data &&
          data.map((item, index: number) => {
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
                  <span className="h3">Total Raised : </span>
                  <span className="h3 text-success">{}</span>
                  <button className="btn btn-primary btn-border ml-5" onClick={() => donate(item.attributes?.uid)}>
                    Donate
                  </button>
                </div>
              </div>
            );
          })}
        {auction &&
          auction.map((item, index: number) => {
            return (
              <div className="col-md-6 mt-5" key={index}>
                <Link to={`/auction/${item.attributes?.campaignAddress}`}>
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
                        height: '50px',
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
                  <div>{item.attributes?.nft}</div>
                  <div>{item.attributes?.tokenId}</div>
                  <button className="btn btn-primary btn-border ml-5" onClick={() => buy(item.attributes?.campaignAddress)}>
                    Buy
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
