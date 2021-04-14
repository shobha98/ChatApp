import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const UserList = ({route, navigation}) => {
  const userList = route.params.list;
  const phoneNumber = route.params.phoneNumber;

  const newUserList = userList.filter(item => {
    return phoneNumber !== item.phoneNumber;
  });

  const currUser = userList.filter(item => {
    return phoneNumber === item.phoneNumber;
  })[0];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('Chat', {currUser, groupChat: true})
          }>
          <View style={styles.profile} />
          <Text style={styles.nameText}>Group Chat</Text>
        </TouchableOpacity>
        {newUserList.map(item => (
          <>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('Chat', {currUser, item, groupChat: false})
              }>
              <View style={styles.profile} />
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.phoneText}>{item.phoneNumber}</Text>
            </TouchableOpacity>
          </>
        ))}
      </ScrollView>
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
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
  profile: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,.3)',
    borderRadius: 20,
    marginRight: 10,
  },
});
