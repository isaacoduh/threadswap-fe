import { Metadata } from "next";
import { LoginForm } from '@/features/auth/components/LoginForm';


export const metadata: Metadata = {
  title: 'Sign In | ThreadSwap',
  description: 'Sign in to your ThreadSwap account',
};

export default function LoginPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Welcome Back
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Sign in to buy, sell and swap your favorite pieces
                </p>
            </div>
            <LoginForm />
        </div>
    )
}