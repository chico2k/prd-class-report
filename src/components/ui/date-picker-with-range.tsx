"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date: externalDate,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    undefined
  );
  const [open, setOpen] = React.useState(false);
  const date = externalDate ?? internalDate;
  const setDate = (newDate: DateRange | undefined) => {
    if (onDateChange) {
      onDateChange(newDate);
    } else {
      setInternalDate(newDate);
    }
    // Close the popover if both from and to dates are selected
    if (newDate?.from && newDate?.to) {
      setOpen(false);
    }
  };

  // State for current view
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  // Generate years (10 years back, 10 years forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

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
  ];

  // Handle month change
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  // Custom navigation header for the calendar
  const CustomCaption = ({ displayMonth }: { displayMonth: Date }) => {
    const isFirstMonth =
      displayMonth.getMonth() === currentMonth.getMonth() &&
      displayMonth.getFullYear() === currentMonth.getFullYear();

    // Handle month selection
    const handleMonthSelect = (value: string) => {
      const newMonth = new Date(displayMonth);
      newMonth.setMonth(Number.parseInt(value));
      if (isFirstMonth) {
        setCurrentMonth(newMonth);
      }
    };

    // Handle year selection
    const handleYearSelect = (value: string) => {
      const newMonth = new Date(displayMonth);
      newMonth.setFullYear(Number.parseInt(value));
      if (isFirstMonth) {
        setCurrentMonth(newMonth);
      }
    };

    return (
      <div className="flex justify-center gap-1 items-center px-1">
        <Select
          value={displayMonth.getMonth().toString()}
          onValueChange={handleMonthSelect}
        >
          <SelectTrigger className="h-5 w-[100px] text-xs">
            <SelectValue placeholder={months[displayMonth.getMonth()]} />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {months.map((month, index) => (
              <SelectItem
                key={index}
                value={index.toString()}
                className="text-xs h-6"
              >
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={displayMonth.getFullYear().toString()}
          onValueChange={handleYearSelect}
        >
          <SelectTrigger className="h-5 w-[80px] text-xs">
            <SelectValue placeholder={displayMonth.getFullYear()} />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {years.map((year) => (
              <SelectItem
                key={year}
                value={year.toString()}
                className="text-xs h-6"
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal text-xs h-7",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-3 w-3" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
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
            defaultMonth={new Date()}
            month={currentMonth}
            onMonthChange={handleMonthChange}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            className="text-xs"
            classNames={{
              day: "h-6 w-6 text-xs",
              head_cell: "text-xs w-6 text-center px-0",
              cell: "text-xs p-0 text-center",
              button: "text-xs",
              nav_button: "h-5 w-5 text-xs",
              caption: "text-xs",
              caption_label: "text-xs",
              dropdown: "text-xs",
              dropdown_icon: "text-xs",
              dropdown_month: "text-xs",
              dropdown_year: "text-xs",
              row: "flex w-full mt-2",
              head: "flex w-full",
              head_row: "flex w-full",
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              table: "w-full border-collapse space-y-1",
            }}
            components={{
              Caption: CustomCaption,
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
