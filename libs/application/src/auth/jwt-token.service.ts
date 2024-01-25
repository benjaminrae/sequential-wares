import { JwtPayload, sign, verify } from 'jsonwebtoken';

export type TokenPayload<SubPayload> = JwtPayload & {
  sub?: SubPayload;
};

export type JwtTokenServiceConfig = {
  secret: string;
  tokenExpiry: string;
};

export class JwtTokenService {
  #secret: string;
  #tokenExpiry: string;

  constructor({ secret, tokenExpiry }: JwtTokenServiceConfig) {
    this.#secret = secret;
    this.#tokenExpiry = tokenExpiry;
  }

  public verifyToken<Payload extends TokenPayload<unknown>>(token: string): Payload {
    return verify(token, this.#secret) as Payload;
  }

  public generateToken<Payload extends TokenPayload<unknown>>(payload: Payload): string {
    return sign(payload as object, this.#secret, {
      expiresIn: this.#tokenExpiry,
    });
  }
}
