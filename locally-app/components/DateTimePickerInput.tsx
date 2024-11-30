import { Ionicons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export const DateTimePickerInput = ({
  title,
  placeholder,
  isTimePicker = false,
  onSelectDate,
  onSelectTime,
}: {
  title?: string;
  placeholder: string;
  isTimePicker?: boolean;
  onSelectDate?: (date: Date) => void;
  onSelectTime?: (time: string) => void;
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState<Date | null>(null);

  const showPicker = () => {
    setDatePickerVisibility(true);
  };

  const hidePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    if (isTimePicker && onSelectTime) {
      onSelectTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    } else if (!isTimePicker && onSelectDate) {
      onSelectDate(date);
    }

    setSelectedTimestamp(date); // Save to state
    hidePicker();
  };

  const formatDisplay = (timestamp: Date) => {
    // Format date or time based on picker type
    const date = timestamp;
    if (isTimePicker) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    return date.toLocaleDateString();
  };

  return (
     <View className="flex-1">
        { title && <Text className="text-lg text-primary-pBlue font-semibold mb-2">{title}</Text> }
        <View className="flex-row flex-1 items-center bg-white border border-secondary-sBlue rounded-xl px-4 mb-4">
          <TouchableOpacity onPress={showPicker} className="flex-row items-center flex-1">
            <Text 
              className={`flex-1 py-3 text-lg ${
                selectedTimestamp ? 'text-primary-pBlue font-medium' : 'text-gray-400'
              }`}
            >
              {selectedTimestamp 
                ? formatDisplay(selectedTimestamp) 
                : placeholder || (isTimePicker ? 'Select Time' : 'Select Date')}
            </Text>
            <Ionicons 
              name={isTimePicker ? 'time-outline' : 'calendar-outline'}
              size={20} 
              color={selectedTimestamp ? '#003566' : "gray"} />
          </TouchableOpacity>
        </View>

        {/* Date Picker Modal */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={isTimePicker ? 'time' : 'date'}
          onConfirm={handleConfirm}
          onCancel={hidePicker}
          minimumDate={!isTimePicker ? new Date() : undefined}
        />
    </View>
  );
};