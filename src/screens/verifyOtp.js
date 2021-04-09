import React, {useEffect, useState} from 'react';
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

const VerifyOtp = ({route, navigation}) => {
  const [confirm, setConfirm] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [token, setToken] = useState('');

  const phoneNumber = route.params.phoneNumber;

  useEffect(() => {
    signInWithPhoneNumber(phoneNumber);
  }, []);

  const signInWithPhoneNumber = async phoneNumber => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (e) {
      console.log(e);
      alert(JSON.stringify(e));
    }
  };

  const confirmCode = async code => {
    try {
      const response = await confirm.confirm(code);
      console.log('response>>>>>>', response.user.uid);
      if (response) {
        setIsVerified(true);
        setToken(response.user.uid);
      }
    } catch (e) {
      alert(JSON.stringify(e));
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      {isVerified ? (
        <>
          <Image
            style={styles.image}
            source={require('../asserts/verified.gif')}
          />
          <Text style={styles.title}>Verified</Text>
          <View style={styles.button}>
            <Button
              title="OK"
              onPress={() => navigation.navigate('Chat', {token})}
            />
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
            <Button title="Verify" onPress={() => confirmCode(otpCode)} />
          </View>
        </>
      )}
    </View>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightpink',
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
});
