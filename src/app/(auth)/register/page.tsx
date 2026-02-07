import { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account | ThreadSwap',
  description: 'Join ThreadSwap — buy, sell, and swap fashion with your community',
};

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Join the community. Start swapping threads today.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}