import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { PrimaryButtonProps } from "@/types/type";

const PrimaryButton = ({
  text,
  onPress,
  icon = "arrow-right", 
  bgColor = "bg-[#40BFFF]",
  textcolor = "text-white",  
  iconBgColor = "bg-[#003566]", 
  iconColor = "white",
  iconVisible = true,
  buttonStyle = "",
  loading = false, 
}: PrimaryButtonProps) => {
  if (loading) {
    return <LoadingIndicator />; // Display only the LoadingIndicator when loading is true
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${bgColor} rounded-xl py-3 ${buttonStyle}`}
    >
      <View className="flex-row items-center justify-center">
        <Text className={`${textcolor} text-2xl font-semibold uppercase px-5`}>
          {text}
        </Text>

        {iconVisible && (
          <View className={`${iconBgColor} rounded-full p-1.5 ml-3`}>
            <MaterialCommunityIcons name={icon} size={16} color={iconColor} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PrimaryButton

const LoadingIndicator = () => (
  <View className="flex-row items-center justify-center">
    <ActivityIndicator color="#40BFFF" />
  </View>
) 
