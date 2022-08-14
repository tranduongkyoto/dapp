import React, { useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { Skeleton, Tag, Typography } from 'web3uikit';
import { ICampaignProps } from './types';
import styles from './styles';
import { Link } from 'react-router-dom';
import NFTUtils from '../../components/NFT/NFT.utils';
const { image } = NFTUtils;
const { DivStyled } = styles;
import colors from '../../styles/colors';
import axios from 'axios';
import { ethers } from 'ethers';
import * as cam from '../contract/campaign.json';

interface StatusType {
  isEndTime: boolean;
  drawed: boolean;
  balanceOf: number;
  raised: number;
}
const CampaignItem: React.FC<ICampaignProps> = ({ campaignAddress, name, description, coverImgUrl, goal, onGoing }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [balanceOf, setBalanceOf] = useState<number>(0);
  const { data, error } = useMoralisQuery('Camp', query => query.contains('campaignAddress', campaignAddress));
  const { Moralis, account, isInitialized } = useMoralis();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [status, setStatus] = useState<StatusType>({
    isEndTime: false,
    drawed: false,
    balanceOf: 0,
    raised: 0,
  });

  if (data) {
    //console.log(data);
  }

  useEffect(() => {
    //console.log('34');
    const getBalanceOf = async () => {
      const data = await axios.get(
        `https://api-testnet.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684&address=${campaignAddress}&tag=latest&apikey=FH674SA8K1BFH2SFB7KXYZXFB5GS63IXM4`
      );
      //console.log(data);
      if (data?.data?.result) {
        if (data?.data?.result == '0') {
          setBalanceOf(0);
          if (isLoading) setIsLoading(false);
        } else {
          if (!balanceOf) setBalanceOf(parseInt(data?.data?.result) / 1000000000000000000);
          if (isLoading) setIsLoading(false);
        }
      }
    };
    const getStatus = async () => {
      const campaign = new ethers.Contract(campaignAddress, cam.abi, provider.getSigner());
      try {
        const transaction = await campaign.getStatus('0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684');
        if (transaction) {
          const obj = {
            isEndTime: transaction?._isEndTime,
            drawed: transaction?._drawed,
            balanceOf: parseInt(transaction._balanceOf._hex, 16) / 1000000000000000000,
            raised: parseInt(transaction._raised._hex, 16),
          };
          console.log(obj);
          setStatus(obj);
          if (isLoading2) setIsLoading2(false);
        }
        if (isLoading) setIsLoading(false);
      } catch (error: any) {
        console.log(JSON.parse(JSON.stringify(error)));
      }
    };
    //getBalanceOf();
    getStatus();
  }, []);
  if (isLoading || isLoading2) {
    return (
      <div data-testid="nft-metadata-loading">
        <DivStyled id="nft">
          <Skeleton theme="text" width="100%" height="200px" />
          <div id="information">
            <Skeleton theme="text" width="30%" height="18px" />
            <Skeleton theme="image" width="60px" height="60px" />
          </div>
        </DivStyled>
      </div>
    );
  }
  if (onGoing && status && (status.isEndTime || status.drawed)) {
    return <></>;
  }
  if (!onGoing && status && !(status.isEndTime || status.drawed)) {
    return <></>;
  }
  return (
    <>
      <div className="col-md-4">
        <DivStyled id="nft">
          <Link
            to={`/campaign/${campaignAddress}`}
            style={{
              textDecoration: 'none',
            }}
          >
            {image('', coverImgUrl)}
          </Link>

          <div className="container">
            <div className="row">
              <div className="col-md-5">
                <div id="nft-info">
                  <div>
                    <Typography variant="caption14" color={colors.blueDark}>
                      {name}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mt-2">
                <Tag color="blue" text={(parseInt(goal) / 1000000000000000000).toString()} />
              </div>
              <div className="col-md-3 mt-2">
                <Tag color="yellow" text={status ? status.balanceOf.toString() : '0'} />
              </div>
            </div>
          </div>
        </DivStyled>
      </div>
    </>
  );
};

export default CampaignItem;
