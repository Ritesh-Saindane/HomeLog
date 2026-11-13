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

export async function syncUserNotifications(assets, api) {
  const schedules = (await Promise.all(assets.map(async (asset) => {
    try {
      const response = await api.get(`/assets/${asset.id}/maintenance`);
      return response.data;
    } catch {
      return [];
    }
  }))).flat();
  const allowed = await requestNotificationPermission();
  if (!allowed) return { scheduled: 0, permissionDenied: true };
  await Notifications.cancelAllScheduledNotificationsAsync();
  let scheduled = 0;
  for (const schedule of schedules.filter((item) => item.isActive)) {
    scheduled += await scheduleDateNotification(schedule.title, schedule.nextDueDate, schedule.reminderDaysBefore);
  }
  for (const asset of assets.filter((item) => item.warrantyEndDate)) {
    scheduled += await scheduleDateNotification(`${asset.name} warranty`, asset.warrantyEndDate, 7, 'Warranty expiry reminder');
  }
  return { scheduled, permissionDenied: false };
}

async function scheduleDateNotification(title, dueDate, daysBefore, dueTitle = title) {
  let scheduled = 0;
  const due = new Date(`${String(dueDate).slice(0, 10)}T09:00:00`);
  const reminder = new Date(due);
  reminder.setDate(reminder.getDate() - (daysBefore || 0));
  for (const [date, notificationTitle] of [[reminder, `${title} is coming up`], [due, `${dueTitle} is due today`]]) {
    if (date.getTime() <= Date.now()) continue;
    await Notifications.scheduleNotificationAsync({ content: { title: notificationTitle, body: 'Open HomeLog to review the details.' }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date } });
    scheduled += 1;
  }
  return scheduled;
}

