import { Link } from "expo-router";
import { Text, View } from "react-native";
// import {TabsLayout} from "./TabsLayout";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Link
        href="/(tabs)/metadata"
        className="text-blue-600 font-bold text-2xl"
      >
        <Text>Go to Tab View</Text>
      </Link>
    </View>
  );
}
