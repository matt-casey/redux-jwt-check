'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isTokenExpired = isTokenExpired;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _base64 = require('base-64');

var _base642 = _interopRequireDefault(_base64);

function urlBase64Decode(str) {
  var output = str.replace(/-/g, '+').replace(/_/g, '/');

  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';break;
    case 3:
      output += '=';break;
    default:
      throw new Error('Illegal base64url string!');
  }

  return _base642['default'].decode(output);
}

function decodeToken(token) {
  var parts = token.split('.');
  if (parts.length !== 3) throw new Error('JWT must have 3 parts');

  var decoded = urlBase64Decode(parts[1]);
  if (!decoded) throw new Error('Cannot decode the token');

  return JSON.parse(decoded);
}

function getTokenExpirationDate(token) {
  var decoded = decodeToken(token);
  if (typeof decoded.exp === 'undefined') return null;

  var d = new Date(0);
  d.setUTCSeconds(decoded.exp);

  return d;
}

function isTokenExpired(token, offsetSeconds) {
  var d = getTokenExpirationDate(token);
  if (d === null) return false;

  return !(d.valueOf() > new Date().valueOf() + (offsetSeconds || 0) * 1000);
}

exports['default'] = { isTokenExpired: isTokenExpired };