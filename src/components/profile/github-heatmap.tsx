'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface HeatmapData {
  date: string | Date
  count?: number
}

export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of dates (strings or Date objects) or objects with date and count */
  data?: (string | Date | HeatmapData)[]
  /** Year to display (defaults to current year) */
  year?: number
  /** Cell shape variant */
  shape?: 'circle' | 'square'
  /** Cell size in pixels */
  cellSize?: number
  /** Gap between cells in pixels */
  gap?: number
  /** Show month labels */
  showMonthLabels?: boolean
  /** Show day labels (M, W, F) */
  showDayLabels?: boolean
  /** Show legend */
  showLegend?: boolean
  /** Show tooltip on hover */
  showTooltip?: boolean
  /** Show year in header */
  showYear?: boolean
  /** Locale for date formatting */
  locale?: string
  /** Custom month labels (12 items) */
  monthLabels?: string[]
  /** Custom day labels (7 items, starting from Sunday) */
  dayLabels?: string[]
  /** Tooltip formatter */
  tooltipFormatter?: (date: Date, count: number) => string
  /** Callback when a cell is clicked */
  onCellClick?: (date: Date, count: number) => void
  /** Custom color getter for levels 0-4 */
  getLevelColor?: (level: number) => React.CSSProperties
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const DEFAULT_DAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

// ============================================================================
// Helpers
// ============================================================================

function generateYearData(year: number) {
  const weeks: { date: Date; dayOfWeek: number }[][] = []
  const monthPositions: { month: number; weekIndex: number }[] = []

  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)

  const firstSunday = new Date(startDate)
  firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay())

  let currentDate = new Date(firstSunday)
  let currentWeek: { date: Date; dayOfWeek: number }[] = []
  let lastTrackedMonth = -1

  while (currentDate <= endDate || currentWeek.length > 0) {
    const dayOfWeek = currentDate.getDay()

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }

    if (currentDate.getFullYear() === year) {
      const month = currentDate.getMonth()
      if (month !== lastTrackedMonth && dayOfWeek === 0) {
        monthPositions.push({ month, weekIndex: weeks.length })
        lastTrackedMonth = month
      } else if (month !== lastTrackedMonth && weeks.length === 0 && currentWeek.length === 0) {
        monthPositions.push({ month, weekIndex: 0 })
        lastTrackedMonth = month
      }
    }

    currentWeek.push({ date: new Date(currentDate), dayOfWeek })
    currentDate.setDate(currentDate.getDate() + 1)

    if (currentDate > endDate && dayOfWeek === 6) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek)
      }
      break
    }
  }

  return { weeks, monthPositions }
}

function getContributionLevel(count: number): number {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 5) return 3
  return 4
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDataToMap(data: (string | Date | HeatmapData)[]): Record<string, number> {
  const counts: Record<string, number> = {}
  
  data.forEach((item) => {
    let dateStr: string
    let count = 1
    
    if (typeof item === 'string') {
      dateStr = item.split('T')[0]
    } else if (item instanceof Date) {
      dateStr = formatDateKey(item)
    } else {
      dateStr = typeof item.date === 'string' 
        ? item.date.split('T')[0] 
        : formatDateKey(item.date)
      count = item.count ?? 1
    }
    
    counts[dateStr] = (counts[dateStr] || 0) + count
  })
  
  return counts
}

function defaultLevelStyle(level: number): React.CSSProperties {
  const styles: React.CSSProperties[] = [
    { backgroundColor: 'var(--muted)', opacity: 0.5 },
    { backgroundColor: 'oklch(from var(--primary) calc(l + 0.25) calc(c * 0.4) h)' },
    { backgroundColor: 'oklch(from var(--primary) calc(l + 0.12) calc(c * 0.7) h)' },
    { backgroundColor: 'oklch(from var(--primary) l calc(c * 0.9) h)' },
    { backgroundColor: 'var(--primary)' },
  ]
  return styles[level] || styles[0]
}

// ============================================================================
// Component
// ============================================================================

