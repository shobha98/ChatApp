import ActionType from './constants';

const initialState = {
  isLoggedIn: false,
};

const getIsUserLoggedIn = (state = initialState, action) => {
  console.log('action.type>>>>>>.', action);

  switch (action.type) {
    case ActionType.GET_IS_USER_LOGGED_IN:
      return {...state, isLoggedIn: action.payload};
    default:
      return {...state};
  }
};

export default getIsUserLoggedIn;
