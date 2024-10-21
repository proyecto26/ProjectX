import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';

type LoginState = 'email' | 'code';

type FormData = {
  email: string;
  code: string;
};

export function LoginPage() {
  const [loginState, setLoginState] = useState<LoginState>('email');
  const [formData, setFormData] = useState<FormData>({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Placeholder for email submission logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setLoginState('code');
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Placeholder for code submission logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setError('Invalid code. Please try again.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-base-100 shadow-xl rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        {loginState === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter your email"
                  required
                />
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content opacity-70" />
              </div>
            </div>
            <button
              type="submit"
              className={`btn btn-primary w-full mt-4 ${
                loading ? 'loading' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Login Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit}>
            <div className="form-control">
              <label htmlFor="code" className="label">
                <span className="label-text">Enter 6-digit Code</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="input input-bordered w-full pl-10"
                  placeholder="000000"
                  required
                  pattern="\d{6}"
                  maxLength={6}
                />
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content opacity-70" />
              </div>
            </div>
            <button
              type="submit"
              className={`btn btn-primary w-full mt-4 ${
                loading ? 'loading' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              type="button"
              className="btn btn-link w-full mt-2"
              onClick={() => setLoginState('email')}
            >
              Back to Email
            </button>
          </form>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-error mt-4 text-center"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
