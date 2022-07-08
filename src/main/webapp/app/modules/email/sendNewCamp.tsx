import { useNotificationCustom } from 'app/web3utils/notification';
// import usehandleNewNotification from 'app/web3utils/notification2';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMoralis, useMoralisCloudFunction } from 'react-moralis';
import { Form, Input, useNotification } from 'web3uikit';
import { TIconType } from 'web3uikit/dist/components/Icon/collection';
import { IPosition, notifyType } from 'web3uikit/dist/components/Notification/types';

const SendNewCamp = () => {
  const { fetch } = useMoralisCloudFunction('sendNewCampaignEmailToUser', { autoFetch: false });
  const { Moralis } = useMoralis();
  const username = 'Dace';
  const email = 'gojed25227@runqx.com';
  const { handleNewNotification, handleNewNotification2 } = useNotificationCustom();
  //const dispatch = useNotification();
  // const handleNewNotification = (type: notifyType, message?: string, icon?: TIconType, position?: IPosition) => {
  //   dispatch({
  //     type,
  //     message,
  //     title: 'Notification',
  //     icon,
  //     position: position || 'bottomL',
  //   });
  // };

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
    reset();
    const params = {
      _ApplicationId: '1zhV0q1IwQgA5j5qLyIj0oxzEvMRR523m69IRq0g',
      username: username,
      url: data.url,
      email: data.email,
    };
    fetch({
      params,
      onSuccess: data => {
        handleNewNotification('success', 'Email has been sent!');
        e.target().reset();
      },
    });
    e.target().reset();
  };

  return (
    <>
      <div className="row">
        <div className="col-md-4 col-sm-12">
          <img
            style={{
              maxWidth: '70%',
              height: 'auto',
            }}
            alt=""
            src="content/images/bluezoneApp.png"
          ></img>
        </div>
        <div className="col-md-4 col-sm-12 mt-5">
          {/* <div className="h4">To User : {username}</div>
          <div className="h4">Email : {email}</div> */}
          <div className="justify-content-center ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="create-course-form"
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
                Send Email
              </div>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  return (
                    <Input
                      id="1"
                      {...field}
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
              <Controller
                name="url"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  return (
                    <Input
                      id="1"
                      {...field}
                      label="New Campaign Url"
                      validation={{
                        required: true,
                      }}
                      style={{
                        marginTop: '30px',
                      }}
                    />
                  );
                }}
              />
              <button
                type="submit"
                className="mt-5"
                style={{
                  borderRadius: '15px',
                  width: '100px',
                  height: '40px',
                  backgroundColor: '#21BF96',
                  color: 'white',
                  border: 'hidden',
                }}
              >
                Send
              </button>
              <button
                type="reset"
                className=" ml-1 mt-5"
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
      </div>
    </>
  );
};

export default SendNewCamp;
