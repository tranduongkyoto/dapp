import React, { useState, useRef, useEffect } from 'react';
import { Input, useNotification } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from 'react-moralis';
import { defaultImgs } from '../../shared/util/defaultImgs';
import { messages } from 'app/config/constants';
import { IPosition, notifyType } from 'web3uikit/dist/components/Notification/types';
import { TIconType } from 'web3uikit/dist/components/Icon/collection';
import { useLocation } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

export default function ProfileSetting() {
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
    control,
  } = useForm({
    mode: 'onTouched',
  });

  const onSubmit = async (data, e) => {
    console.log(data);
    let user = Moralis.User.current();
    await user
      .save({
        username: data.name,
        email: data.email,
        phoneNumber: data.phone,
        work: data.work,
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
    //e.target.reset();
  };

  return (
    <>
      <div className="row mt-4">
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
          <div className="h1">Profile Setup</div>
          <div className=" justify-content-center ">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    name={field.name}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    label="Name"
                    validation={{
                      required: true,
                      characterMinLength: 2,
                      characterMaxLength: 50,
                      // regExp: '^[^@s]+@[^@s]+.[^@s]+$',
                      // regExpInvalidMessage: 'That is not a valid email address',
                    }}
                    type="text"
                    style={{
                      marginTop: '30px',
                    }}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  return (
                    <Input
                      name={field.name}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      label="Email"
                      validation={{
                        required: true,
                        // regExp: '^[^@s]+@[^@s]+.[^@s]+$',
                        // regExpInvalidMessage: 'That is not a valid email address',
                      }}
                      type="email"
                      style={{
                        marginTop: '30px',
                      }}
                    />
                  );
                }}
              />
              {/* <div>
                <div className="h4">Phone Number</div>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'This field is required',
                    minLength: {
                      value: 10,
                      message: 'Min length is 10',
                    },
                    maxLength: {
                      value: 10,
                      message: 'Max length is 10',
                    },
                  })}
                  style={{
                    borderRadius: '15px',
                    width: '500px',
                    height: '40px',
                  }}
                />
                {errors.phone && <p>{errors.phone.message}</p>}
              </div> */}
              <Controller
                name="tel"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  return (
                    <Input
                      name={field.name}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      label="Phone Number"
                      validation={{
                        required: true,
                        regExp: '(84|0[3|5|7|8|9])+([0-9]{8})',
                        regExpInvalidMessage: 'That is not a valid viet nam phone number',
                      }}
                      style={{
                        marginTop: '30px',
                      }}
                    />
                  );
                }}
              />
              <Controller
                name="work"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    name={field.name}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    label="Work"
                    validation={{
                      required: true,
                      characterMinLength: 5,
                      characterMaxLength: 50,
                    }}
                    type="text"
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
              >
                Update
              </button>
              <button
                type="reset"
                className=" ml-2 mt-4"
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
