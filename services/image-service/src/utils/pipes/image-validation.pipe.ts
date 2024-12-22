import { Injectable, PipeTransform } from '@nestjs/common';
import { ValidationAppError } from '../common/app-error';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File): Promise<Express.Multer.File> {
    console.log('ImageValidationPipe: ', value);

    // Check if file is present
    if (!value) {
      throw ValidationAppError({
        messages: [
          { message: 'No file uploaded', identifier: 'file_missing' },
        ],
      });
    }

    // Check file type (allow only jpg, jpeg, png)
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(value.mimetype)) {
      throw ValidationAppError({
        messages: [
          { message: 'Invalid file type. Only JPEG and PNG are allowed', identifier: 'invalid_file_type' },
        ],
      });
    }

    // Check file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (value.size > maxSize) {
      throw ValidationAppError({
        messages: [
          { message: 'File size exceeds 5MB limit', identifier: 'file_size_exceeded' },
        ],
      });
    }

    return value;  // Return the validated file
  }
}
