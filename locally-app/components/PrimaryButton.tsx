import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons'

const PrimaryButton = ({ text, onPress }: { text: string; onPress: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        className="bg-[#40BFFF] rounded-xl py-4"
    >
        <View className="flex-row items-center justify-center">
            <Text className="text-white font-semibold">
                {text}
            </Text>
            <View className="bg-[#003566] rounded-full p-1.5 ml-3">
                <Ionicons name="arrow-forward" size={16} color="white" />
            </View>
        </View>
    </TouchableOpacity>
)

export default PrimaryButton

export const LoadingIndicator = () => (
    <View className="flex-row items-center justify-center">
        <ActivityIndicator size="large" color="#40BFFF" />
    </View>
) 