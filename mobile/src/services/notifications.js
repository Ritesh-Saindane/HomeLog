import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export async function requestNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

export async function rescheduleMaintenanceNotifications(schedules) {
  const allowed = await requestNotificationPermission();
  if (!allowed) return { scheduled: 0, permissionDenied: true };
  await Notifications.cancelAllScheduledNotificationsAsync();
  let scheduled = 0;
  for (const schedule of schedules.filter((item) => item.isActive)) {
    const due = new Date(`${schedule.nextDueDate}T09:00:00`);
    const reminder = new Date(due);
    reminder.setDate(reminder.getDate() - (schedule.reminderDaysBefore || 0));
    for (const [date, suffix] of [[reminder, 'reminder'], [due, 'due']]) {
      if (date.getTime() <= Date.now()) continue;
      await Notifications.scheduleNotificationAsync({
        content: { title: suffix === 'due' ? `${schedule.title} is due today` : `${schedule.title} is coming up`, body: 'Open HomeLog to review your maintenance schedule.' },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
      });
      scheduled += 1;
    }
  }
  return { scheduled, permissionDenied: false };
}

