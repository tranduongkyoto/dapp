import { AppContext } from 'app/provider/appContext';
import React, { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Information, Input, Tag } from 'web3uikit';
import { Modal } from 'web3uikit';
import { Typography } from 'web3uikit';
import token from '../Illustrations/images/various/token';
import styles from './NFT.styles';
const { DivModalStyled } = styles;
interface INFTModal {
  attributes?: Array<any>;
  setShowModal: (e: boolean) => void;
  address?: string;
  tokenId?: string;
  name?: string;
}

const NFTModal: React.FC<INFTModal> = ({ attributes, setShowModal, address, tokenId, name }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
    getValues,
    control,
  } = useForm({
    mode: 'onTouched',
  });
  const { nftAution, setnftAution } = useContext(AppContext);
  const history = useHistory();
  const onSubmit = async (data, e) => {
    const newNftAution = {
      address,
      tokenId,
      startingPrice: Number(data.price),
      discountRate: parseInt(((data.price - data.last) / 0.6048).toString()),
      name,
      lastPrice: Number(data.last),
    };
    setnftAution(newNftAution);
    window.localStorage.setItem('nftAution', JSON.stringify(newNftAution));
    e.target.reset();
    history.push('/campaign/create/nft');
  };
  const isDisable = nftAution !== null;
  const maxDiscount = getValues().price ? parseInt(getValues().price.toString()) : 99999;
  return (
    <Modal
      isVisible
      isCentered
      hasFooter={false}
      headerHasBottomBorder={false}
      title={'NFT Aution'}
      onCloseButtonPressed={() => setShowModal(false)}
    >
      <div className="row mb-3">
        {/* <button onClick={() => test()}>TEST</button> */}
        <div className="col-md-4 col-sm-12">
          <img src="content/images/nftItem.png"></img>
        </div>
        <div className="col-md-8 col-sm-12">
          <div>
            <Typography>Name : </Typography>
            <Typography className=" font-weight-bold ">{name}</Typography>
          </div>
          <div>
            <Typography>Address : </Typography>
            <Typography className=" font-weight-bold ">{address}</Typography>
          </div>
          <div>
            <Typography>Token ID : </Typography>
            <Typography className=" font-weight-bold ">{tokenId}</Typography>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '16px',
              border: 'none',
              boxSizing: 'border-box',
              lineHeight: 1,
              margin: 0,
              outline: 'none',
            }}
          >
            <div
              className="h4"
              style={{
                fontWeight: '700',
                color: '#68738D',
              }}
            >
              Set Price for Auction
            </div>
            <Controller
              name="price"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  label="Starting Price"
                  validation={{
                    required: true,
                    numberMin: 10,
                    numberMax: 9999999,
                  }}
                  type="number"
                  style={{
                    marginTop: '30px',
                  }}
                />
              )}
            />

            <Controller
              name="last"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  label="Last Price"
                  validation={{
                    required: true,
                    numberMin: 0,
                    numberMax: maxDiscount,
                  }}
                  type="number"
                  style={{
                    marginTop: '30px',
                  }}
                />
              )}
            />
            <button
              type="submit"
              className="mt-4"
              style={{
                borderRadius: '15px',
                width: '100px',
                height: '40px',
                backgroundColor: '#21BF96',
                color: 'white',
                border: 'hidden',
              }}
              disabled={isDisable}
            >
              Aution
            </button>
            <button
              type="reset"
              className=" ml-1 mt-4"
              style={{
                borderRadius: '15px',
                width: '100px',
                height: '40px',
                backgroundColor: 'red',
                color: 'white',
                border: 'hidden',
              }}
              onClick={() => reset()}
            >
              Clear
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default NFTModal;
