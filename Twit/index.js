import got from 'got';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import { parse } from 'querystring';
import { createInterface } from 'readline';

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

const consumer_key = process.env.CONSUMER_KEY;
const consumer_secret = process.env.CONSUMER_SECRET;

const data = {
  "text": "Hello world!"
};

const endpointURL = `https://api.twitter.com/2/tweets`;

const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
const accessTokenURL = 'https://api.twitter.com/oauth/access_token';

const oauth = OAuth({
  consumer: {
    key: consumer_key,
    secret: consumer_secret
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

async function input(prompt) {
  return new Promise(async (resolve, reject) => {
    readline.question(prompt, (out) => {
      readline.close();
      resolve(out);
    });
  });
}

async function requestToken() {
  const authHeader = oauth.toHeader(oauth.authorize({
    url: requestTokenURL,
    method: 'POST'
  }));

  const req = await got.post(requestTokenURL, {
    headers: {
      Authorization: authHeader["Authorization"]
    }
  });
  if (req.body) {
    return parse(req.body);
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}

async function accessToken({ oauth_token, oauth_token_secret }, verifier) {
  const authHeader = oauth.toHeader(oauth.authorize({
    url: accessTokenURL,
    method: 'POST'
  }));
  const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`
  const req = await got.post(path, {
    headers: {
      Authorization: authHeader["Authorization"]
    }
  });
  if (req.body) {
    return parse(req.body);
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}

async function getRequest({ oauth_token, oauth_token_secret }) {
  const token = {
    key: oauth_token,
    secret: oauth_token_secret
  };

  const authHeader = oauth.toHeader(oauth.authorize({
    url: endpointURL,
    method: 'POST'
  }, token));

  const req = await got.post(endpointURL, {
    json: data,
    responseType: 'json',
    headers: {
      Authorization: authHeader["Authorization"],
      'user-agent': "v2CreateTweetJS",
      'content-type': "application/json",
      'accept': "application/json"
    }
  });
  if (req.body) {
    return req.body;
  } else {
    throw new Error('Unsuccessful request');
  }
}

(async () => {
  try {
    const oAuthRequestToken = await requestToken();
    authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token);
    console.log('Please go here and authorize:', authorizeURL.href);
    const pin = await input('Paste the PIN here: ');
    const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());
    const response = await getRequest(oAuthAccessToken);
    console.dir(response, {
      depth: null
    });
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
  process.exit();
})();

