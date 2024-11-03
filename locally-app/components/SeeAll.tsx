
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

const SeeAll = ({
  title,
  seeAllColor = 'text-gray-500',
  arrowColor = '#6B7280',
  styling,
  onSeeAllPress
}: {
  title: string,
  seeAllColor?: string,
  arrowColor?: string,
  styling?: string,
  onSeeAllPress: () => void
}) => {
  return (
    <View className={`flex-row items-center justify-between pl-8 pr-6 ${styling}`}>
      <Text className="text-lg font-semibold color-primary-pBlue">
        {title}
      </Text>
      
      <TouchableOpacity onPress={onSeeAllPress}>
        <View className='flex-row gap-1 items-center'>
          <Text className={`font-medium ${seeAllColor}`}>
            See All
          </Text>
          <AntDesign name="caretright" size={12} color={arrowColor} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default SeeAll