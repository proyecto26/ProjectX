import { ActionFunctionArgs, json } from '@remix-run/node';
import axios from 'axios';
import { authAPIUrl } from '~/config/app.config';
import { csrf } from '~/cookies/session.server';

import { LoginPage } from '~/pages/LoginPage';
import PageLayout from '~/pages/PageLayout';

enum FormIntents {
  LOGIN = 'login',
  VERIFY_CODE = 'verify-code',
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  await csrf.validate(formData, request.headers);
  const email = formData.get('email');
  const intent = formData.get('intent');
  if (!intent || !Object.values(FormIntents).includes(intent as FormIntents)) {
    return json({ error: 'Invalid intent', ok: false });
  }
  if (intent === FormIntents.LOGIN) {
    try {
      await axios.post(`${authAPIUrl}/login`, {
        email,
      });
      return json({ ok: true });
    } catch {
      return json({ error: 'Failed to send login email', ok: false });
    }
  }

  return json({ error: null, ok: true });
};

export default function Index() {
  return (
    <PageLayout
      title="ProjectX"
      containerClassName="test flex justify-center items-center"
      className="bg-gradient-to-b from-purple-600 to-indigo-700 dark:from-gray-900 dark:to-gray-800"
    >
      <LoginPage />
    </PageLayout>
  );
}
