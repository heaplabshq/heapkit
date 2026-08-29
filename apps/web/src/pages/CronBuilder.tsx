import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { CopyButton } from '../components/CopyButton'
import { NumberField } from '../components/ui/NumberField'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import {
  describeCron,
  fieldToExpr,
  nextRunTimes,
  type CronFields,
  type FieldState,
} from '../lib/cron'

function CronFieldEditor({
  label,
  unit,
  min,
  max,
  placeholder,
  state,
  onChange,
}: {
  label: string
  unit: string
  min: number
  max: number
  placeholder: string
  state: FieldState
  onChange: (state: FieldState) => void
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-surface-muted p-3">
      <span className="text-sm font-medium text-ink-strong">{label}</span>
      <SegmentedControl
        value={state.mode}
        onChange={(mode) => onChange({ ...state, mode })}
        options={[
          { value: 'every', label: 'Every' },
          { value: 'step', label: 'Every N' },
          { value: 'specific', label: 'Specific' },
          { value: 'range', label: 'Range' },
        ]}
      />

      {state.mode === 'step' && (
        <NumberField
          label={`Every N ${unit}`}
          value={state.step ?? 1}
          min={1}
          max={max}
          onChange={(v) => onChange({ ...state, step: v })}
        />
      )}

      {state.mode === 'specific' && (
        <input
          type="text"
          value={state.specific ?? ''}
          onChange={(e) => onChange({ ...state, specific: e.target.value })}
          placeholder={placeholder}
          className="rounded-lg border border-border bg-surface px-2 py-1 text-sm text-ink-strong transition focus:border-accent-border focus:outline-none focus:ring-2 focus:ring-accent-subtle"
        />
      )}

      {state.mode === 'range' && (
        <div className="flex items-center gap-2">
          <NumberField
            label="From"
            value={state.rangeFrom ?? min}
            min={min}
            max={max}
            onChange={(v) => onChange({ ...state, rangeFrom: v })}
          />
          <NumberField
            label="To"
            value={state.rangeTo ?? max}
            min={min}
            max={max}
            onChange={(v) => onChange({ ...state, rangeTo: v })}
          />
        </div>
      )}
    </div>
  )
}

const EVERY: FieldState = { mode: 'every' }

export function CronBuilder() {
  const [minute, setMinute] = useState<FieldState>({ mode: 'specific', specific: '0' })
  const [hour, setHour] = useState<FieldState>({ mode: 'specific', specific: '9' })
  const [dayOfMonth, setDayOfMonth] = useState<FieldState>(EVERY)
  const [month, setMonth] = useState<FieldState>(EVERY)
  const [dayOfWeek, setDayOfWeek] = useState<FieldState>(EVERY)

  const fields: CronFields = { minute, hour, dayOfMonth, month, dayOfWeek }

  const expression = useMemo(
    () =>
      [
        fieldToExpr(minute, 0, 59),
        fieldToExpr(hour, 0, 23),
        fieldToExpr(dayOfMonth, 1, 31),
        fieldToExpr(month, 1, 12),
        fieldToExpr(dayOfWeek, 0, 6),
      ].join(' '),
    [minute, hour, dayOfMonth, month, dayOfWeek],
  )

  const description = useMemo(() => describeCron(fields), [minute, hour, dayOfMonth, month, dayOfWeek])
  const nextRuns = useMemo(() => nextRunTimes(fields, 5), [minute, hour, dayOfMonth, month, dayOfWeek])

  return (
    <ToolPage
      title="Cron Builder"
      description="Build a cron expression visually — pick values per field instead of guessing syntax."
      metaTitle="Cron Builder — visual cron expression generator | heapkit"
      metaDescription="Build a cron expression with a visual field-by-field editor. See the generated expression, a plain-English description, and the next run times."
      explainTitle="Reading a cron expression"
      explain={
        <>
          <p>
            A cron expression has five fields — minute, hour, day-of-month, month, and
            day-of-week — each either <code>*</code> (every value), <code>*/N</code> (every N),
            a list like <code>1,15</code>, or a range like <code>1-5</code>.
          </p>
          <p>
            One common surprise: if <strong>both</strong> day-of-month and day-of-week are
            restricted (not <code>*</code>), most cron implementations run the job when{' '}
            <strong>either</strong> matches, not only when both do. This builder's "next run
            times" preview follows that same rule, so what you see here matches how cron will
            actually behave.
          </p>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <CronFieldEditor
          label="Minute"
          unit="minutes"
          min={0}
          max={59}
          placeholder="e.g. 0,30"
          state={minute}
          onChange={setMinute}
        />
        <CronFieldEditor
          label="Hour"
          unit="hours"
          min={0}
          max={23}
          placeholder="e.g. 9,17"
          state={hour}
          onChange={setHour}
        />
        <CronFieldEditor
          label="Day of month"
          unit="days"
          min={1}
          max={31}
          placeholder="e.g. 1,15"
          state={dayOfMonth}
          onChange={setDayOfMonth}
        />
        <CronFieldEditor
          label="Month"
          unit="months"
          min={1}
          max={12}
          placeholder="e.g. 3,6,9,12"
          state={month}
          onChange={setMonth}
        />
        <CronFieldEditor
          label="Day of week"
          unit="weekdays"
          min={0}
          max={6}
          placeholder="e.g. 1,3,5 (Mon,Wed,Fri)"
          state={dayOfWeek}
          onChange={setDayOfWeek}
        />
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg bg-surface-muted px-3 py-2">
        <span className="font-mono text-sm text-ink-strong">{expression}</span>
        <CopyButton text={expression} />
      </div>

      <p className="text-sm text-ink">{description}</p>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-ink-strong">Next 5 runs</span>
        {nextRuns.length === 0 ? (
          <p className="text-sm text-ink">
            No matching time found in the next 4 years — check your day-of-month/month
            combination is actually possible.
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5 font-mono text-sm text-ink">
            {nextRuns.map((date, i) => (
              <li key={i}>{date.toLocaleString()}</li>
            ))}
          </ul>
        )}
      </div>
    </ToolPage>
  )
}
