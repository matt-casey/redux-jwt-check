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
  getNewToken,
  onSuccess = nullFn,
  onError = nullFn,
  whitelistedActions = [],
  blacklistedActions = [],
} = {}) {
  return ({ dispatch, getState }) => next => {
    return async action => {
      // Doesn't need to check token
      if (!shouldCheckJwt(action, whitelistedActions, blacklistedActions)) {
        return next(action);
      }

      const state = getState();
      const token = getTokenFromState(state);

      // Token is not expired
      if (!isTokenExpired(token)) {
        return next(action);
      }

      // Cannot get new token
      if (!getNewToken) {
        return dispatch(onError());
      }

      // Try to get new token
      try {
        const newToken = await getNewToken(state);
        dispatch(onSuccess(newToken));
        return next(action);
      } catch (error) {
        return dispatch(onError(error));
      }
    };
  };
}