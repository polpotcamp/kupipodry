import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {

  getHash(password: string): string {
    return hashSync(password, genSaltSync(10));
  }

  compare(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}