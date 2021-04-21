import ActionType from './constants';

export const getIsUserLoggedIn = payload => ({
  type: ActionType.GET_IS_USER_LOGGED_IN,
  payload,
});
