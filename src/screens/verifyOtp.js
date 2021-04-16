import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  Button,
  Text,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

// import * as firebase from 'firebase';

// const firebaseConfig = {
//   databaseURL: 'https://chatapp-180c3-default-rtdb.firebaseio.com/',
//   projectId: 'chatapp-180c3-default-rtdb',
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

const VerifyOtp = ({route, navigation}) => {
  const [confirm, setConfirm] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [isName, setIsName] = useState(false);
  const [name, setName] = useState('');
  const databaseRef = useRef(database().ref('users/'));

  const phoneNumber = route.params.phoneNumber;

  useEffect(() => {
    signInWithPhoneNumber(phoneNumber);
  }, []);

  const signInWithPhoneNumber = async phoneNumber => {
    setIsLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      setIsLoading(false);
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };

  const confirmCode = async code => {
    setIsLoading(true);
    try {
      const response = await confirm.confirm(code);
      setIsLoading(false);
      if (response) {
        setIsVerified(true);
        setUserToken(response.user.uid);
      }
    } catch (e) {
      alert('Invalid Code');
      setIsLoading(false);
    }
  };

  const getUsers = useCallback(() => {
    setIsLoading(true);
    setIsVerified(false);
    databaseRef.current.on('value', function (snapshot) {
      setIsLoading(false);
      const list = snapshot?.val() ? Object.values(snapshot.val()) : [];
      setUsersList(list);
      const users = list.map(item => item.phoneNumber);
      if (users.indexOf(phoneNumber) == -1) {
        setIsName(true);
      } else {
        navigation.navigate('UserList', {list, phoneNumber});
      }
    });
  }, []);

  const addUser = async name => {
    setIsLoading(true);
    databaseRef.current
      .push({
        phoneNumber,
        userId: userToken,
        name,
      })
      .then(response => {
        setIsLoading(false);
        const list = [...usersList, {name, phoneNumber, userId: userToken}];
        navigation.navigate('UserList', {list, phoneNumber});
      })
      .catch(error => {
        setIsLoading(false);
        console.log('error ', error);
      });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Image
            style={styles.loading}
            source={require('../asserts/loading.gif')}
          />
        </View>
      ) : (
        <>
          {isVerified ? (
            <>
              <Image
                style={styles.image}
                source={require('../asserts/verified.gif')}
              />
              <Text style={styles.title}>Verified</Text>
              <View style={styles.button}>
                <Button title="OK" onPress={() => getUsers()} />
              </View>
            </>
          ) : (
            <>
              {isName ? (
                <>
                  <Text style={styles.title}>Enter Name for </Text>
                  <Text style={styles.title}>{phoneNumber}</Text>
                  <TextInput
                    style={styles.inputField}
                    value={name}
                    placeholder="Enter Name"
                    onChangeText={e => setName(e)}
                  />
                  <View style={styles.button}>
                    <Button title="Verify" onPress={() => addUser(name)} />
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.title}>OTP Verification for</Text>
                  <Text style={styles.title}>{phoneNumber}</Text>
                  <TextInput
                    style={styles.inputField}
                    value={otpCode}
                    placeholder="Enter OTP"
                    maxLength={6}
                    keyboardType={'numeric'}
                    onChangeText={e => setOtpCode(e)}
                  />
                  <View style={styles.button}>
                    <Button
                      title="Verify"
                      onPress={() => confirmCode(otpCode)}
                    />
                  </View>
                </>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#649efa',
  },
  inputField: {
    borderWidth: 0.3,
    marginTop: 10,
    width: Dimensions.get('window').width - 100,
    backgroundColor: 'white',
    elevation: 10,
    fontSize: 25,
    color: 'black',
  },
  button: {
    width: 100,
    marginTop: 30,
  },
  loading: {
    width: 40,
    height: 40,
  },
});
