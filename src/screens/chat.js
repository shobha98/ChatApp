import React, {useEffect, useState, useRef, useCallback} from 'react';
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
import database from '@react-native-firebase/database';
import moment from 'moment';
import lodash from 'lodash';

import Header from '../components/header';
import {Images} from '../asserts';

const {width} = Dimensions.get('window');

const Chat = ({route}) => {
  const currUser = route?.params.currUser;
  const groupChat = route?.params.groupChat;
  const anotherUser = groupChat ? '' : route?.params.item;
  const screenName = route?.params.screenName;
  const navigation = route?.params.navigation;

  const collectionName = groupChat
    ? 'chats/group'
    : currUser.userId > anotherUser.userId
    ? 'chats/oneToOne/' + currUser.userId + '-' + anotherUser.userId + '/'
    : 'chats/oneToOne/' + anotherUser.userId + '-' + currUser.userId + '/';

  const scrollViewRef = useRef();
  const databaseRef = useRef(database().ref(collectionName));

  const [msgToSend, setMsgToSend] = useState('');
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const temp = await getChats();
      setIsLoading(false);
    })();
  }, []);

  const handleSend = () => {
    databaseRef.current
      .push({
        text: msgToSend.trim(),
        timestamp: new Date().getTime(),
        user: currUser.userId,
        name: currUser.name,
      })
      .then(response => {
        getChats();
      })
      .catch(error => {
        console.log('error ', error);
      });
    setMsgToSend('');
  };

  const getChats = () => {
    return new Promise((resolve, reject) => {
      try {
        databaseRef.current.on('value', snapshot => {
          const list = snapshot?.val() ? Object.values(snapshot.val()) : [];
          console.log('List>>>', list);
          setChats(
            list.sort(function (x, y) {
              return x.timestamp - y.timestamp;
            }),
          );
          resolve(true);
        });
      } catch (e) {
        reject(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header screenName={screenName} navigation={navigation} />
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Image style={styles.loading} source={Images.loader} />
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
                return (
                  <>
                    {/* <View style={styles.dateView}>
                      <Text style={styles.dateText}>
                        {moment(item.timestamp).format('D MMMM YYYY')}
                      </Text>
                    </View> */}

                    <View
                      style={
                        item.user === currUser.userId
                          ? [styles.msgView, styles.rightAlgin]
                          : [styles.msgView, styles.leftAlign]
                      }>
                      <View style={styles.nameView}>
                        <Text style={styles.nameText}>
                          {item.user === currUser.userId ? 'you' : item.name}
                        </Text>
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

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  msgContainer: {
    flex: 1,
    // justifyContent: 'flex-end',
    width: width - 20,
    alignSelf: 'center',
    marginTop: 5,
  },
  msgView: {
    borderRadius: 10,
    elevation: 10,
    padding: 10,
    marginBottom: 15,
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
    padding: 10,
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  profile: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,.3)',
    borderRadius: 20,
    marginRight: 10,
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
  divider: {
    borderWidth: 1,
    marginHorizontal: 10,
    opacity: 0.3,
    marginLeft: 50,
  },
});
