import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { deleteServiceIcon, isValidImageExtension, getIconFilePath } from '@/lib/file-utils';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'image/webp',
  'image/gif',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const serviceId = formData.get('serviceId') as string;

    // Validation
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!serviceId) {
      return NextResponse.json({ success: false, error: 'No service ID provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PNG, JPG, SVG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 2MB.' },
        { status: 400 }
      );
    }

    // Get file extension
    const ext = path.extname(file.name).toLowerCase();
    if (!isValidImageExtension(file.name)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file extension.' },
        { status: 400 }
      );
    }

    // Delete old icon if exists
    await deleteServiceIcon(serviceId);

    // Save new file
    const filename = `${serviceId}${ext}`;
    const filePath = getIconFilePath(filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(filePath, buffer);

    const iconPath = `/icons/${filename}`;

    return NextResponse.json({
      success: true,
      iconPath,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
