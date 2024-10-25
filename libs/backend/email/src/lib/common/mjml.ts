import mjml from 'mjml';

import { COLORS } from './constants';
import { getHeadTemplate } from './head';
import { getHeaderTemplate } from './header';
import { getFooterTemplate } from './footer';

export const getBodyTemplate = (
  body: string,
  title?: string,
  preview?: string
) => `
<mjml>
  ${getHeadTemplate(title, preview)}

  <mj-body background-color="${COLORS.background}">
    ${getHeaderTemplate()}
    ${body}
    ${getFooterTemplate()}
  </mj-body>
</mjml>
`;

export const getEmailHtml = (body: string) => {
  const { errors, html } = mjml(getBodyTemplate(body));
  if (errors?.length) {
    throw new Error(errors[0].formattedMessage);
  }
  return html;
};
