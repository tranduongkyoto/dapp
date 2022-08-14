import React, { useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { Skeleton, Tag, Typography } from 'web3uikit';
import { ICampaignProps, IOrgProps } from './types';
import styles from './styles';
import { Link } from 'react-router-dom';
import NFTUtils from '../../components/NFT/NFT.utils';
const { image } = NFTUtils;
const { DivStyled } = styles;
import colors from '../../styles/colors';
import axios from 'axios';
const OrgItem: React.FC<IOrgProps> = ({ organizationAddress, name, description, coverImgUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [balanceOf, setBalanceOf] = useState<number>(0);
  const { data, error } = useMoralisQuery('Orgss', query => query.contains('OrganizationAddress', organizationAddress));
  const { Moralis, account, isInitialized } = useMoralis();
  if (data) {
    console.log(data);
  }

  useEffect(() => {
    console.log('34');
    const getBalanceOf = async () => {
      const data = await axios.get(
        `https://api-testnet.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684&address=${organizationAddress}&tag=latest&apikey=FH674SA8K1BFH2SFB7KXYZXFB5GS63IXM4`
      );
      console.log(data);
      if (data?.data?.result) {
        console.log(data?.data?.result);
        if (data?.data?.result == '0') {
          setBalanceOf(0);
          if (isLoading) setIsLoading(false);
        } else {
          console.log(data?.data?.result);
          setBalanceOf(parseInt(data?.data?.result) / 1000000000000000000);
          if (isLoading) setIsLoading(false);
        }
      }
    };
    getBalanceOf();
  }, []);
  if (isLoading) {
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

  return (
    <>
      {' '}
      <div className="mt-5">
        <DivStyled id="nft">
          <Link
            to={`/organization/${organizationAddress}`}
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
                    {/* <Typography variant="caption12">{goal}</Typography> */}
                  </div>
                </div>
              </div>
              {/* <div className="col-md-4 mt-2">
                <Tag color="blue" text={(parseInt(goal) / 1000000000000000000).toString()} />
              </div> */}
              <div className="col-md-3 mt-2">
                <Tag color="yellow" text={balanceOf.toString()} />
              </div>
            </div>
          </div>
        </DivStyled>
      </div>
    </>
  );
};

export default OrgItem;
