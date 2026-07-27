import React, { useState } from 'react';
import { authService } from '../../services/authService.js';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import toast from 'react-hot-toast';

const passwordSchema = zod.object({
  currentPassword: zod.string().min(1, 'Current password is required'),
  newPassword: zod.string().min(6, 'New password must be at least 6 characters long'),
  confirmPassword: zod.string().min(1, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onPasswordSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (res.success) {
        toast.success(res.message || 'Password changed successfully');
        reset();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    toast.success('App preferences updated successfully!');
  };

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">App Settings</h2>
        <p className="text-xs text-slate-400">Configure global password changes, languages, and notifications.</p>
      </div>

      {/* 1. Change Password panel */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="submit" loading={loading}>
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. Preferences config panel */}
      <Card>
        <CardHeader>
          <CardTitle>Global Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePreferencesSubmit} className="space-y-5">
            <Select
              label="App Language"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Español' },
                { value: 'fr', label: 'Français' },
                { value: 'gu', label: 'Gujarati' },
              ]}
            />

            {/* Notification Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-slate-500">Notification Alerts</label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="rounded border-slate-350 text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-xs text-slate-650 dark:text-slate-350 font-medium">
                  Receive email reminders for goals and habits
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => setPushNotifs(e.target.checked)}
                  className="rounded border-slate-350 text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-xs text-slate-650 dark:text-slate-350 font-medium">
                  Enable browser-ready push notifications (active polling)
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="submit">
                Save Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
