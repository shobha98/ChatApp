import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const Header = route => {
  const {
    screenName = '',
    isProfile = false,
    navigation = '',
    currUser = {},
  } = route;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {isProfile || (
          <Text style={{fontSize: 20, marginRight: 10}}>{'<--'}</Text>
        )}
      </TouchableOpacity>
      {isProfile || <View style={styles.profile} />}
      <Text style={styles.text}>{screenName}</Text>
      {isProfile && (
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile', {currUser})}>
          <Text style={styles.rightText}>Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  text: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 20,
    color: 'black',
    flex: 1,
  },
  profile: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(0,0,0,.3)',
    borderRadius: 15,
    marginRight: 10,
  },
  rightText: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
});
