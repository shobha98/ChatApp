import React, {useEffect} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Auth = ({navigation}) => {
  useEffect(() => {
    checkIsLoggedIn();
  }, []);

  const checkIsLoggedIn = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user !== null) {
        navigation.navigate('UserNavigator');
      } else {
        navigation.navigate('Login');
      }
    } catch (e) {
      console.log('error>>>>', e);
    }
  };

  return <View />;
};

export default Auth;
