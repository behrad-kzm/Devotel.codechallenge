import { HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { AppError } from '../utils';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class FirebaseService {
  private firebaseAuth: Auth;

  constructor(
    private readonly i18n: I18nService,
  ) {
    // Initialize Firebase App
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert('envs/firebase-service-account.json'),
      });
    }
    this.firebaseAuth = admin.auth();
  }

  // Verify Firebase ID Token
  async verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await this.firebaseAuth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw AppError(this.i18n, {
        status: HttpStatus.UNAUTHORIZED,
        identifiers: ['auth.invalid_token'],
      });
    }
  }

}
