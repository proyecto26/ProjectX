import { EmailTemplateDataMap, EmailTemplateFactory } from './factory';

export enum EmailTemplates {
  AuthLogin = 'auth_login',
  OrderPending = 'order_pending',
  OrderSuccess = 'order_success',
  OrderFailed = 'order_failed',
}

export function getEmailTemplate<T extends EmailTemplates>(
  templateKey: EmailTemplates,
  data: EmailTemplateDataMap[T]
) {
  return EmailTemplateFactory.createEmailTemplate(templateKey, data);
}
