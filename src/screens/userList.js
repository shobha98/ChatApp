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
import Header from '../components/header';

import {Images} from '../asserts';

const UserList = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currUser, setCurrUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const databaseRef = useRef(database().ref('users/'));

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const temp = await getCurrUser();
      setIsLoading(false);
    })();
  }, []);

  const getCurrUser = () => {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.getItem('user')
          .then(res => {
            getUserList(JSON.parse(res));
          })
          .catch(e => {
            console.log('error', e);
          });
        resolve(true);
      } catch (e) {
        reject(false);
      }
    });
  };

  const getUserList = user => {
    databaseRef.current.on('value', function (snapshot) {
      const list = snapshot?.val() ? Object.values(snapshot.val()) : [];
      let name = '';
      list.map(item => {
        if (item?.phoneNumber === user?.phoneNumber) {
          name = item.name;
        }
      });
      const newUserList = list.filter(item => {
        return item?.phoneNumber !== user?.phoneNumber;
      });
      setUsersList(newUserList);
      setCurrUser({...user, name});
    });
  };

  return (
    <View style={styles.container}>
      <Header
        screenName="ChatApp"
        isProfile={true}
        navigation={navigation}
        currUser={currUser}
      />
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image style={styles.loading} source={Images.loader} />
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('Chat', {
                  currUser,
                  groupChat: true,
                  screenName: 'Common Chat',
                  navigation,
                })
              }>
              <View style={styles.profile} />
              <Text style={styles.nameText}>Common Chat</Text>
            </TouchableOpacity>
            {usersList?.length !== 0 &&
              usersList?.map(item => (
                <>
                  <View style={styles.divider} />
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() =>
                      navigation.navigate('Chat', {
                        currUser,
                        item,
                        groupChat: false,
                        screenName: item?.name,
                        navigation,
                      })
                    }>
                    <View style={styles.profile} />
                    <Text style={styles.nameText}>{item?.name}</Text>
                    <Text style={styles.phoneText}>{item?.phoneNumber}</Text>
                  </TouchableOpacity>
                </>
              ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.plusIcon}
            onPress={() => navigation.navigate('CreateNewGroup', {currUser})}>
            <Text style={styles.plusText}>Create New Group</Text>
          </TouchableOpacity>
        </>
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
    padding: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 15,
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
    width: 30,
    height: 30,
    backgroundColor: 'rgba(0,0,0,.3)',
    borderRadius: 15,
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
  userProfile: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,.8)',
    flex: 1,
  },
  plusIcon: {
    backgroundColor: 'blue',
    padding: 10,
    width: 200,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    bottom: 20,
    position: 'absolute',
  },
  plusText: {
    fontWeight: 'bold',
    color: 'white',
  },
});
