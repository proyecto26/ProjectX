import { EmailTemplates } from './email';
import { getLoginEmailHtml, LoginEmailData } from './auth/login';
import {
  getOrderPendingEmailHtml,
  OrderPendingEmailData,
} from './order/orderPending';
import {
  getOrderSuccessEmailHtml,
  OrderSuccessEmailData,
} from './order/orderSuccess';
import {
  getOrderFailedEmailHtml,
  OrderFailedEmailData,
} from './order/orderFailed';

export type EmailTemplateDataMap = {
  [EmailTemplates.AuthOpt]: LoginEmailData;
  [EmailTemplates.OrderPending]: OrderPendingEmailData;
  [EmailTemplates.OrderSuccess]: OrderSuccessEmailData;
  [EmailTemplates.OrderFailed]: OrderFailedEmailData;
};

class EmailTemplateFactory {
  static createEmailTemplate<T extends EmailTemplates>(
    templateKey: EmailTemplates,
    data: EmailTemplateDataMap[T]
  ) {
    switch (templateKey) {
      case EmailTemplates.AuthOpt:
        return getLoginEmailHtml(data as LoginEmailData);
      case EmailTemplates.OrderPending:
        return getOrderPendingEmailHtml(data as OrderPendingEmailData);
      case EmailTemplates.OrderSuccess:
        return getOrderSuccessEmailHtml(data as OrderSuccessEmailData);
      case EmailTemplates.OrderFailed:
        return getOrderFailedEmailHtml(data as OrderFailedEmailData);
      default:
        return null;
    }
  }
}

export { EmailTemplateFactory };
