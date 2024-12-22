import { Injectable } from '@nestjs/common';
import { VerifyTokenRequestDto } from './dto/request/verify-token.request.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Injectable()
export class AppService {

  constructor(
    private readonly firebaseService: FirebaseService,
  ) {}

  async verifyFirebaseIdToken({ dto }: { dto: VerifyTokenRequestDto }): Promise<DecodedIdToken> {
    return this.firebaseService.verifyToken(dto.idToken);
  }
}
