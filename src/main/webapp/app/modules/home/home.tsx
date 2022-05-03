import './home.scss';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Alert, Button } from 'reactstrap';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const { account } = props;

  return (
    <>
      <div className="row main">
        <div className="col-md-6 col-sm-12 pt-5 pl-5">
          <p className="h1  text-center">Change Our World, with Crypto</p>
          <div className=" text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum reiciendis illum eius nisi temporibus aliquid sit quis quasi, non
            assumenda ab quaerat eos natus blanditiis in soluta exercitationem optio enim!
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-6 text-right pt-5">
              <button className="btn btn-lg btn-warning">Create</button>
            </div>
            <div className="col-sm-12 col-md-6 text-left pt-5">
              <button className="btn btn-lg btn-info">Donate</button>
            </div>
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
      <div className="row text-center">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <div className="h1">Why should you donate with cryptocurrency?</div>
          <div className="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum reiciendis illum eius nisi temporibus aliquid sit quis quasi, non
            assumenda ab quaerat eos natus blanditiis in soluta exercitationem optio enim!
          </div>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-md-4 col-sm-12">
          <img src="content/images/transparent.png"></img>
          <div className="h1">Transparent</div>
          <div>Maximum privacy protect for donors</div>
          <div>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam ullam dolor, debitis veniam non adipisci corporis saepe
            dignissimos similique consequuntur quia quae, quo exercitationem et mollitia necessitatibus impedit recusandae incidunt!
          </div>
        </div>
        <div className="col-md-4 col-sm-12">
          <img src="content/images/donate.png"></img>
          <div className="h1">Easy to Donate</div>
          <div>Maximum privacy protect for donors</div>
          <div>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam ullam dolor, debitis veniam non adipisci corporis saepe
            dignissimos similique consequuntur quia quae, quo exercitationem et mollitia necessitatibus impedit recusandae incidunt!
          </div>
        </div>
        <div className="col-md-4 col-sm-12">
          <img src="content/images/nftItem.png"></img>
          <div className="h1">Funny & Value</div>
          <div>Maximum privacy protect for donors</div>
          <div>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam ullam dolor, debitis veniam non adipisci corporis saepe
            dignissimos similique consequuntur quia quae, quo exercitationem et mollitia necessitatibus impedit recusandae incidunt!
          </div>
        </div>
      </div>

      <div className="row mt-5 middle justify-content-center">
        <div className="col-md-4"></div>
        <div className="col-md-4 col-sm-12 my-5">
          <div className="h1">What can you do?</div>
          <div className="my-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum reiciendis illum eius nisi temporibus aliquid sit quis quasi, non
            assumenda ab quaerat eos natus blanditiis in soluta exercitationem optio enim!
          </div>
        </div>
        <div className="col-md-4"></div>
        <div className="col-md-4 col-sm-12 my-5">
          <div className="row">
            <div className="col-md-4">
              <img src="content/icons/cryptoBlack.svg"></img>
            </div>
            <div className="col-md-8">
              <div className="h3">Donate by Crypto</div>
              <div>Donate cryptocurrency to public wallet</div>
              <button className="btn btn-primary">View More</button>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-sm-12 my-5">
          <div className="row">
            <div className="col-md-4">
              <img src="content/icons/imageBlack.svg"></img>
            </div>
            <div className="col-md-8">
              <div className="h3">Donate by NFTs</div>
              <div>Donate your NFTs for ours</div>
              <button className="btn btn-primary">View More</button>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-sm-12 my-5">
          <div className="row">
            <div className="col-md-4">
              <img src="content/icons/imageBlack.svg"></img>
            </div>
            <div className="col-md-8">
              <div className="h3">Min Random NFT</div>
              <div>Donate cryptocurrency to public wallet</div>
              <button className="btn btn-primary">View More</button>
            </div>
          </div>
        </div>
        <div className="col-md-8 tran-lastest my-5">
          <div className="row py-3 justify-content-center">
            <div className="col-md-auto col-sm-4">
              <img src="content/icons/cryptoPurple.svg" className="pb-1"></img>
            </div>
            <div className="col-md-auto col-sm-8">0x6C35Bae9EC2C7Bbbb366AD5008444A6D354334ee</div>
            <div className="col-md-auto col-sm-4 text-warning">10 ETH</div>
            <div className="col-md-auto col-sm-4 font-weight-bold">Lastest</div>
            <div className="col-md-auto col-sm-4 font-italic">Thank for great action!</div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center mt-5"></div>
      <div className="row justify-content-center text-center my-5">
        <div className="h1">Testimotional</div>
      </div>
      <div className="row justify-content-center ">
        <div className="col-md-8 text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum reiciendis illum eius nisi temporibus aliquid sit quis quasi, non
          assumenda ab quaerat eos natus blanditiis in soluta exercitationem optio enim!
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-6 col-sm-12">
          <div className="row">
            <div className="col-md-2">
              <img
                src="content/images/quotes.png"
                style={{
                  width: '30px',
                  marginRight: '20px',
                }}
              ></img>
            </div>
            <div className="col-md-10">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt ipsam fuga fugit iusto laudantium, ut voluptatum,
              voluptatibus amet recusandae dicta veritatis quas maiores! Illo quo consequatur dignissimos ad officia voluptates.
              <div className="row justify-content-center">
                <div className="col-md-5 guest-icon py-2 text-center my-3">
                  <img src="content/images/designerAvatar.png" alt="" />
                  <span className="ml-1">Khoi Doan, Cohost</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="row">
            <div className="col-md-2">
              <img
                src="content/images/quotes.png"
                style={{
                  width: '30px',
                  marginRight: '20px',
                }}
              ></img>
            </div>
            <div className="col-md-10">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt ipsam fuga fugit iusto laudantium, ut voluptatum,
              voluptatibus amet recusandae dicta veritatis quas maiores! Illo quo consequatur dignissimos ad officia voluptates.
              <div className="row justify-content-center">
                <div className="col-md-4 guest-icon py-2 text-center my-3">
                  <img src="content/images/designerAvatar.png" alt="" />
                  <span className="ml-1">Le Dung, Cohost</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
