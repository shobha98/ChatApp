import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserList = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currUser, setCurrUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const databaseRef = useRef(database().ref('users/'));

  useEffect(() => {
    getCurrUser();
  }, []);

  const signOut = () => {
    AsyncStorage.clear()
      .then(res => {
        // navigation.navigate('Login');
      })
      .catch(err => {
        console.log('err', err);
      });
    return true;
  };

  const getCurrUser = () => {
    setIsLoading(true);
    AsyncStorage.getItem('user')
      .then(res => {
        getUserList(JSON.parse(res));
      })
      .catch(e => {
        console.log('error', e);
      });
  };

  const getUserList = user => {
    databaseRef.current.on('value', function (snapshot) {
      const list = snapshot?.val() ? Object.values(snapshot.val()) : [];
      let name = '';
      list.map(item => {
        if (item.phoneNumber === user.phoneNumber) {
          name = item.name;
        }
      });
      const newUserList = list.filter(item => {
        return item.phoneNumber !== user.phoneNumber;
      });
      setUsersList(newUserList);
      setCurrUser({...user, name});
      setIsLoading(false);
    });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={styles.loading}
            source={require('../asserts/loading.gif')}
          />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flexDirection: 'row', margin: 5}}>
            <View style={styles.userProfile}>
              <Text style={styles.signOutText}>Logged in as</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.signOutText, {flex: 1}]}>
                  {currUser.name}
                </Text>
                <Text style={styles.signOutText}>{currUser.phoneNumber}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.signOut} onPress={() => signOut()}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('Chat', {currUser, groupChat: true})
            }>
            <View style={styles.profile} />
            <Text style={styles.nameText}>Group Chat</Text>
          </TouchableOpacity>
          {usersList.length !== 0 &&
            usersList.map(item => (
              <>
                <View style={styles.divider} />
                <TouchableOpacity
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('Chat', {
                      currUser,
                      item,
                      groupChat: false,
                    })
                  }>
                  <View style={styles.profile} />
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.phoneText}>{item.phoneNumber}</Text>
                </TouchableOpacity>
              </>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 20,
    alignSelf: 'flex-start',
    color: 'black',
    flex: 1,
  },
  phoneText: {
    color: 'black',
    fontSize: 15,
    opacity: 0.6,
  },
  divider: {
    borderWidth: 1,
    marginHorizontal: 10,
    opacity: 0.3,
    marginLeft: 50,
  },
  profile: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,.3)',
    borderRadius: 20,
    marginRight: 10,
  },
  loading: {
    width: 40,
    height: 40,
  },
  profileName: {
    fontSize: 20,
    alignSelf: 'flex-start',
    color: 'black',
    flex: 1,
  },
  phoneText: {
    color: 'black',
    fontSize: 15,
    opacity: 0.6,
  },
  signOut: {
    backgroundColor: 'green',
    padding: 10,
    marginLeft: 5,
    justifyContent: 'center',
  },
  signOutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  userProfile: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,.8)',
    flex: 1,
  },
});
