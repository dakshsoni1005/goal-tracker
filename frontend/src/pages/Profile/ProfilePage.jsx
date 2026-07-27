import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { User, Globe, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = zod.object({
  name: zod.string().min(1, 'Name is required').max(50),
  avatar: zod.string().optional(),
  timezone: zod.string().min(1, 'Timezone is required'),
});

const timezoneOptions = [
  { value: 'UTC', label: 'UTC (GMT+0)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (GMT+5:30)' },
  { value: 'America/New_York', label: 'America/New_York (GMT-5)' },
  { value: 'Europe/London', label: 'Europe/London (GMT+0)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (GMT+9)' },
];

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      avatar: user?.avatar || '',
      timezone: user?.timezone || 'UTC',
    }
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await updateProfile(values);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">My Account Profile</h2>
        <p className="text-xs text-slate-400">Configure personal account details, avatar, and timezone settings.</p>
      </div>

      <Card>
        <CardContent className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex items-center space-x-4 pb-4 border-b border-slate-100 dark:border-slate-850">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150'}
              alt="Avatar Profile"
              className="h-16 w-16 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-805 dark:text-slate-150">{user?.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Avatar Image Link"
              placeholder="https://images.unsplash.com/..."
              error={errors.avatar?.message}
              {...register('avatar')}
            />

            <Select
              label="Preferred Timezone"
              options={timezoneOptions}
              error={errors.timezone?.message}
              {...register('timezone')}
            />

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="submit" loading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
