import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';

export default function Selection() {
  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-2"></div>
        <div className="col-md-4 col-sm-12 pt-5 pl-5">
          <div className="h1  text-center">
            {' '}
            <Translate contentKey="campaign.title"></Translate>
          </div>
          {/* <div className="row">
            <div className="col-sm-12 col-md-6 text-right pt-5">
              <button className="btn btn-lg btn-warning btn-border">Create</button>
            </div>
            <div className="col-sm-12 col-md-6 text-left pt-5">
              <button className="btn btn-lg btn-info btn-border">Donate</button>
            </div>
          </div> */}
        </div>
        <div className="col-md-6 col-sm-12">
          <img
            style={{
              maxWidth: '40%',
              height: 'auto',
            }}
            alt=""
            src="content/images/bluezoneApp.png"
          ></img>
        </div>

        <div className="col-md-6 col-sm-12 text-center">
          <Link to={`/campaign/create/traditional`} style={{ textDecoration: 'none' }}>
            {/* <img src="content/images/transparent.png"></img> */}
            <img src="content/images/donate.png"></img>
            <div className="h1">
              {' '}
              <Translate contentKey="campaign.crypto.title"></Translate>
            </div>
          </Link>
        </div>
        <div className="col-md-6 col-sm-12 text-center">
          <Link to={`/campaign/create/nft`} style={{ textDecoration: 'none' }}>
            <img src="content/images/nftItem.png"></img>
            <div className="h1">
              {' '}
              <Translate contentKey="campaign.nft.title"></Translate>
            </div>
          </Link>
        </div>
        {/* <div className="col-md-4 col-sm-12">
          <Link to={`/campaign/create/1`} style={{ textDecoration: 'none' }}>
            <div className="h1">Tổ chức hoạt động</div>
            <div>Tổ chức hoạt động để nhận quyên góp</div>
            <div></div>
          </Link>
        </div> */}
      </div>
    </>
  );
}
