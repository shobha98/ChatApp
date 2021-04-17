import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './src/screens/login';
import Chat from './src/screens/chat';
import UserList from './src/screens/userList';

const Stack = createStackNavigator();

const App = () => {
  const [isLogIn, setIsLogIn] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('user').then(res => {
      setIsLogIn(res);
    });
  });

  return (
    <View style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Login'}>
          {isLogIn ? (
            <>
              <Stack.Screen name="UserList" component={UserList} />
              <Stack.Screen name="Chat" component={Chat} />
            </>
          ) : (
            <Stack.Screen name="Login" component={Login} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
