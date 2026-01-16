import imagekit from '@repo/libraries/image-kit';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const imageId = formData.get('imageId') as string;
    const folderPath = formData.get('folderPath') as string;
    const bustCache = formData.get('bustCache') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Construct custom filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${imageId}.${fileExt}`;
    const fileSize = file.size; // in bytes

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: folderPath, // optional
      useUniqueFileName: false, // ✅ ensures overwrites
    });

    // ✅ Append ?size=xxx to the returned URL
    const urlWithSize = new URL(uploadResponse.url);
    urlWithSize.searchParams.set('fileSize', fileSize.toString());

    return NextResponse.json({
      url: bustCache == 'true' ? urlWithSize.toString() : uploadResponse.url,
      size: uploadResponse.size,
      imageId: uploadResponse.fileId, // ✅ store this
    });
  } catch (err) {
    console.error('upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { imageId } = await request.json();

    if (!imageId) {
      return NextResponse.json({ error: 'Missing image id' }, { status: 400 });
    }

    await imagekit.deleteFile(imageId); // ✅ ImageKit deletion

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Image delete error:', e);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
