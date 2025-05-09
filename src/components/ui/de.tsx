"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  // State for current view
  const [currentMonth, setCurrentMonth] = React.useState<Date>(date?.from || new Date())

  // Generate years (10 years back, 10 years forward)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  // Month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Handle month change
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month)
  }

  // Custom navigation header for the calendar
  const CustomCaption = ({ displayMonth }: { displayMonth: Date }) => {
    // Handle month selection
    const handleMonthSelect = (value: string) => {
      const newMonth = new Date(displayMonth)
      newMonth.setMonth(Number.parseInt(value))
      setCurrentMonth(newMonth)
    }

    // Handle year selection
    const handleYearSelect = (value: string) => {
      const newMonth = new Date(displayMonth)
      newMonth.setFullYear(Number.parseInt(value))
      setCurrentMonth(newMonth)
    }

    return (
      <div className="flex justify-center gap-1 items-center px-1">
        <Select value={displayMonth.getMonth().toString()} onValueChange={handleMonthSelect}>
          <SelectTrigger className="h-7 w-[110px]">
            <SelectValue placeholder={months[displayMonth.getMonth()]} />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={displayMonth.getFullYear().toString()} onValueChange={handleYearSelect}>
          <SelectTrigger className="h-7 w-[80px]">
            <SelectValue placeholder={displayMonth.getFullYear()} />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            month={currentMonth}
            onMonthChange={handleMonthChange}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            components={{
              Caption: CustomCaption,
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
