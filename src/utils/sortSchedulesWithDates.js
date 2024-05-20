export default function sortSchedulesWithDates(futureSchedules, pastSchedules) {
  futureSchedules.sort((a, b) => a.lastDay - b.lastDay);
  pastSchedules.sort((a, b) => b.lastDay - a.lastDay);
  return { futureSchedules, pastSchedules };
}
