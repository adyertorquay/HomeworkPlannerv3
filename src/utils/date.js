import { addDays, startOfWeek, set, isBefore } from 'date-fns'

// Given a weekday number (1=Mon..7=Sun), return the Date within the current week.
export function dateForWeekday(weekday, base = new Date()) {
  const weekStart = startOfWeek(base, { weekStartsOn: 1 }) // Monday
  return addDays(weekStart, weekday - 1)
}

export function dueDateFromWeekly(task, base = new Date()) {
  let d = dateForWeekday(task.weekday, base)
  d = set(d, {
    hours: task.dueHour ?? 17,
    minutes: task.dueMinute ?? 0,
    seconds: 0,
    milliseconds: 0
  })
  // If due date already passed this week, push to next week
  if (isBefore(d, base)) d = addDays(d, 7)
  return d
}
