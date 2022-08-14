import { NFT } from 'app/components/NFT';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { translate } from 'react-jhipster';
import { useMoralis } from 'react-moralis';
import { useHistory } from 'react-router-dom';
import { Button, Skeleton } from 'web3uikit';
import NFTUtils from '../../components/NFT/NFT.utils';
import styles from './styles';
import { INftAuctionProps } from './types';
const { DivStyled } = styles;
import * as abi from '../contract/nftAution.json';
import * as abi2 from '../contract/myNft.json';
import { useNotificationCustom } from 'app/web3utils/notification';

interface StatusType {
  isEndTime: boolean;
  isSell: boolean;
  isStart: boolean;
  drawed: boolean;
  currentPrice: number;
  buyer: string;
  buyPrice: number;
}
const StartNftAuctionItem: React.FC<INftAuctionProps> = ({ campaignAddress, nft, tokenId, onGoing, creator }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { Moralis, account, isInitialized } = useMoralis();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const history = useHistory();
  const { handleNewNotification } = useNotificationCustom();
  const [status, setStatus] = useState<StatusType>({
    isEndTime: false,
    isSell: false,
    isStart: false,
    drawed: false,
    currentPrice: null,
    buyer: '',
    buyPrice: null,
  });

  const start = async (nft, tokenId, from, to) => {
    try {
      const myNFT = new ethers.Contract(nft, abi2.abi, provider.getSigner());
      const transaction = await myNFT.transferFrom(from, to, tokenId);
      handleNewNotification('success', 'Contract is pending, Please wait! ');
      const res = await transaction.wait();
      if (res?.status == 1) {
        handleNewNotification('success', `Contract is confirmed with ${res?.confirmations} confirmations. Thank for!`);
        window.location.reload();
      }
    } catch (error: any) {
      console.log(error);
      handleNewNotification(
        'error',
        JSON.parse(JSON.stringify(error))?.error?.message
          ? JSON.parse(JSON.stringify(error))?.error?.message
          : JSON.parse(JSON.stringify(error))?.message
      );
    }
  };
  useEffect(() => {
    const getStatus = async () => {
      const nftAuction = new ethers.Contract(campaignAddress, abi.abi, provider.getSigner());
      try {
        const transaction = await nftAuction.getStatus();
        console.log(transaction);
        if (transaction) {
          const obj = {
            isEndTime: transaction?._isEndTime,
            isSell: transaction?._isSell,
            isStart: transaction?._isStart,
            drawed: transaction?._drawed,
            currentPrice: parseInt(transaction._currentPrice._hex, 16) / 1000000000000000000,
            buyPrice: parseInt(transaction._buyPrice._hex, 16) / 1000000000000000000,
            buyer: transaction?._buyer,
          };
          console.log(obj);
          setStatus(obj);
          if (isLoading) setIsLoading(false);
        }
        if (isLoading) setIsLoading(false);
      } catch (error: any) {
        console.log(JSON.parse(JSON.stringify(error)));
      }
    };
    getStatus();
  }, []);
  // if (isLoading) {
  //   return (
  //     <div data-testid="nft-metadata-loading">
  //       <DivStyled id="nft">
  //         <Skeleton theme="text" width="100%" height="200px" />
  //         <div id="information">
  //           <Skeleton theme="text" width="30%" height="18px" />
  //           <Skeleton theme="image" width="60px" height="60px" />
  //         </div>
  //       </DivStyled>
  //     </div>
  //   );
  // }
  // if (onGoing && status && (status.isEndTime || status.drawed)) {
  //   return <></>;
  // }
  if (status) {
    console.log(status);
  }
  if (status && (status.isStart || status.isSell)) {
    return <></>;
  }
  return (
    <>
      <div className="col-md-4 mt-5">
        <NFT address={nft} chain="bsc testnet" fetchMetadata tokenId={tokenId} isAuction={false} />
        <div className="row ml-5 justify-content-center ">
          <div className="col-md-5">
            {
              <Button
                id="test-button-primary"
                onClick={() => start(nft, tokenId, creator, campaignAddress)}
                text={translate('campaign.nft.start')}
                theme="primary"
                type="button"
              />
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default StartNftAuctionItem;
