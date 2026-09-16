import { getClientApiUrl } from '@repo/constants';
import { FormValuesInquiry } from '@repo/types';

export const contactAdd = async (params: Partial<FormValuesInquiry>) => {
  try {
    const response = await fetch(`${getClientApiUrl()}/email-contacts`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('---> handler error (add email contact):', error);
    throw error;
  }
};
