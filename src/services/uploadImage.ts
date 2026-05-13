import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

/**
 * Uploads an image from a local URI to Firebase Storage.
 * @param uri The local URI of the image (from expo-image-picker or similar)
 * @param path The path in Firebase Storage (e.g., 'pets/image.jpg')
 * @returns The download URL of the uploaded image
 */
export async function uploadImage(uri: string, path: string): Promise<string> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
