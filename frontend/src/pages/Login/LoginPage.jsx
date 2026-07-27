import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '../../context/AuthContext.jsx';
import { CheckCircle, Lock, Mail, ArrowRight } from 'lucide-react';
import { Input } from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Card, { CardContent } from '../../components/ui/Card.jsx';

const loginSchema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters long'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slateBg-light dark:bg-slateBg-dark px-6 py-12 transition-colors duration-200">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="bg-primary p-2.5 rounded-2xl text-white shadow-soft">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Sign In to GoalFlow
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Welcome back! Continue tracking your habits and goals.
          </p>
        </div>

        {/* Login Form Box */}
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                loading={loading}
              >
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bottom Switch Trigger */}
        <p className="text-center text-xs text-slate-400 font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-bold">
            Create an Account Free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
