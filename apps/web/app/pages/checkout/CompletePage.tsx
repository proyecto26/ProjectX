import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';

export const CompletePage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
        <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
      </div>
      <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Payment successful</h3>
      <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
        Thank you for your purchase. Your payment has been processed successfully.
      </p>
      <div className="mt-6">
        <Link
          to="/order-history"
          className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
        >
          View order history
        </Link>
      </div>
    </motion.div>
  );
}; 