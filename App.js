import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './src/screens/login';
import Chat from './src/screens/chat';
import VerifyOtp from './src/screens/verifyOtp';
import UserList from './src/screens/userList';

const Stack = createStackNavigator();

const App = () => {
  return (
    <View style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Login'}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
          <Stack.Screen name="UserList" component={UserList} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
