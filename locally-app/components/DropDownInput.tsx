import { Entypo } from "@expo/vector-icons";
import { Text, View, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

export const DropDownInput = ({
  title,
  placeholder, 
  data,
  onSelect 
}: {
  title?: string,
  placeholder: string,
  data: string[], 
  onSelect: (item: string) => void 
}) => {
  return (
    <>
      { title && <Text className="text-lg text-primary-pBlue font-semibold">{title}</Text> }
      <SelectDropdown
        data={data}
        onSelect={onSelect}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View className='flex-row flex-1 items-center bg-white border border-secondary-sBlue rounded-xl px-4 mb-4'>
              <Text className={`flex-1 py-4 ${selectedItem ? 'text-primary-pBlue font-medium' : 'text-gray-400' }`}>
                {selectedItem || placeholder}
              </Text>
              <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} size={24} color="gray" />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              className={`flex-row items-center justify-between px-4 py-2 ${isSelected ? 'bg-gray-300' : ''}`}
            >
              <Text className='text-lg text-gray-700'>{item}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    maxHeight: 50,
  },
});
