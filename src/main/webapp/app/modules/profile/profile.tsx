import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from 'react-moralis';
import { defaultImgs } from '../../shared/util/defaultImgs';
import { messages } from 'app/config/constants';
import { IPosition, notifyType } from 'web3uikit/dist/components/Notification/types';
import { TIconType } from 'web3uikit/dist/components/Icon/collection';
import { useLocation } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

export default function Profile() {
  const { Moralis } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();

  const handleNewNotification = (type: notifyType, message?: string, icon?: TIconType, position?: IPosition) => {
    dispatch({
      type,
      message,
      title: 'Notification',
      icon,
      position: position || 'bottomL',
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const onSubmit = async (data, e) => {
    console.log(data);
    // const User = Moralis.Object.extend('_User');
    // const user = new User();
    let user = Moralis.User.current();
    console.log(user);
    user
      .save({
        username: data.name,
        email: data.email,
        isUpdateProfile: true,
      })
      .then(
        user => {
          // The object was saved successfully.
          handleNewNotification('success', 'Update Profile Successfully');
        },
        error => {
          // The save failed.
          // error is a Moralis.Error with an error code and message.
          handleNewNotification('error', error.message);
        }
      );
    e.target.reset();
  };

  return (
    <>
      <div className="row mt-5">
        <div className="col-md-4 col-sm-12">
          <img
            style={{
              maxWidth: '60%',
              height: 'auto',
            }}
            alt=""
            src="content/images/bluezoneApp.png"
          ></img>
        </div>
        <div className="col-md-8 col-sm-12">
          {/* <div className=" text-center font-weight-bold ">Create Campaign</div> */}
          <div className="h1">Profile Setup</div>
          <div className=" justify-content-center ">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="h4">Name</div>
                <input
                  type="text"
                  //placeholder="Name"
                  {...register('name', {
                    required: 'This field is required',
                    minLength: {
                      value: 2,
                      message: 'Min length is 2',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Max length is 50',
                    },
                  })}
                  style={{
                    borderRadius: '15px',
                    width: '500px',
                    height: '40px',
                  }}
                />
                {errors.name && <p>{errors.name.message}</p>}
              </div>
              <div>
                <div className="h4">Email</div>
                <input
                  type="email"
                  //placeholder="Description"
                  {...register('email', {
                    required: 'This field is required',
                    minLength: {
                      value: 5,
                      message: 'Min length is 10',
                    },
                    maxLength: {
                      value: 200,
                      message: 'Max length is 30',
                    },
                    // pattern: {
                    //   value: /^S+@S+$/i,
                    //   message: 'Email not found, sample: test@gmail.com',
                    // },
                  })}
                  style={{
                    borderRadius: '15px',
                    width: '500px',
                    height: '40px',
                  }}
                />
                {errors.description && <p>{errors.description.message}</p>}
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
                Update
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
      </div>
    </>
  );
}