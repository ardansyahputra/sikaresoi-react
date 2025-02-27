import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const DatePickerComponent = ({ datePickerVisible, handleAcceptDateRange, handleCancelDateRange, formData, handleDateChange }) => {
  const [selectedRange, setSelectedRange] = useState({});

  const onDayPress = (day) => {
    const { startDate, endDate } = selectedRange;

    if (!startDate || (startDate && endDate)) {
      // If no start date or both dates are selected, reset the range
      setSelectedRange({ startDate: day.dateString, endDate: null });
    } else if (day.dateString < startDate) {
      // If the selected date is before the start date, reset the range
      setSelectedRange({ startDate: day.dateString, endDate: null });
    } else {
      // Set the end date
      setSelectedRange({ ...selectedRange, endDate: day.dateString });
    }
  };

  const getMarkedDates = () => {
    const { startDate, endDate } = selectedRange;
    let markedDates = {};

    if (startDate) {
      markedDates[startDate] = { startingDay: true, color: '#00adf5', textColor: 'white' };
    }

    if (endDate) {
      markedDates[endDate] = { endingDay: true, color: '#00adf5', textColor: 'white' };
    }

    if (startDate && endDate) {
      let currentDate = startDate;
      while (currentDate < endDate) {
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate = currentDate.toISOString().split('T')[0];
        if (currentDate !== endDate) {
          markedDates[currentDate] = { color: '#e3f7ff', textColor: 'black' };
        } else {
          markedDates[currentDate] = { endingDay: true, color: '#00adf5', textColor: 'white' }; // ✅ Ensures border radius at end
        }
      }
    }

    return markedDates;
  };

  const handleAccept = () => {
    if (selectedRange.startDate && selectedRange.endDate) {
      handleDateChange('batas_awal', new Date(selectedRange.startDate));
      handleDateChange('batas_akhir', new Date(selectedRange.endDate));
      handleAcceptDateRange();
    }
  };

  return (
    datePickerVisible && (
      
      <View style={styles.datePickerContainer}>
        <View style={styles.datePickerModal}>
          
          <Calendar
            markingType="period"
            markedDates={getMarkedDates()}
            onDayPress={onDayPress}
          />
          <View style={styles.datePickerButtons}>
            <TouchableOpacity onPress={handleAccept} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelDateRange} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    margin: 2,
    backgroundColor: '#00adf5',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: 'white',
  },
  cancelButton: {
    margin: 2,
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: 'white',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 15,
    height: 50,
  },
  dateText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: '#333333',
  },
  dateButton: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 20,
  },
  datePickerButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 15,
    marginHorizontal: 20,
  },
  acceptButton: {
    padding: 10,
    backgroundColor: '#5cb85c',
    borderRadius: 5,
  },
  dateButton: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: '#333333',
  },
});

export default DatePickerComponent;