import { json, LoaderFunctionArgs } from '@remix-run/node';
import { EmailTemplates, getEmailTemplate } from '@projectx/email';
import invariant from 'tiny-invariant';

export const loader = ({  params }: LoaderFunctionArgs) => {
  invariant(params?.template, 'template is required');
  const html = getEmailTemplate(params.template as unknown as EmailTemplates, {
    token: '123',
    orderId: '123',
  });
  if (!html) {
    return json(null, { status: 404 });
  }
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      encoding: 'UTF-8',
    },
  });
};
