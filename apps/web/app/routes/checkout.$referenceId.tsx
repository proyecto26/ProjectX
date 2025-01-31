import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
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
  const { handleRun, handleClear } = useWorkflowActions<OrderWorkflow>({
    workflowType: WorkflowTypes.ORDER,
  });
  const workflowInitiatedRef = useRef(false);
  const [error, setError] = useState<Error>();

  // Trigger the creation of the order workflow
  useEffect(() => {
    if (
      !workflowInitiatedRef.current &&
      !currentCheckoutWorkflow &&
      items.length > 0
    ) {
      workflowInitiatedRef.current = true;
      handleRun({
        workflow: {
          referenceId,
          expirationTimeInMilliseconds: Date.now() + 1000 * 60 * 60 * 24,
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
      // Clear the cart after the workflow is triggered
      emptyCart();
    }
  }, [currentCheckoutWorkflow, items]);

  // Manage errors with the current workflow
  useEffect(() => {
    if (currentCheckoutWorkflow?.error) {
      setError(currentCheckoutWorkflow.error);
      handleClear({ workflow: currentCheckoutWorkflow });
    }
  }, [currentCheckoutWorkflow?.error]);

  return (
    <PageLayout title="Checkout">
      <CheckoutPage
        error={error}
        isLoading={items?.length > 0 || !currentCheckoutWorkflow}
        currentCheckoutWorkflow={currentCheckoutWorkflow}
      />
    </PageLayout>
  );
}
