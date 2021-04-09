import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  Button,
  Text,
} from 'react-native';

const Login = ({route, navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('+91');

  const GetOTP = () => {
    if (phoneNumber && phoneNumber.length > 12) {
      navigation.navigate('VerifyOtp', {phoneNumber});
    } else alert('Please enter 10 digit phone number');
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../asserts/chat.gif')} />
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
        <Button title="Send Otp" onPress={() => GetOTP()} />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightpink',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 100,
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
