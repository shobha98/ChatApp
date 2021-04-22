import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';

import {getIsUserLoggedIn} from '../Redux/actions';

import Header from '../components/header';
import {TouchableOpacity} from 'react-native-gesture-handler';

const UserProfile = ({route, navigation}) => {
  const dispatch = useDispatch();

  const currUser = route?.params.currUser;

  const userInfo = [
    {
      title: 'Name',
      value: currUser.name,
    },
    {
      title: 'Phone',
      value: currUser.phoneNumber,
    },
    {
      title: 'User ID',
      value: currUser.userId,
    },
  ];

  const signOut = () => {
    AsyncStorage.clear()
      .then(() => {
        dispatch(getIsUserLoggedIn({isLoggedIn: false}));
        navigation.navigate('Login');
      })
      .catch(err => {
        console.log('err', err);
      });
    return true;
  };

  return (
    <View style={styles.container}>
      <Header screenName="User Profile" navigation={navigation} />
      <View style={styles.profile} />
      <View style={{marginTop: 30, padding: 20}}>
        {userInfo.map(item => {
          return (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
              }}>
              <View style={styles.icon} />
              <View style={{flex: 1}}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.valueText}>{item.value}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => signOut()}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(0,0,0,.3)',
    borderRadius: 50,
    marginRight: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  nameText: {
    fontSize: 25,
    alignSelf: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(0,0,0,.3)',
    borderRadius: 10,
    marginRight: 10,
  },
  valueText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'blue',
    width: 200,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});
