var url = require('url'),
    http = require('http');

/**
 * The main Bitly constructor, takes the users login, api key and additional options
 * @param {String} login   The user login
 * @param {String} api_key The users API key
 * @param {Object} options Optional options
 */
var Bitly = function(login, api_key, options) {
  options = options || {
    format: 'json',
    api_url: 'api.bit.ly',
    api_version: 'v3',
    domain: 'bit.ly'
  };
  this.config = {
    login: login,
    api_key: api_key,
    format: options.format,
    api_url: options.api_url,
    api_version: options.api_version,
    domain: options.domain
  };

  return this;
};

/**
 * Function to take an incoming query and generate a URL object from it
 * @param  {Object} query  The query object
 * @param  {String} method The Bit.ly method to call with the request
 * @return {Object} The URL object for this request
 */
Bitly.prototype._generateNiceUrl = function(query, method) {
  var result = url.parse(url.format({
    protocol: 'http',
    hostname: this.config.api_url,
    pathname: '/' + this.config.api_version + '/' + method,
    query: query
  }));
  return result;
};

/**
 * Function to do a HTTP Get request with the current query
 * @param  {Object} request_query The current query object
 * @param  {Function} cb The callback function for the returned data
 * @return {void}
 */
Bitly.prototype._doRequest = function(request_query, cb) {
  var scope = this;
  // Pass the requested URL as an object to the get request
  http.get(request_query, function(res) {
      var data = [];
      res
      .on('data', function(chunk) { data.push(chunk); })
      .on('end', function() {
          var urldata = data.join('');
          var result = JSON.parse(urldata);
          return cb(null, result);
      });
  })
  .on('error', function(e) {
      console.log("Got http get error: " + e.message);
      callback(e);
  });
};

/**
 * Function for checking the regex of a URL to see that it is valid
 * @param  {String} str The URL string to be checked
 * @return {Boolean}
 */
Bitly.prototype._urlCheck = function(str) {
    var v = new RegExp();
    v.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
    if (!v.test(str)) return false;
    return true;
};

/**
 * Bitly request to shorten a URL
 * @param  {String} longUrl The URL to be shortened
 * @param  {Function} cb The callback function with the results
 * @return {void}
 */
Bitly.prototype.shorten = function(longUrl, cb) {
  var query = {
    login: this.config.login,
    apiKey: this.config.api_key,
    format: this.config.format,
    longUrl: longUrl,
    domain: this.config.domain
  };
  var request_query = this._generateNiceUrl(query, 'shorten');
  this._doRequest(request_query, cb);
};

/**
 * Bitly request to expand urls
 * @param  {Array} items The URL to be shortened
 * @param  {Function} cb The callback function with the results
 * @return {void}
 */
Bitly.prototype.expand = function(items, cb) {
  var shortUrl = [];
  var hash = [];
  while (items.length > 0) {
    var item_to_check = items.pop();
    if (this._urlCheck(item_to_check)) {
      shortUrl.push(item_to_check);
    } else {
      hash.push(item_to_check);
    }
  }
  var query = {
    login: this.config.login,
    apiKey: this.config.api_key,
    format: this.config.format,
    shortUrl: shortUrl,
    hash: hash,
    domain: this.config.domain
  };

  var request_query = this._generateNiceUrl(query, 'expand');
  this._doRequest(request_query, cb);
};

/**
 * Bitly request to get clicks for an array of urls
 * @param  {Array} items Array of items
 * @param  {Function} cb The callback function
 * @return {void}
 */
Bitly.prototype.clicks = function(items, cb) {
  var shortUrl = [];
  var hash = [];
  while (items.length > 0) {
    var item_to_check = items.pop();
    if (this._urlCheck(item_to_check)) {
      shortUrl.push(item_to_check);
    } else {
      hash.push(item_to_check);
    }
  }
  var query = {
    login: this.config.login,
    apiKey: this.config.api_key,
    format: this.config.format,
    shortUrl: shortUrl,
    hash: hash,
    domain: this.config.domain
  };
  var request_query = this._generateNiceUrl(query, 'clicks');
  this._doRequest(request_query, cb);
};

/**
 * Bitly request to get clicks for an array of urls
 * @param  {Array} items Array of items
 * @param  {Function} cb The callback function
 * @return {void}
 */
Bitly.prototype.lookup = function(links, cb) {
  var query = {
    login: this.config.login,
    apiKey: this.config.api_key,
    format: this.config.format,
    url: links,
    domain: this.config.domain
  };

  var request_query = this._generateNiceUrl(query, 'lookup');
  this._doRequest(request_query, cb);
};

/**
 * Bitly request for info on links
 * @param  {Array} items Array of items
 * @param  {Function} cb The callback function
 * @return {void}
 */
Bitly.prototype.info = function(items, cb) {
  var shortUrl = [];
  var hash = [];
  while (items.length > 0) {
    var item_to_check = items.pop();
    if (this._urlCheck(item_to_check)) {
      shortUrl.push(item_to_check);
    } else {
      hash.push(item_to_check);
    }
  }
  var query = {
    login: this.config.login,
    apiKey: this.config.api_key,
    format: this.config.format,
    shortUrl: shortUrl,
    hash: hash,
    domain: this.config.domain
  };

  var request_query = this._generateNiceUrl(query, 'info');
  this._doRequest(request_query, cb);
};

/**
 * Bitly request for prodomain
 * @param  {[type]} domain [description]
 * @param  {[type]} cb     [description]
 * @return {[type]}
 */
Bitly.prototype.bitlyProDomain = function(domain, cb) {
  var query = {
    login: this.config.login,
    apiKey: this.config.api_key,
    format: this.config.format,
    domain: domain
  };

  var request_query = this._generateNiceUrl(query, 'bitly_pro_domain');
  this._doRequest(request_query, cb);
};

/**
 * Authenticate user
 * @param  {String} x_login    Username
 * @param  {String} x_password Password
 * @param  {Function} cb The callback
 * @return {void}
 */
Bitly.prototype.authenticate = function(x_login, x_password, cb) {
  var query = {
    login: this.config.login,
    apiKey: this.config.api_key,
    format: this.config.format,
    x_login: x_login,
    x_password: x_password
  };

  var request_query = this._generateNiceUrl(query, 'authenticate');
  this._doRequest(request_query, cb);
};

module.exports = Bitly;