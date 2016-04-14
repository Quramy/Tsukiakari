import Twit from 'twit';
import remote from 'remote';

export default class TwitterClient {
  constructor(accessToken, accessTokenSecret) {
    this.client = new Twit({
      consumer_key: remote.getGlobal('consumerKey'),
      consumer_secret: remote.getGlobal('consumerSecret'),
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
    });
  }

  getEndpoint(type) {
    switch (type) {
      case 'Home' : return 'statuses/home_timeline';
      case 'Favorite' : return 'favorites/list';
      case 'Mention' : return 'statuses/mentions_timeline';
      default: throw new Error('Unknown fetch type');
    }
  }

  fetch(type, params) {
    const endpoint = this.getEndpoint(type);
    return new Promise((resolve, reject) => {
      this.client.get(
        endpoint,
        params,
        (error, tweets) => {
          if (error) reject(error);
          else resolve(tweets);
        });
    });
  }

  /*
  getStatus(id) {
    var d = Q.defer();
    this._client.get('statuses/show', {id : id, include_my_retweet : true}, (error, status, response) => {
      if (error) {
        console.log(util.inspect(error));
        d.reject(error);
      }
      return d.resolve(status);
    });
    return d.promise;
  }

  getProfile(params) {
    var d = Q.defer();
    this._client.get('account/verify_credentials', params, (error, account, response) => {
      if (error) {
        console.log(util.inspect(error));
        d.reject(error);
      }
      return d.resolve(account);
    });
    return d.promise;
  }

  crateFavorite(params) {
    var d = Q.defer();
    this._client.post('favorites/create', params, (error) => {
      if (error) {
        console.log(util.inspect(error));
        d.reject(error);
      }
      return d.resolve();
    });
    return d.promise;
  }

  destroyFavorite(params) {
    var d = Q.defer();
    this._client.post('favorites/destroy', params, (error) => {
      if (error) {
        console.log(util.inspect(error));
        d.reject(error);
      }
      return d.resolve();
    });
    return d.promise;
  }


  searchTweet(params) {
    var d = Q.defer();
    this._client.get('search/tweets', params, (error, tweets, response) => {
      if (error) {
        console.log(util.inspect(error));
        d.reject(error);
      }
      return d.resolve(tweets.statuses);
    });
    return d.promise;
  }


  searchTweet(params) {
    var d = Q.defer();
    this._client.get('search/tweets', params, (error, tweets, response) => {
      if (error) {
        console.log(util.inspect(error));
        d.reject(error);
      }
      return d.resolve(tweets.statuses);
    });
    return d.promise;
  }

  postTweet(params) {
    var d = Q.defer();
    this._client.post('statuses/update', params, (error, tweet, response) => {
      if (error) {
        console.log(util.inspect(error));
        d.reject(error);
      }
      return d.resolve(tweet);
    });
    return d.promise;
  }

  postRetweet(params) {
    var d = Q.defer();
    this._client.post('statuses/retweet', params, (error, tweet) => {
      if (error) {
        console.log(util.inspect(error));
        d.reject(error);
      }
      return d.resolve(tweet);
    });
    return d.promise;
  }

  destroyTweet(params) {
    var d = Q.defer();
    this._client.post('statuses/destroy', params, (error) => {
      if (error) {
        console.log(util.inspect(error));
        d.reject(error);
      }
      return d.resolve();
    });
    return d.promise;
  }
   */
}

