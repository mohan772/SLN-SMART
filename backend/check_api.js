const http = require('http');

const checkApi = (path) => {
  http.get(`http://localhost:5000/api${path}`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`PATH: ${path}`);
      console.log(`STATUS: ${res.statusCode}`);
      try {
        const json = JSON.parse(data);
        console.log(`COUNT: ${json.count || json.data?.length || 0}`);
        if (json.data && json.data.length > 0) {
          console.log(`FIRST ITEM NAME: ${json.data[0].name}`);
        }
      } catch (e) {
        console.log('DATA IS NOT JSON');
        console.log(data.substring(0, 100));
      }
      console.log('-------------------');
    });
  }).on('error', (err) => {
    console.error(`Error fetching ${path}: ${err.message}`);
  });
};

setTimeout(() => {
  checkApi('/categories');
  checkApi('/products');
}, 2000);
