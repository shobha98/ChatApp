import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  Button,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const {width, height} = Dimensions.get('window');

const Login = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [isLoading, setIsLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [isName, setIsName] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const databaseRef = useRef(database().ref('users/'));

  useEffect(() => {
    checkIsLoggedIn();
  }, []);

  const signInWithPhoneNumber = async () => {
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

  const confirmCode = () => {
    setIsLoading(true);
    confirm
      .confirm(otpCode)
      .then(response => {
        const user = {
          phoneNumber: response.user.phoneNumber,
          userId: response.user.uid,
        };
        console.log('confirmCode>>>>>.', user);
        setUserId(response.user.uid);
        AsyncStorage.setItem('user', JSON.stringify(user))
          .then(() => {
            setConfirm(null);
            if (response.additionalUserInfo.isNewUser) {
              setIsName(true);
            } else {
              navigation.navigate('UserList');
            }
          })
          .catch(err => {
            console.log('error', err);
          });
        setIsLoading(false);
      })
      .catch(err => {
        alert('Invalid Code');
        setIsLoading(false);
      });
  };

  const checkIsLoggedIn = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user !== null) {
        navigation.navigate('UserList');
      }
      setIsLoading(false);
    } catch (e) {
      console.log('error>>>>', e);
    }
  };

  const addUser = () => {
    setIsLoading(true);
    databaseRef.current
      .push({
        userId,
        phoneNumber,
        name,
      })
      .then(response => {
        setIsLoading(false);
        navigation.navigate('UserList');
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
                <Button title="Submit" onPress={() => addUser()} />
              </View>
            </>
          ) : (
            <>
              {confirm ? (
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
                    <Button title="Verify" onPress={() => confirmCode()} />
                  </View>
                </>
              ) : (
                <>
                  <Image
                    style={styles.image}
                    source={require('../asserts/chat.gif')}
                  />
                  <Text style={styles.title}>ChatApp</Text>
                  <TextInput
                    style={styles.inputField}
                    value={phoneNumber}
                    placeholder="Enter phone number"
                    maxLength={13}
                    keyboardType={'numeric'}
                    onChangeText={e => setPhoneNumber(e)}
                  />
                  <View style={styles.button}>
                    <Button
                      title="Send Otp"
                      onPress={() => signInWithPhoneNumber()}
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

export default Login;

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
  loading: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#649efa',
  },
  inputField: {
    borderWidth: 0.3,
    marginTop: 50,
    width: width - 100,
    backgroundColor: 'white',
    elevation: 10,
    fontSize: 25,
    color: 'black',
  },
  button: {
    width: 100,
    marginTop: 30,
  },
});
