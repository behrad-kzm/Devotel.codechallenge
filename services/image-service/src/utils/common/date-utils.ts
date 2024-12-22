export type AppointmentDateRange = { startAt: Date, endAt: Date, operatoryId?: string };

export function calculateDurationMinutes(
  start: Date,
  end: Date,
): number {
  const duration = end.getTime() - start.getTime();
  return Math.round(duration / 60000);
}

export function getDayName(dayNumber: number): string {
  if (dayNumber < 0 || dayNumber > 6) {
    throw new Error('Invalid day number');
  }
  let dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[dayNumber];
}
