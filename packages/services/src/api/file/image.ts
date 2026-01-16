import { API_URL } from '@repo/constants/paths';

const baseRequestUrl = `${API_URL}/file/image`;

export const imageUpload = async (
  formData: FormData,
  imageId: string,
  folderPath: string,
  options?: {
    bustCache?: boolean;
  }
) => {
  try {
    formData.append('imageId', imageId);
    formData.append('folderPath', folderPath);

    if (options?.bustCache) {
      formData.append('bustCache', 'true');
    } else {
      formData.append('bustCache', 'false');
    }

    const request = new Request(baseRequestUrl, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (upload image):', error);
    throw error;
  }
};

export const imageDelete = async (imageId: string) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify({ imageId }),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete image):', error);
    throw error;
  }
};
