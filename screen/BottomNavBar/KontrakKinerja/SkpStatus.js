import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SkpStatus = ({ alert }) => {
  if (!alert || !alert.show) return null;

  const statusColor = alert.class === 'alert-light-warning' ? '#ffeb3b' :
                     alert.class === 'alert-light-primary' ? '#03a9f4' :
                     alert.class === 'alert-light-danger' ? '#f44336' :
                     alert.class === 'alert-light-success' ? '#1bc5bd' : '#000';

  const iconName = alert.icon === 'fas fa-question-circle' ? 'help-circle-outline' :
                   alert.icon === 'fas fa-time' ? 'time-outline' :
                   alert.icon === 'fas fa-exclamation-triangle' ? 'alert-circle-outline' :
                   alert.icon === 'fas fa-checkmark-circle' ? 'checkmark-circle-outline' : 'help-circle-outline';

  return (
    <View style={[styles.container, { backgroundColor: statusColor }]}>
      <Ionicons name={iconName} size={35} color="#fff" />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{alert.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginTop: 10,
  },
  textContainer: {
    padding: 5,         
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    paddingRight: 5,
    fontSize: 12,
  },
});

export default SkpStatus;