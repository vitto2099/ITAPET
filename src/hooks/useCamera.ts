import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useCamera = () => {
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Erro", "Precisamos de permissão para acessar a câmera.");
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    return !result.canceled ? result.assets[0].uri : null;
  };

  return { takePhoto };
};