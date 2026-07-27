import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { authService } from '../../services/authService.js';
import { CheckCircle, Mail, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Card, { CardContent } from '../../components/ui/Card.jsx';
import toast from 'react-hot-toast';

const schema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.forgotPassword(data.email);
      if (res.success) {
        setSent(true);
        toast.success('Password reset link sent to your email.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slateBg-light dark:bg-slateBg-dark px-6 py-12 transition-colors duration-200">
      <div className="w-full max-w-md space-y-6">
        {/* Branding Header */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="bg-primary p-2.5 rounded-2xl text-white shadow-soft">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            We will send a password reset url to your email inbox.
          </p>
        </div>

        {/* Form panel */}
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Registered Email"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Button
                  type="submit"
                  className="w-full mt-2"
                  loading={loading}
                >
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Check your email</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We have emailed a password reset link. Please click it to configure your new credentials.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSent(false)}
                  className="w-full mt-2"
                >
                  Resend Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Link */}
        <p className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold transition-all"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Sign In</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
