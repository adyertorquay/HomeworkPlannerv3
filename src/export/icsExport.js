import { createEvents } from 'ics'

// sessions: [{title,start,end}] deadlines: [{title,dueAt}]
export function generateICS(sessions, deadlines) {
  const toArr = d => [
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes()
  ]

  const items = [
    ...sessions.map(s => ({
      title: `Homework: ${s.title}`,
      start: toArr(s.start),
      end: toArr(s.end),
      status: 'CONFIRMED'
    })),
    ...deadlines.map(d => ({
      title: `DUE: ${d.title}`,
      start: toArr(d.dueAt),
      end: toArr(new Date(d.dueAt.getTime() + 30 * 60000)), // add 30 mins
      status: 'CONFIRMED'
    }))
  ]

  const { error, value } = createEvents(items)
  if (error) throw error
  return value
}
