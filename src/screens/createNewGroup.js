import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import database from '@react-native-firebase/database';

import Header from '../components/header';

const {width, height} = Dimensions.get('window');

const CreateNewGroup = ({route, navigation}) => {
  const currUser = route?.params.currUser;

  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const databaseRef = useRef(database().ref('users/'));

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const temp = await getUserList();
      setIsLoading(false);
    })();
  }, []);

  const getUserList = () => {
    databaseRef.current.on('value', function (snapshot) {
      const list = snapshot?.val() ? Object.values(snapshot.val()) : [];
      const newUserList = list.filter(item => {
        return item?.phoneNumber !== currUser?.phoneNumber;
      });
      setUsersList(newUserList);
    });
  };

  const renderItem = item => {
    console.log('render>>>', item);
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.checked} />
        <View style={styles.profile} />
        <Text style={styles.nameText}>{item?.item.name}</Text>
        <Text style={styles.phoneText}>{item?.item.phoneNumber}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header screenName="New Group" navigation={navigation} />
      <TextInput
        style={styles.inputField}
        value={groupName}
        placeholder="Enter group name"
        onChangeText={e => {
          setGroupName(e);
          setError(false);
        }}
      />
      {error && <Text style={styles.errorText}>Group name is required</Text>}
      <FlatList
        data={usersList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateNewGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputField: {
    borderBottomWidth: 1,
    width: width - 100,
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
  },
  profile: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(0,0,0,.3)',
    borderRadius: 15,
    marginRight: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    width: 200,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
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
    flex: 1,
  },
  checked: {
    width: 15,
    height: 15,
    marginRight: 10,
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
  },
});
