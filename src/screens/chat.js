// @refresh reset
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Button,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import * as firebase from 'firebase';
import moment from 'moment';

const {width} = Dimensions.get('window');

const firebaseConfig = {
  databaseURL: 'https://chatapp-e7cdb-default-rtdb.firebaseio.com/',
  projectId: 'chatapp-e7cdb-default-rtdb',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const VerifyOtp = ({route}) => {
  const scrollViewRef = useRef();
  const name = route.params.name;
  const userToken = route.params.userToken;
  const [msgToSend, setMsgToSend] = useState('');
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [date, setDate] = useState('');
  // const [count, setCount] = useState(false);

  useEffect(() => {
    getChats();
  }, []);

  const handleSend = async () => {
    setIsLoading(true);
    firebase
      .database()
      .ref('chats/')
      .push({
        text: msgToSend.trim(),
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: userToken,
        name,
      })
      .then(response => {
        setMsgToSend('');
        getChats();
      })
      .catch(error => {
        console.log('error ', error);
      });
  };

  const getChats = () => {
    firebase
      .database()
      .ref('chats/')
      .on('value', function (snapshot) {
        setIsLoading(false);
        const list = snapshot?.val() ? Object.values(snapshot.val()) : [];
        setChats(list);
        // setDate(moment(list[0].timestamp).format('D MMMM YYYY'));
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
          <View style={styles.msgContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({animated: true})
              }>
              {chats.map((item, val) => {
                {
                  /* const prevDate = moment(chats[val - 1].timestamp).format(
                  'D MMMM YYYY',
                );
                const currDate = moment(item.timestamp).format('D MMMM YYYY'); */
                }
                {
                  /* if (val === 0) {
                  const prevDate = '';
                  const currDate = moment(chats[val].timestamp).format(
                    'D MMMM YYYY',
                  );
                } else {
                  const prevDate = moment(chats[val - 1].timestamp).format(
                    'D MMMM YYYY',
                  );
                  const currDate = moment(chats[val].timestamp).format(
                    'D MMMM YYYY',
                  );
                } */
                }

                return (
                  <>
                    {/* {prevDate === currDate ? (
                      <></>
                    ) : ( */}
                    <View style={styles.dateView}>
                      <Text style={styles.dateText}>
                        {moment().format('D MMMM YYYY')}
                      </Text>
                    </View>
                    {/* )} */}

                    <View
                      style={
                        item.user === userToken
                          ? [styles.msgView, styles.rightAlgin]
                          : [styles.msgView, styles.leftAlign]
                      }>
                      <View style={styles.nameView}>
                        <Text style={styles.nameText}>{item.name}</Text>
                      </View>
                      <Text style={styles.msgText}>{item.text}</Text>
                      <Text style={styles.timeText}>
                        {moment(item.timestamp).format('h:mm a')}
                      </Text>
                    </View>
                  </>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles.bottom}>
            <View style={{flex: 1}}>
              <TextInput
                style={styles.inputField}
                placeholder="What's in your mind..."
                value={msgToSend}
                onChangeText={e => setMsgToSend(e)}
                multiline={true}
              />
            </View>
            <View style={styles.button}>
              <Button title="Send" onPress={() => handleSend()} />
            </View>
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
    maxWidth: width * 0.7,
  },
  msgText: {
    color: 'white',
    fontSize: 15,
    marginVertical: 10,
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
    height: 50,
  },
  button: {
    width: 100,
    marginLeft: 10,
  },
  timeText: {
    fontSize: 10,
    alignSelf: 'flex-end',
    color: 'white',
  },
  dateText: {
    color: 'white',
  },
  dateView: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,.3)',
    padding: 10,
    borderRadius: 10,
  },
  loading: {
    width: 40,
    height: 40,
  },
  nameText: {
    fontSize: 10,
    alignSelf: 'flex-start',
    color: 'white',
  },
  nameView: {
    backgroundColor: 'rgba(0,0,0,.3)',
    padding: 5,
    borderRadius: 5,
  },
});
