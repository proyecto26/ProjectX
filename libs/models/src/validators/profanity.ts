import { Injectable } from '@nestjs/common';
import { Profanity } from '@2toad/profanity';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: false })
export class ProfanityValidator implements ValidatorConstraintInterface {
  private profanity: Profanity;

  constructor() {
    this.profanity = new Profanity();
  }

  validate(text: string) {
    return typeof text === 'string' && !this.profanity.exists(text);
  }

  defaultMessage() {
    return 'The provided text contains inappropriate words.';
  }
}

export function NoProfanity(validationOptions?: ValidationOptions) {
  return function (obj: object, propertyName: string) {
    registerDecorator({
      target: obj.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ProfanityValidator,
    });
  };
}
