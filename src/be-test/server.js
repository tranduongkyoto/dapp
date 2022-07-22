const express = require('express');
const axios = require('axios');
const app = express();
const port = 7000;

app.get('/campaign', async (req, res) => {
  console.log(req.query);
  const result = await axios.get(
    'https://api-testnet.bscscan.com/api?module=account&action=tokentx&contractaddress=0x07865c6E87B9F70255377e024ace6630C1Eaa37F&address=0x8ccbc37ef5b63932e8703ecb0efd30b8a670192f&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=FH674SA8K1BFH2SFB7KXYZXFB5GS63IXM4'
  );
  const arr = result.data.result.map(item => {
    console.log(new Date(parseInt(item.timeStamp * 1000)).toString().slice(4, 21));
    return {
      name: new Date(parseInt(item.timeStamp * 1000)).toString().slice(4, 21),
      value: parseInt(item.value) / 1000000000000000000,
    };
  });
  const data = {
    data: [...arr],
  };
  res.send(data);
});

app.get('/report', (req, res) => {
  const data = {
    data: [
      { name: 'Campaign', value: '10' },
      { name: 'Auction', value: '5' },
      { name: 'Donate', value: '25' },
      { name: 'Account', value: '2' },
      { name: 'ERC20 Transfer', value: '30' },
      { name: 'NFT Transfer', value: '20' },
    ],
  };
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
