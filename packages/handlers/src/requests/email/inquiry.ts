import { getClientApiUrl } from '@repo/constants';
import { HEADERS } from '@repo/constants';
import { FormValuesInquiry } from '@repo/types';

const baseRequestUrl = `${getClientApiUrl()}/inquiry`;

export const handleInquiry = async (formData: FormValuesInquiry) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(formData),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (send inquiry):', error);
    throw error;
  }
};
