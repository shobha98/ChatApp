import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Chat from '../screens/chat';
import UserList from '../screens/userList';
import UserProfile from '../screens/userProfile';
import CreateNewGroup from '../screens/createNewGroup';

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={'UserList'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="UserList" component={UserList} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="CreateNewGroup" component={CreateNewGroup} />
    </Stack.Navigator>
  );
};

export default UserNavigator;
