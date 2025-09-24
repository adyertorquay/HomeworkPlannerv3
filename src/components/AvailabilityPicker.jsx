import React from 'react'
import { addHours, startOfWeek, set, addDays } from 'date-fns'
import clsx from 'clsx'

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 07:00–20:00
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function AvailabilityPicker({ availabilityMap, onToggle }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Your availability</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-left text-sm text-slate-500 px-2">Time</th>
              {DAYS.map(d => (<th key={d} className="text-sm text-slate-500 px-2">{d}</th>))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map(h => (
              <tr key={h}>
                <td className="text-xs text-slate-500 px-2 w-16">{String(h).padStart(2,'0')}:00</td>
                {DAYS.map((d, idx) => {
                  const key = `${idx+1}-${h}`
                  const active = !!availabilityMap[key]
                  return (
                    <td key={key} className="px-2">
                      <button
                        className={clsx(
                          'w-20 h-8 rounded-lg border text-xs',
                          active ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        )}
                        onClick={() => onToggle(idx+1, h)}
                        aria-pressed={active}
                      >
                        {active ? 'Free' : 'Busy'}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 mt-2">Click cells to mark when you’re free. Sessions will be scheduled into these blocks.</p>
    </div>
  )
}

// ✅ Exported so App.jsx can import it
export function availabilityToBlocks(availabilityMap, baseDate = new Date()) {
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 })
  const blocks = []
  for (const key of Object.keys(availabilityMap)) {
    if (!availabilityMap[key]) continue
    const [weekday, hour] = key.split('-').map(Number) // 1..7, 7..20
    const day = addDays(weekStart, weekday - 1)
    const start = set(day, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 })
    const end = addHours(start, 1)
    blocks.push({ start, end })
  }
  return blocks
}
