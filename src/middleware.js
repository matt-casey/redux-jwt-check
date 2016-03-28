import { isTokenExpired } from './jwtUtil';
import { CHECK_JWT } from './constants';

function shouldCheckJwt(action, whitelistedActions, blacklistedActions) {
  const requiresAuth = action[CHECK_JWT];
  const isWhitelisted = whitelistedActions.includes(action.type);
  const isBlacklisted = blacklistedActions.includes(action.type);

  if (!isBlacklisted && (requiresAuth || isWhitelisted)) {
    return true;
  }

  return false;
}

function nullFn() {
  return null;
}

function throwMissingParam(paramName) {
  throw new Error(`missing required parameter '${paramName}'`);
}

export default function setupMiddleware({
  getTokenFromState = throwMissingParam('getTokenFromState'),
  getRefreshTokenFromState = nullFn,
  getNewToken = nullFn,
  onSuccess = nullFn,
  onError = nullFn,
  whitelistedActions = [],
  blacklistedActions = [],
} = {}) {
  return ({ dispatch, getState }) => next => {
    return async action => {
      if (!shouldCheckJwt(action, whitelistedActions, blacklistedActions)) {
        return next(action);
      }

      let newToken;
      const state = getState();
      const token = getTokenFromState(state);
      const refreshToken = getRefreshTokenFromState(state);


      if (isTokenExpired(token)) {
        if (!refreshToken || !refreshToken) {
          return dispatch(onError());
        }

        try {
          newToken = await getNewToken(refreshToken);
          dispatch(onSuccess(newToken));
        } catch (error) {
          return dispatch(onError(error));
        }
      }

      action.token = newToken ? newToken : token;
      next({
        ...action,
        token: newToken || token,
      });
    };
  };
}