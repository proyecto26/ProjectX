import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivitiesService {
  constructor(public readonly httpService: HttpService) {}

  async getHelloMessage() {
    return 'Hello World';
  }
}