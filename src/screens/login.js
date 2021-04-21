import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  Button,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {useDispatch} from 'react-redux';
import {getIsUserLoggedIn} from '../Redux/actions';

import {Images} from '../asserts';

const {width, height} = Dimensions.get('window');

const Login = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [isLoading, setIsLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [isName, setIsName] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(false);
  const databaseRef = useRef(database().ref('users/'));
  const dispatch = useDispatch();

  useEffect(() => {
    checkIsLoggedIn();
  }, []);

  const signInWithPhoneNumber = async () => {
    if (phoneNumber == '' || phoneNumber.length < 13) {
      setError(true);
    } else {
      setIsLoading(true);
      try {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
        setIsLoading(false);
      } catch (e) {
        alert(e);
        setIsLoading(false);
      }
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
            dispatch(getIsUserLoggedIn({isLoggedIn: true}));
            setConfirm(null);
            if (response.additionalUserInfo.isNewUser) {
              setIsName(true);
            } else {
              setIsName(false);
              setName('');
              setOtpCode('');
              setPhoneNumber('');
              navigation.navigate('UserList');
            }
          })
          .catch(err => {
            console.log('error', err);
          });
        setIsLoading(false);
      })
      .catch(err => {
        // alert('Invalid Code');
        setError(true);
        setIsLoading(false);
      });
  };

  const checkIsLoggedIn = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user !== null) {
        setIsName(false);
        setName('');
        setOtpCode('');
        setPhoneNumber('');
        navigation.navigate('UserList');
      }
      setIsLoading(false);
    } catch (e) {
      console.log('error>>>>', e);
    }
  };

  const addUser = () => {
    setIsLoading(true);
    if (name === '') {
      setError(true);
    } else {
      databaseRef.current
        .push({
          userId,
          phoneNumber,
          name,
        })
        .then(() => {
          setIsLoading(false);
          navigation.navigate('UserList');
        })
        .catch(error => {
          setIsLoading(false);
          console.log('error ', error);
        });
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Image style={styles.loading} source={Images.loader} />
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
                onChangeText={e => {
                  setName(e);
                  setError(false);
                }}
              />
              {error && <Text style={styles.errorText}>Name is required</Text>}
              <TouchableOpacity style={styles.button} onPress={() => addUser()}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
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
                    onChangeText={e => {
                      setOtpCode(e);
                      setError(false);
                    }}
                  />
                  {error && <Text style={styles.errorText}>Invalid OTP</Text>}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => confirmCode()}>
                    <Text style={styles.buttonText}>Verify</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Image style={styles.image} source={Images.chat} />
                  <Text style={styles.title}>ChatApp</Text>
                  <TextInput
                    style={styles.inputField}
                    value={phoneNumber}
                    placeholder="Enter phone number"
                    maxLength={13}
                    keyboardType={'numeric'}
                    onChangeText={e => {
                      setPhoneNumber(e);
                      setError(false);
                    }}
                  />
                  {error && (
                    <Text style={styles.errorText}>
                      Please enter valid number
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => signInWithPhoneNumber()}>
                    <Text style={styles.buttonText}>Send OTP</Text>
                  </TouchableOpacity>
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
    borderBottomWidth: 1,
    marginTop: 50,
    width: width - 100,
    fontSize: 25,
    color: 'black',
  },
  button: {
    backgroundColor: 'blue',
    width: 200,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  errorText: {
    color: 'red',
  },
});
