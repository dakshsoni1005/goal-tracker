import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '../../context/AuthContext.jsx';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Input, Select } from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Card, { CardContent } from '../../components/ui/Card.jsx';

const registerSchema = zod.object({
  name: zod.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
  email: zod.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters long'),
  timezone: zod.string().default('UTC'),
});

const timezoneOptions = [
  { value: 'UTC', label: 'UTC (GMT+0)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (GMT+5:30)' },
  { value: 'America/New_York', label: 'America/New_York (GMT-5)' },
  { value: 'Europe/London', label: 'Europe/London (GMT+0)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (GMT+9)' },
];

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register: registerField, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password, data.timezone);
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
        {/* Header Branding */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="bg-primary p-2.5 rounded-2xl text-white shadow-soft">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Create your account
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Get started for free. Start building productive habits today.
          </p>
        </div>

        {/* Form Container */}
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                error={errors.name?.message}
                {...registerField('name')}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                error={errors.email?.message}
                {...registerField('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...registerField('password')}
              />

              <Select
                label="Preferred Timezone"
                options={timezoneOptions}
                error={errors.timezone?.message}
                {...registerField('timezone')}
              />

              <Button
                type="submit"
                className="w-full mt-2"
                loading={loading}
              >
                Sign Up Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Switch trigger */}
        <p className="text-center text-xs text-slate-400 font-semibold">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-bold">
            Sign In Instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
