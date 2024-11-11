import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PrimaryButton = ({text, onPress, icon, bgColor, iconBgColor, textcolor, iconVisible = true}: 
  {text: string; onPress: () => void; icon?: string; bgColor?: string; iconBgColor?: String; iconVisible?:Boolean; textcolor?:string}) => {
  
  // Optional changes for styling
  const iconName = icon ? icon : "arrow-right";
  const buttonBgColor = bgColor ? bgColor : "bg-[#40BFFF]";
  const buttonIconBgColor = iconBgColor ? iconBgColor : 'bg-[#003566]'
  const iconColor = bgColor ? bgColor : "white";
  textcolor = textcolor? textcolor : "text-white";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${buttonBgColor} rounded-xl py-4`}
    >
      <View className="flex-row items-center justify-center">
        <Text className={`${textcolor} text-2xl uppercase px-5`}>{text}</Text>

        {/* Display icon only when iconVisible is true */}
        {iconVisible && (
          <View className={`${buttonIconBgColor} rounded-full p-1.5 ml-3`}>
            <MaterialCommunityIcons name={`${iconName}`} size={16} color={iconColor} />
            {/* <Ionicons name="arrow-forward" size={16} color="white" /> */}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
