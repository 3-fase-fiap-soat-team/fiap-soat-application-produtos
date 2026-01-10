import { Injectable } from '@nestjs/common';
import { IdGenerator } from 'src/interfaces/id-generator';

@Injectable()
export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    const crypto = require('crypto');
    if (crypto && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  }
}
