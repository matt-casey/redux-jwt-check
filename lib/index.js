'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _constants = require('./constants');

exports['default'] = _middleware2['default'];
exports.CHECK_JWT = _constants.CHECK_JWT;