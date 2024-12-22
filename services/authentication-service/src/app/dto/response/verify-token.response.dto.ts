import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export class VerifyTokenResponseDto {
  sub: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  picture?: string;


  constructor(payload: DecodedIdToken) {
    this.sub = payload.sub;
    this.email = payload.email;
    this.emailVerified = payload.email_verified;
    this.name = payload.name;
    this.picture = payload.picture;
  }
}