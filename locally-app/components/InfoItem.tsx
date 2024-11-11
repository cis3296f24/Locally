import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

// this component is use for the columns in the order summary
const InfoItem = ({ label, value, labelStyle, valueStyle }: 
  { label: string; value: string; labelStyle?:string, valueStyle?:string }) => {
  const labelStyling = labelStyle? labelStyle : "text-gray-500";
  const valueStyling = valueStyle? valueStyle : "font-medium";
  return (
    <View className="flex-col gap-1">
      <Text className={labelStyling}>{label}</Text>
      <Text className={valueStyling}>{value}</Text>
    </View>
  );
};

export default InfoItem;
