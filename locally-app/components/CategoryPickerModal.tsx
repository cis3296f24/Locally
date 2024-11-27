import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CategoryPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  existingCategories: string[];
  onCreateNewCategory: (categoryName: string) => Promise<void>;
  isLoading?: boolean;
}

const CategoryPickerModal = ({ 
  visible, 
  onClose, 
  onSelectCategory,
  existingCategories,
  onCreateNewCategory,
  isLoading = false
}: CategoryPickerModalProps) => {
  const [newCategory, setNewCategory] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    // Check if category already exists
    if (existingCategories.some(cat => cat.toLowerCase() === newCategory.trim().toLowerCase())) {
      Alert.alert('Error', 'This category already exists');
      return;
    }

    setIsCreating(true);
    try {
      await onCreateNewCategory(newCategory.trim());
      setNewCategory('');
      Alert.alert('Success', 'Category created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create category');
    } finally {
      setIsCreating(false);
    }
  };

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      className="px-4 py-3 border-b border-gray-100"
      onPress={() => {
        onSelectCategory(item);
        onClose();
      }}
    >
      <Text className="text-black text-base">{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-4 py-2 flex-row items-center justify-between border-b border-gray-200">
          <Text className="text-lg font-bold text-[#001D3D]">Select Category</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#001D3D" />
          </TouchableOpacity>
        </View>

        {/* Create New Category Section */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-[#001D3D] font-bold mb-2">Create New Category</Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-white border border-[#E5E9F0] rounded-xl px-4 py-2 mr-2"
              placeholder="Enter new category name"
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <TouchableOpacity
              className="bg-[#003566] px-4 py-2 rounded-xl"
              onPress={handleCreateCategory}
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white">Create</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Existing Categories List */}
        <View className="flex-1">
          <Text className="px-4 py-2 text-[#001D3D] font-bold bg-gray-50">
            Existing Categories
          </Text>
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#003566" />
            </View>
          ) : (
            <FlatList
              data={existingCategories}
              renderItem={renderCategory}
              keyExtractor={item => item}
              contentContainerStyle={{ flexGrow: 1 }}
              ListEmptyComponent={() => (
                <View className="flex-1 justify-center items-center p-4">
                  <Text className="text-gray-500">No categories available</Text>
                </View>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default CategoryPickerModal;