import cron from 'node-cron';
import Reminder from '../models/Reminder.js';
import Notification from '../models/Notification.js';
import { sendEmail, getReminderEmailTemplate } from '../utils/emailHelper.js';

/**
 * Checks for due reminders, sends emails/notifications, and handles recurrence
 */
export const checkReminders = async () => {
  const now = new Date();
  
  try {
    // Find all pending reminders due now or in the past
    const dueReminders = await Reminder.find({
      status: 'pending',
      triggerTime: { $lte: now },
    }).populate(['user', 'goal', 'habit']);

    if (dueReminders.length === 0) {
      return;
    }

    console.log(`[Job Manager] Processing ${dueReminders.length} due reminders...`);

    for (const reminder of dueReminders) {
      const { user, title, type, frequency, goal, habit } = reminder;

      if (!user) {
        // Orphaned reminder, mark as failed
        reminder.status = 'failed';
        await reminder.save();
        continue;
      }

      let emailSent = false;
      let notificationCreated = false;

      // 1. Process email reminders
      if (type === 'email' || type === 'both') {
        const detailsText = goal 
          ? `Goal: ${goal.title}\nDue Date: ${new Date(goal.dueDate).toLocaleDateString()}`
          : habit 
            ? `Habit: ${habit.title}\nCurrent Streak: ${habit.streak} days`
            : 'Scheduled task reminder.';

        const detailsHtml = goal
          ? `<p><strong>Goal Target:</strong> ${goal.title}<br/><strong>Due:</strong> ${new Date(goal.dueDate).toLocaleDateString()}</p>`
          : habit
            ? `<p><strong>Habit Practice:</strong> ${habit.title}<br/><strong>Current Streak 🔥:</strong> ${habit.streak} days</p>`
            : '<p>Time to work on your scheduled tracking habits and goals.</p>';

        try {
          await sendEmail({
            email: user.email,
            subject: `GoalFlow: ${title}`,
            message: `Hi ${user.name},\n\nThis is your reminder: ${title}\n\n${detailsText}`,
            html: getReminderEmailTemplate(user.name, title, detailsHtml),
          });
          emailSent = true;
        } catch (err) {
          console.error(`[Job Manager] Failed sending email for reminder ${reminder._id}: ${err.message}`);
        }
      }

      // 2. Process browser/in-app reminders
      if (type === 'browser' || type === 'both') {
        try {
          await Notification.create({
            title: `Reminder: ${title}`,
            message: goal 
              ? `Your goal "${goal.title}" is due soon.`
              : habit 
                ? `Don't forget to track your habit "${habit.title}".`
                : `Time for: ${title}`,
            type: 'reminder',
            isRead: false,
            user: user._id,
          });
          notificationCreated = true;
        } catch (err) {
          console.error(`[Job Manager] Failed creating notification for reminder ${reminder._id}: ${err.message}`);
        }
      }

      // 3. Handle recurrence vs single execution
      if (frequency === 'once') {
        reminder.status = (emailSent || notificationCreated) ? 'sent' : 'failed';
      } else {
        // Recurrent reminder: reschedule triggerTime
        const newTrigger = new Date(reminder.triggerTime);
        if (frequency === 'daily') {
          newTrigger.setDate(newTrigger.getDate() + 1);
        } else if (frequency === 'weekly') {
          newTrigger.setDate(newTrigger.getDate() + 7);
        }
        reminder.triggerTime = newTrigger;
        reminder.status = 'pending'; // keep active for next run
      }

      await reminder.save();
    }
    
    console.log(`[Job Manager] Reminders check cycle completed.`);
  } catch (error) {
    console.error(`[Job Manager] Error running reminder checker: ${error.message}`);
  }
};

/**
 * Initializes all system cron jobs
 */
const initCronJobs = () => {
  // Run reminder checker every minute
  cron.schedule('* * * * *', () => {
    console.log('[Cron Job] Checking for due reminders...');
    checkReminders();
  });
  
  console.log('\x1b[32m[Scheduler] Background cron jobs initialized successfully\x1b[0m');
};

export default initCronJobs;
