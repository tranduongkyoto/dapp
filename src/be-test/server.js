const express = require('express');
const app = express();
const port = 3000;

app.get('/test', (req, res) => {
  const data = {
    data: [
      { name: '江苏', value: 1000, type: '销售额' },
      { name: '山东', value: 800, type: '销售额' },
      { name: '安徽', value: 1500, type: '销售额' },
    ],
  };
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
