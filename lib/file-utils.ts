import { promises as fs } from 'fs';
import path from 'path';
import { isAllowedImageExtension } from './image-constants';

const ICONS_DIR = path.join(process.cwd(), 'data', 'icons');
const APP_LOGO_BASENAME = 'app-logo';

/**
 * Deletes all icon files for a given service ID
 * Checks all possible extensions since we don't know which one was uploaded
 */
export async function deleteServiceIcon(serviceId: string): Promise<void> {
  try {
    const files = await fs.readdir(ICONS_DIR);

    // Find all files that start with the serviceId
    const iconFiles = files.filter(file => {
      const nameWithoutExt = path.parse(file).name;
      return nameWithoutExt === serviceId;
    });

    // Delete each found icon file
    for (const file of iconFiles) {
      const filePath = path.join(ICONS_DIR, file);
      await fs.unlink(filePath);
      console.log(`Deleted icon: ${file}`);
    }
  } catch (error) {
    console.error(`Error deleting icon for service ${serviceId}:`, error);
    // Don't throw - deletion failures shouldn't block other operations
  }
}

/**
 * Gets the path to a service icon if it exists
 */
export async function getServiceIconPath(serviceId: string): Promise<string | null> {
  try {
    const files = await fs.readdir(ICONS_DIR);

    const iconFile = files.find(file => {
      const nameWithoutExt = path.parse(file).name;
      return nameWithoutExt === serviceId;
    });

    return iconFile ? `icons/${iconFile}` : null;
  } catch (error) {
    console.error(`Error getting icon for service ${serviceId}:`, error);
    return null;
  }
}

/**
 * Validates file extension
 */
export function isValidImageExtension(filename: string): boolean {
  return isAllowedImageExtension(filename);
}

/**
 * Gets the full filesystem path for an icon
 */
export function getIconFilePath(filename: string): string {
  return path.join(ICONS_DIR, filename);
}

/**
 * Deletes the stored app logo file at the given config path (e.g., "icons/foo.png").
 */
export async function deleteAppLogo(iconPath: string): Promise<void> {
  const filePath = path.join(ICONS_DIR, path.basename(iconPath));
  try {
    await fs.unlink(filePath).catch(() => {});
  } catch (error) {
    console.error('Error deleting app logo:', error);
  }
}

/**
 * Gets the target filename for the app logo with the provided extension
 */
export function getAppLogoFilename(ext: string): string {
  return `${APP_LOGO_BASENAME}${ext}`;
}
