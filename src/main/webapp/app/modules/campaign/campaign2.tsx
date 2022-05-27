import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

export default function Campaign2() {
  return (
    <>
      <div className="row">
        <div className="col-md-8 col-sm-12 pt-5 pl-5">
          <div className="h1  text-center">Change Our World, with Crypto</div>
          <div className=" text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum reiciendis illum eius nisi temporibus aliquid sit quis quasi, non
            assumenda ab quaerat eos natus blanditiis in soluta exercitationem optio enim!
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-6 text-right pt-5">
              <button className="btn btn-lg btn-warning btn-border">Create</button>
            </div>
            <div className="col-sm-12 col-md-6 text-left pt-5">
              <button className="btn btn-lg btn-info btn-border">Donate</button>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-sm-12">
          <img
            style={{
              maxWidth: '50%',
              height: 'auto',
            }}
            alt=""
            src="content/images/bluezoneApp.png"
          ></img>
        </div>

        <div className="col-md-4 col-sm-12">
          <Link to={`/campaign/create/traditional`} style={{ textDecoration: 'none' }}>
            <img src="content/images/transparent.png"></img>
            <div className="h1">Truyền thống</div>
            <div>Nhận quyên góp bằng tiền điện tử</div>
            <div>
              Bạn có thể gây quỹ và nhận tiền điện tử từ mọi người nếu chiến dịch của bạn gây ấn tượng được với họ. Tất cả mọi thứ sẽ minh
              bạch và rõ ràng nhờ Blockchain
            </div>
          </Link>
        </div>
        <div className="col-md-4 col-sm-12">
          <Link to={`/campaign/create/nft`} style={{ textDecoration: 'none' }}>
            <img src="content/images/donate.png"></img>
            <div className="h1">NFTs</div>
            <div>Nhận quyên góp bằng việc bán hoặc đấu giá NFTs</div>
            <div>
              Nếu bạn có NFTs giá trị, bạn có thể bán hoặc cho đấu giá nó. Mọi người sẽ tham gia và bạn nhận lại tiền điện tử nhờ chuyển
              nhượng NFTs đó.
            </div>
          </Link>
        </div>
        <div className="col-md-4 col-sm-12">
          <Link to={`/campaign/create/1`} style={{ textDecoration: 'none' }}>
            <img src="content/images/nftItem.png"></img>
            <div className="h1">Tổ chức hoạt động</div>
            <div>Tổ chức hoạt động để nhận quyên góp</div>
            <div></div>
          </Link>
        </div>
      </div>
    </>
  );
}
