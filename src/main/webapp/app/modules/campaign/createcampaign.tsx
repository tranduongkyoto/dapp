import './campaign.scss';
import React from 'react';
const CreateCampaign = () => {
  return (
    <>
      <div className="row main">
        <div className="col-md-6 col-sm-12 pt-5 pl-5">
          <p className="h1  text-center">All Campaigns</p>
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
        </div>
      </div>
    </>
  );
};

export default CreateCampaign;
