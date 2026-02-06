import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorMessage from "../shared/ui/RepllyMessage/ErrorMessage";
import SuccessMessage from "../shared/ui/RepllyMessage/SuccessMessage";
import api from "./api";

/**
 * Refresh access token
 * @returns {Promise<string|null>} - New access token or null if error
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    const response = await axios.post(
      'https://api.akul.az/1.0/dev/login/refresh.php',
      { Refresh: refreshToken },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${await AsyncStorage.getItem('token')}`
        }
      }
    );


    if (response.data.Headers.ResponseStatus === "0" && response.data.Body.accessToken) {
      return response.data.Body.accessToken;
    }

    return null;
  } catch (error) {
    ErrorMessage(error.message || "Token yenilənmədi");
    return null;
  }
};

/**
 * Upload image to server
 * @param {object} imageData - Image data from picker
 * @param {string} productId - Product ID
 * @returns {Promise<object|null>} - Response from server or null if error
 */
export const uploadProductImage = async (imageData, productId) => {
  try {
    // First refresh the token
    const accessToken = await refreshAccessToken();
    if (!accessToken) {
      ErrorMessage("Token yenilənmədi, şəkil yüklənə bilmədi");
      return null;
    }

    // Check if network is available
    const formData = new FormData();

    // Add image to form data
    formData.append('image', {
      uri: imageData.uri,
      type: imageData.type,
      name: imageData.fileName || 'photo.jpg',
    });

    // Add other required fields
    formData.append('linkId', `productId_${productId}`);
    formData.append('title', 'akul');
    formData.append('tags', JSON.stringify([]));
    formData.append('token', accessToken);

    // Send request to upload.php
    const response = await axios.post(
      'https://1000.az/api/upload.php',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": `Bearer ${accessToken}`
        },
        timeout: 30000,
      }
    );

    if (response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    ErrorMessage(error.message || "Şəkil yüklənmədi");
    return null;
  }
};

/**
 * Update product images
 * @param {string} productId - Product ID
 * @param {Array} existingImages - Existing product images
 * @param {object} newImageData - New image data from server
 * @returns {Promise<object|null>} - Response from server or null if error
 */
export const updateProductImages = async (productId, existingImages = [], newImageData) => {
  try {
    // Prepare images array by combining existing images and new image
    const images = [...(existingImages || [])];

    // Add the new image if it exists
    if (newImageData) {
      images.push({
        id: newImageData.id,
        originalname: newImageData.originalname,
        uniqname: newImageData.uniqname,
        ext: newImageData.ext,
        path: newImageData.path
      });
    }

    // Make request to update product images
    const token = await AsyncStorage.getItem('token');
    const response = await api('products/images.php', {
      id: productId,
      images: images,
      token: token
    });

    if (response) {
      SuccessMessage("Şəkil əlavə edildi");
      return response;
    }

    return null;
  } catch (error) {
    ErrorMessage(error.message || "Şəkil əlavə edilmədi");
    return null;
  }
}; 