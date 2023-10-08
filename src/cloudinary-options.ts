// Define your custom types for Cloudinary options

export interface CloudinaryStorageUploadOptions {
  // Define the properties you need
  // For example:
  folder: string;
  allowed_formats: string[];
  unique_filename: boolean;
}

export interface PickedUploadApiOptions {
  // Define other properties if needed
}

export type OptionCallback<T> = (error: any, result: T) => void;