const Heatmap = React.forwardRef<HTMLDivElement, HeatmapProps>(
  (
    {
      data = [],
      year = new Date().getFullYear(),
      shape = 'circle',
      cellSize = 11,
      gap = 3,
      showMonthLabels = true,
      showDayLabels = true,
      showLegend = true,
      showTooltip = true,
      showYear = true,
      locale = 'es-ES',
      monthLabels = DEFAULT_MONTH_LABELS,
      dayLabels = DEFAULT_DAY_LABELS,
      tooltipFormatter,
      onCellClick,
      getLevelColor = defaultLevelStyle,
      className,
      ...props
    },
    ref
  ) => {
    const today = new Date()
    const [tooltip, setTooltip] = React.useState<{
      x: number
      y: number
      date: string
      count: number
    } | null>(null)

    const { weeks, monthPositions } = React.useMemo(
      () => generateYearData(year),
      [year]
    )

    const dateCounts = React.useMemo(
      () => parseDataToMap(data),
      [data]
    )

    const formatTooltip = React.useCallback(
      (dateStr: string, count: number) => {
        const date = new Date(dateStr + 'T12:00:00')
        if (tooltipFormatter) {
          return tooltipFormatter(date, count)
        }
        return `${date.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} · ${count}`
      },
      [locale, tooltipFormatter]
    )

    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-[2px]'
    const labelWidth = showDayLabels ? 24 : 0
    const cellTotalSize = cellSize + gap

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {/* Header */}
        {(showYear || showLegend) && (
          <div className="flex items-center justify-between mb-3">
            {showYear && (
              <span className="text-sm text-muted-foreground">{year}</span>
            )}
            {!showYear && <span />}
            {showLegend && (
              <div className="flex" style={{ gap: `${gap}px` }}>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn(shapeClass, level === 0 && 'border border-border/50')}
                    style={{
                      width: `${cellSize - 1}px`,
                      height: `${cellSize - 1}px`,
                      ...getLevelColor(level),
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grid container */}
        <div className="overflow-x-auto pb-1 relative">
          {/* Tooltip */}
          {showTooltip && tooltip && (
            <div
              className="absolute z-10 pointer-events-none"
              style={{
                left: tooltip.x,
                top: tooltip.y - 28,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="bg-popover/90 backdrop-blur-sm text-popover-foreground text-[10px] px-2 py-1 rounded shadow-sm border border-border/50 whitespace-nowrap">
                {formatTooltip(tooltip.date, tooltip.count)}
              </div>
            </div>
          )}

          <div className="inline-flex flex-col items-center min-w-full">
            <div className="inline-block">
              {/* Month labels */}
              {showMonthLabels && (
                <div
                  className="flex mb-1"
                  style={{ paddingLeft: `${labelWidth + 4}px` }}
                >
                  {weeks.map((_, weekIndex) => {
                    const monthPos = monthPositions.find(
                      (m) => m.weekIndex === weekIndex
                    )
                    return (
                      <div
                        key={weekIndex}
                        className="text-[10px] text-muted-foreground/70"
                        style={{ width: `${cellTotalSize}px`, minWidth: `${cellTotalSize}px` }}
                      >
                        {monthPos ? monthLabels[monthPos.month] : ''}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Grid */}
              <div className="flex">
                {/* Day labels */}
                {showDayLabels && (
                  <div
                    className="flex flex-col mr-1"
                    style={{ width: `${labelWidth}px` }}
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                      <div
                        key={dayIndex}
                        className="text-[10px] text-muted-foreground/70 text-right pr-1"
                        style={{
                          height: `${cellTotalSize}px`,
                          lineHeight: `${cellTotalSize}px`,
                        }}
                      >
                        {dayIndex % 2 === 1 ? dayLabels[dayIndex] : ''}
                      </div>
                    ))}
                  </div>
                )}

                {/* Weeks grid */}
                <div className="flex" style={{ gap: `${gap}px` }}>
                  {weeks.map((week, weekIndex) => (
                    <div
                      key={weekIndex}
                      className="flex flex-col"
                      style={{ gap: `${gap}px` }}
                    >
                      {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                        const dayData = week.find((d) => d.dayOfWeek === dayIndex)

                        if (!dayData) {
                          return (
                            <div
                              key={dayIndex}
                              className={shapeClass}
                              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                            />
                          )
                        }

                        const { date } = dayData
                        const dateStr = formatDateKey(date)
                        const count = dateCounts[dateStr] || 0
                        const level = getContributionLevel(count)
                        const isFuture = date > today
                        const isCurrentYear = date.getFullYear() === year
                        const isValid = !isFuture && isCurrentYear

                        return (
                          <div
                            key={dayIndex}
                            className={cn(
                              shapeClass,
                              'transition-all',
                              isValid && level === 0 && 'border border-border/50',
                              isValid && 'hover:ring-2 hover:ring-primary/50 cursor-pointer'
                            )}
                            style={{
                              width: `${cellSize}px`,
                              height: `${cellSize}px`,
                              ...(isValid ? getLevelColor(level) : {}),
                            }}
                            onClick={() => {
                              if (isValid && onCellClick) {
                                onCellClick(date, count)
                              }
                            }}
                            onMouseEnter={(e) => {
                              if (isValid && showTooltip) {
                                const rect = e.currentTarget.getBoundingClientRect()
                                const parentRect = e.currentTarget
                                  .closest('.overflow-x-auto')
                                  ?.getBoundingClientRect()
                                setTooltip({
                                  x: rect.left - (parentRect?.left || 0) + rect.width / 2,
                                  y: rect.top - (parentRect?.top || 0),
                                  date: dateStr,
                                  count,
                                })
                              }
                            }}
                            onMouseLeave={() => setTooltip(null)}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
Heatmap.displayName = 'Heatmap'

// Legacy export for backwards compatibility
export function GitHubHeatmap({ submissionDates = [] }: { submissionDates?: string[] }) {
  return <Heatmap data={submissionDates} />
}

export { Heatmap }
