'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = setupMiddleware;

var _jwtUtil = require('./jwtUtil');

var _constants = require('./constants');

function shouldCheckJwt(action, whitelistedActions, blacklistedActions) {
  var requiresAuth = action[_constants.CHECK_JWT];
  var isWhitelisted = whitelistedActions.includes(action.type);
  var isBlacklisted = blacklistedActions.includes(action.type);

  if (!isBlacklisted && (requiresAuth || isWhitelisted)) {
    return true;
  }

  return false;
}

function nullFn() {
  return null;
}

function throwMissingParam(paramName) {
  throw new Error('missing required parameter \'' + paramName + '\'');
}

function setupMiddleware() {
  var _this = this;

  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$getTokenFromState = _ref.getTokenFromState;
  var getTokenFromState = _ref$getTokenFromState === undefined ? throwMissingParam('getTokenFromState') : _ref$getTokenFromState;
  var _ref$getRefreshTokenFromState = _ref.getRefreshTokenFromState;
  var getRefreshTokenFromState = _ref$getRefreshTokenFromState === undefined ? nullFn : _ref$getRefreshTokenFromState;
  var _ref$getNewToken = _ref.getNewToken;
  var getNewToken = _ref$getNewToken === undefined ? nullFn : _ref$getNewToken;
  var _ref$onSuccess = _ref.onSuccess;
  var onSuccess = _ref$onSuccess === undefined ? nullFn : _ref$onSuccess;
  var _ref$onError = _ref.onError;
  var onError = _ref$onError === undefined ? nullFn : _ref$onError;
  var _ref$whitelistedActions = _ref.whitelistedActions;
  var whitelistedActions = _ref$whitelistedActions === undefined ? [] : _ref$whitelistedActions;
  var _ref$blacklistedActions = _ref.blacklistedActions;
  var blacklistedActions = _ref$blacklistedActions === undefined ? [] : _ref$blacklistedActions;

  return function (_ref2) {
    var dispatch = _ref2.dispatch;
    var getState = _ref2.getState;
    return function (next) {
      return function callee$3$0(action) {
        var newToken, state, token, refreshToken;
        return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              if (shouldCheckJwt(action, whitelistedActions, blacklistedActions)) {
                context$4$0.next = 2;
                break;
              }

              return context$4$0.abrupt('return', next(action));

            case 2:
              newToken = undefined;
              state = getState();
              token = getTokenFromState(state);
              refreshToken = getRefreshTokenFromState(state);

              if (!(0, _jwtUtil.isTokenExpired)(token)) {
                context$4$0.next = 19;
                break;
              }

              if (!(!refreshToken || !refreshToken)) {
                context$4$0.next = 9;
                break;
              }

              return context$4$0.abrupt('return', dispatch(onError()));

            case 9:
              context$4$0.prev = 9;
              context$4$0.next = 12;
              return regeneratorRuntime.awrap(getNewToken(refreshToken));

            case 12:
              newToken = context$4$0.sent;

              dispatch(onSuccess(newToken));
              context$4$0.next = 19;
              break;

            case 16:
              context$4$0.prev = 16;
              context$4$0.t0 = context$4$0['catch'](9);
              return context$4$0.abrupt('return', dispatch(onError(context$4$0.t0)));

            case 19:

              action.token = newToken ? newToken : token;
              next(_extends({}, action, {
                token: newToken || token
              }));

            case 21:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this, [[9, 16]]);
      };
    };
  };
}

module.exports = exports['default'];