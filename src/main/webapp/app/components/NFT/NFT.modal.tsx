import { AppContext } from 'app/provider/appContext';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Information } from 'web3uikit';
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
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });
  const { nftAution, setnftAution } = useContext(AppContext);

  const onSubmit = async (data, e) => {
    const newNftAution = [
      ...nftAution,
      {
        address,
        tokenId,
        startingPrice: Number(data.price),
        discountRate: Number(data.rate),
        name,
      },
    ];
    setnftAution(newNftAution);
    window.localStorage.setItem('nftAution', JSON.stringify(newNftAution));
    e.target.reset();
  };
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <span className="mr-2">Starting Price</span>
              <input
                type="number"
                //placeholder="Name"
                {...register('price', {
                  required: 'This field is required',
                  min: {
                    value: 1,
                    message: 'Min is 1',
                  },
                  max: {
                    value: 99999,
                    message: 'Max length is 99999',
                  },
                })}
                style={{
                  borderRadius: '15px',
                  width: '200px',
                  height: '30px',
                }}
              />
              {errors.price && <p>{errors.price.message}</p>}
            </div>
            <div className="mt-2">
              <span className="mr-2 ">Discount Rate</span>
              <input
                type="number"
                {...register('rate', {
                  required: 'This field is required',
                  min: {
                    value: 1,
                    message: 'Min is 1%',
                  },
                  max: {
                    value: 99,
                    message: 'Max is 99%',
                  },
                })}
                style={{
                  borderRadius: '15px',
                  width: '100px',
                  height: '30px',
                }}
              />
              {errors.rate && <p>{errors.rate.message}</p>}
            </div>
            <button
              type="submit"
              className="mt-2"
              style={{
                borderRadius: '15px',
                width: '100px',
                height: '40px',
                backgroundColor: '#21BF96',
                color: 'white',
                border: 'hidden',
              }}
            >
              Aution
            </button>
            <button
              type="reset"
              className=" ml-1 mt-2"
              style={{
                borderRadius: '15px',
                width: '100px',
                height: '40px',
                backgroundColor: 'red',
                color: 'white',
                border: 'hidden',
              }}
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
