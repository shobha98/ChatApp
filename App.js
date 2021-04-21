import React from 'react';
import {Provider} from 'react-redux';

import AppNavigator from './src/Navigator';
import {store} from './src/Redux';

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
