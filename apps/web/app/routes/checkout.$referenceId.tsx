import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import invariant from 'tiny-invariant';

import {
  OrderWorkflow,
  useCurrentWorkflow,
  useWorkflowActions,
  WorkflowStep,
  WorkflowTypes,
} from '~/providers';
import { CheckoutPage } from '~/pages/CheckoutPage';
import PageLayout from '~/pages/PageLayout';

export const meta: MetaFunction = () => {
  return [
    { title: 'ProjectX - Checkout' },
    {
      name: 'description',
      content: 'Complete your purchase securely.',
    },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params?.referenceId, 'referenceId is required');
  const { referenceId } = params;
  return {
    referenceId,
  };
};

export default function Checkout() {
  const { items, emptyCart } = useCart();
  const { referenceId } = useLoaderData<typeof loader>();
  // Get the workflow running for this order with that referenceId
  const currentCheckoutWorkflow = useCurrentWorkflow<OrderWorkflow>(
    WorkflowTypes.ORDER,
    (workflow) => workflow.referenceId === referenceId
  );
  // Trigger actions to manage the workflow
  const { handleRun } = useWorkflowActions<OrderWorkflow>({
    workflowType: WorkflowTypes.ORDER,
  });
  const [clientSecret, setClientSecret] = useState('');

  // Trigger the creation of the order workflow
  useEffect(() => {
    if (!currentCheckoutWorkflow && !clientSecret && items.length > 0) {
      handleRun({
        workflow: {
          referenceId,
          maxRetries: 50,
          expirationTimeInMilliseconds: 1000 * 60 * 60 * 24,
          step: WorkflowStep.START,
          data: {
            referenceId,
            billingAddress: '',
            paymentMethod: '',
            shippingAddress: '',
            items: items.map((item) => ({
              productId: Number(item.id),
              quantity: item.quantity ?? 1,
            })),
          },
        },
      });
      emptyCart();
    }
  }, [currentCheckoutWorkflow, clientSecret, items]);

  useEffect(() => {
    if (!clientSecret && currentCheckoutWorkflow?.data?.response?.clientSecret) {
      setClientSecret(currentCheckoutWorkflow.data.response.clientSecret);
    }
  }, [currentCheckoutWorkflow?.data?.response?.clientSecret, clientSecret]);

  return (
    <PageLayout title="Checkout">
      <CheckoutPage clientSecret={clientSecret} />
    </PageLayout>
  );
}
