const fetch = require('node-fetch');

const url = 'https://animedb1.p.rapidapi.com/manga';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '22ca8082d8mshf331df5b90c0554p108234jsn02cb6284000e',
    'x-rapidapi-host': 'animedb1.p.rapidapi.com'
  }
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}