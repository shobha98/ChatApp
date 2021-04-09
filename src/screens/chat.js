import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Button,
  Text,
  ScrollView,
} from 'react-native';

const {width} = Dimensions.get('window');

const VerifyOtp = ({route}) => {
  // const token = route.params.token;

  const chats = [
    {
      msg: 'hi',
      author: 1,
    },
    {
      msg: 'hello',
      author: 2,
    },
    {
      msg: 'How are you?',
      author: 1,
    },
    {
      msg: "I'm good",
      author: 2,
    },
    {
      msg: 'How can I help you?',
      author: 1,
    },
    {
      msg: 'This is Chatting App.',
      author: 2,
    },
    {
      msg: 'How can I help you?',
      author: 1,
    },
    {
      msg: 'hi',
      author: 1,
    },
    {
      msg: 'hello',
      author: 2,
    },
    {
      msg: 'How are you?',
      author: 1,
    },
    {
      msg: "I'm good",
      author: 2,
    },
    {
      msg: 'How can I help you?',
      author: 1,
    },
    {
      msg: 'This is Chatting App.',
      author: 2,
    },
    {
      msg: 'How can I help you?',
      author: 1,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.msgContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {chats.map(item => {
            return (
              <View
                style={
                  item.author === 1
                    ? [styles.msgView, styles.rightAlgin]
                    : [styles.msgView, styles.leftAlign]
                }>
                <Text style={styles.msgText}>{item.msg}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.bottom}>
        <View style={{flex: 1}}>
          <TextInput
            style={styles.inputField}
            placeholder="What's in your mind..."
          />
        </View>
        <View style={styles.button}>
          <Button title="Send" onPress={() => {}} />
        </View>
      </View>
    </View>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightpink',
    alignItems: 'center',
    padding: 15,
  },
  msgContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: width - 30,
  },
  msgView: {
    borderRadius: 10,
    elevation: 10,
    padding: 10,
    marginVertical: 15,
  },
  msgText: {
    color: 'white',
    fontSize: 15,
  },
  leftAlign: {
    alignSelf: 'flex-start',
    backgroundColor: '#c41b84',
  },
  rightAlgin: {
    alignSelf: 'flex-end',
    backgroundColor: '#1d5fc2',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  inputField: {
    borderWidth: 0.3,
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 10,
    color: 'black',
  },
  button: {
    width: 100,
    marginLeft: 10,
  },
});
