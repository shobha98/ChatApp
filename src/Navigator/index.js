import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import Login from '../screens/login';
import UserNavigator from './userNavigator';
import Auth from './auth';

import Chat from '../screens/chat';
import UserList from '../screens/userList';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const isLoggedIn = useSelector(state => {
    console.log('navigator store>>>', state);
    return state.isLoggedIn;
  });

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Auth'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="UserNavigator" component={UserNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

{
  /* <Stack.Navigator
        initialRouteName={'Auth'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="UserNavigator" component={UserNavigator} />
      </Stack.Navigator> */
}

{
  /* <Stack.Navigator
        initialRouteName={'login'}
        screenOptions={{
          headerShown: false,
        }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="UserList" component={UserList} />
            <Stack.Screen name="Chat" component={Chat} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator> */
}
