'use server';

import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.NEXT_IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
});

export async function uploadToImageKit(params: {
  file: Buffer;
  fileName: string;
  folder?: string;
  useUniqueFileName?: boolean;
}) {
  return imagekit.upload(params);
}

export async function deleteFromImageKit(fileId: string) {
  return imagekit.deleteFile(fileId);
}
