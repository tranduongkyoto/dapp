import { useNotificationCustom } from 'app/web3utils/notification';
// import usehandleNewNotification from 'app/web3utils/notification2';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMoralis, useMoralisCloudFunction } from 'react-moralis';
import { useNotification } from 'web3uikit';
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
  } = useForm({
    mode: 'onTouched',
  });

  const onSubmit = async (data, e) => {
    const params = {
      _ApplicationId: '1zhV0q1IwQgA5j5qLyIj0oxzEvMRR523m69IRq0g',
      username: username,
      url: data.url,
      email: email,
    };

    // fetch({
    //   params,
    //   onSuccess: data => {
    //     console.log(data);
    //     handleNewNotification('success', 'Email has been sent!');
    //   },
    // });
    handleNewNotification2('success', 'Test Email');
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
        <div className="col-md-8 col-sm-12 mt-5">
          <div className="h4">User Name : {username}</div>
          <div className="h4">Email : {email}</div>
          <div className="justify-content-center ">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="h4">New Campaign Url</div>
                <input
                  type="url"
                  {...register('url', {
                    required: 'This field is required',
                    minLength: {
                      value: 5,
                      message: 'Min length is 20',
                    },
                    maxLength: {
                      value: 200,
                      message: 'Max length is 300',
                    },
                  })}
                  style={{
                    borderRadius: '15px',
                    width: '500px',
                    height: '40px',
                  }}
                />
                {errors.url && <p>{errors.des.url}</p>}
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
                Create
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
};

export default SendNewCamp;
