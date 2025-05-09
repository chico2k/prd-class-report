import { SidebarSeparator } from "../ui/sidebar";
import React from "react";
import { SidebarMenuItem } from "../ui/sidebar";
import { SidebarMenuButton } from "../ui/sidebar";
import { SidebarInput, SidebarMenu } from "../ui/sidebar";
import { SidebarGroupContent } from "../ui/sidebar";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { useStore } from "@/store";
import { useState } from "react";
import { CollapsibleTrigger } from "../ui/collapsible";
import { ChevronRight, Search, Calendar as CalendarIcon } from "lucide-react";
import { SidebarGroup, SidebarGroupLabel } from "../ui/sidebar";
import { Collapsible } from "@radix-ui/react-collapsible";
import { Label } from "@radix-ui/react-label";
import { produce } from "immer";
import { Checkbox } from "../ui/checkbox";
import { getDateTime } from "@/store/utils/getDateTime";
import { ColumnDefinitions } from "@/types/indes";
import { DatePickerWithRange } from "../ui/date-picker-with-range";
import { DateRange } from "react-day-picker";

type DateRanges = {
  [key: string]: DateRange | undefined;
};

type ColumnFilters = {
  [key: string]: string[];
};

export function FilterGroups() {
  const {
    columnDefinitions,
    data,
    getSFlabel,
    getHeader,
    getFieldValue,
    columnFilters,
    setColumnFilters,
    preferences,
  } = useStore();

  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>(
    {}
  );
  const [dateRanges, setDateRanges] = useState<DateRanges>({});
  const visibleColumns = columnDefinitions.filter((col) => col.visible);

  const getUniqueValues = (column: ColumnDefinitions) => {
    if (!data?.sched) return [];
    const values = new Set<string>();

    data.sched.forEach((row) => {
      const rawValue = row[column.id as keyof typeof row];
      if (rawValue === undefined || rawValue === null) return;

      if (column.dateField) {
        const value = getDateTime(String(rawValue), preferences);
        values.add(value);
      }

      const value =
        column.referenced && data?.customColumns
          ? getFieldValue(String(rawValue), column, data.customColumns)
          : String(rawValue);
      if (value) {
        values.add(value);
      }
    });
    return Array.from(values).sort();
  };

  const getDateRange = (column: ColumnDefinitions) => {
    if (!data?.sched || !column.dateField)
      return { fromDate: undefined, toDate: undefined };

    const dates = data.sched
      .map((row) => {
        const rawValue = row[column.id as keyof typeof row];
        if (!rawValue) return null;
        return new Date(String(rawValue));
      })
      .filter((date): date is Date => date !== null);

    if (dates.length === 0) return { fromDate: undefined, toDate: undefined };

    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    return {
      fromDate: minDate,
      toDate: maxDate,
    };
  };

  const handleFilterChange = (
    columnKey: string,
    value: string,
    checked: boolean
  ) => {
    const newFilters: ColumnFilters = { ...columnFilters };
    const currentFilters = newFilters[columnKey] || [];

    if (checked) {
      newFilters[columnKey] = [...currentFilters, value];
    } else {
      newFilters[columnKey] = currentFilters.filter((v) => v !== value);
    }

    setColumnFilters(newFilters);
  };

  const handleDateRangeChange = (
    columnId: string,
    range: DateRange | undefined
  ) => {
    setDateRanges((prev) => ({
      ...prev,
      [columnId]: range,
    }));

    if (!data?.sched || !range) return;

    const filteredValues = data.sched
      .map((row) => {
        const rawValue = row[columnId as keyof typeof row];
        if (!rawValue) return null;
        return getDateTime(String(rawValue), preferences);
      })
      .filter((date): date is string => {
        if (!date) return false;
        if (range.from && date < range.from.toISOString()) return false;
        if (range.to && date > range.to.toISOString()) return false;
        return true;
      });

    const newFilters: ColumnFilters = {
      ...columnFilters,
      [columnId]: filteredValues,
    };
    setColumnFilters(newFilters);
  };

  const getFilteredOptions = (column: ColumnDefinitions) => {
    if (column.dateField) {
      const values = getUniqueValues(column);
      const range = dateRanges[column.id];
      if (!range) return values;

      return values.filter((value) => {
        if (range.from && value < range.from.toISOString()) return false;
        if (range.to && value > range.to.toISOString()) return false;
        return true;
      });
    }

    const values = getUniqueValues(column);
    const searchQuery = searchQueries[column.id]?.toLowerCase() || "";
    return values.filter((value) => value.toLowerCase().includes(searchQuery));
  };

  return (
    <>
      <div className="flex items-center mb-2 ml-auto mr-4 mt-8 justify-end min-h-[18px]">
        {visibleColumns.some((column) => {
          if (column.dateField) {
            const range = dateRanges[column.id];
            return !!(range && (range.from || range.to));
          } else {
            return !!(
              columnFilters[column.id] && columnFilters[column.id].length > 0
            );
          }
        }) ? (
          <span
            className="text-[10px] font-light text-primary cursor-pointer hover:text-primary-600 hover:underline transition-colors"
            onClick={() => {
              setDateRanges({});
              setColumnFilters({});
            }}
          >
            Clear all
          </span>
        ) : null}
      </div>
      {visibleColumns.map((column, index) => {
        // Determine if this column has active filters
        let hasActiveFilter = false;
        if (column.dateField) {
          const range = dateRanges[column.id];
          hasActiveFilter = !!(range && (range.from || range.to));
        } else {
          hasActiveFilter = !!(
            columnFilters[column.id] && columnFilters[column.id].length > 0
          );
        }
        return (
          <React.Fragment key={column.id}>
            <SidebarGroup key={column.id} className="py-0 text-xs">
              <Collapsible
                defaultOpen={index === 0}
                className="group/collapsible"
              >
                <SidebarGroupLabel
                  asChild
                  className="group/label w-full text-xs text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger>
                    <span className="flex w-full items-center">
                      <span
                        className="truncate flex-1 whitespace-nowrap overflow-hidden text-ellipsis text-left"
                        title={getHeader(column.label, column, getSFlabel)}
                      >
                        {getHeader(column.label, column, getSFlabel)}
                      </span>
                      {hasActiveFilter &&
                        (column.dateField ? (
                          <span className="ml-2 flex-shrink-0 flex items-center justify-center bg-primary/20 w-5 h-5 rounded border border-primary">
                            <CalendarIcon className="w-3 h-3 text-primary" />
                          </span>
                        ) : (
                          <span className="ml-2 flex-shrink-0 flex items-center justify-center bg-primary/20 text-primary w-5 h-5 text-[11px] font-semibold rounded border border-primary">
                            {columnFilters[column.id]?.length || 0}
                          </span>
                        ))}
                      <span className="flex-shrink-0 w-4 flex items-center justify-center">
                        <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </span>
                    </span>
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {column.dateField ? (
                        <SidebarGroup className="py-2 mt-3 mb-3">
                          <SidebarGroupContent>
                            <DatePickerWithRange
                              className="w-full"
                              date={dateRanges[column.id]}
                              onDateChange={(range) =>
                                handleDateRangeChange(column.id, range)
                              }
                              {...getDateRange(column)}
                            />
                          </SidebarGroupContent>
                        </SidebarGroup>
                      ) : (
                        <>
                          {getFilteredOptions(column).length > 5 && (
                            <SidebarGroup className="py-2 sticky top-0 bg-sidebar">
                              <SidebarGroupContent className="relative">
                                <Label
                                  htmlFor={`search-${column.id}`}
                                  className="sr-only"
                                >
                                  Search
                                </Label>
                                <SidebarInput
                                  id={`search-${column.id}`}
                                  placeholder="Search"
                                  className="pl-8 text-xs"
                                  value={searchQueries[column.id] || ""}
                                  onChange={(e) =>
                                    setSearchQueries((prev) =>
                                      produce(prev, (draft) => {
                                        draft[column.id] = e.target.value;
                                      })
                                    )
                                  }
                                />
                                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                              </SidebarGroupContent>
                            </SidebarGroup>
                          )}
                          <div className="max-h-48 overflow-y-auto">
                            {getFilteredOptions(column).map((item) => (
                              <SidebarMenuItem key={item}>
                                <SidebarMenuButton asChild>
                                  <label className="flex items-center gap-2 cursor-pointer w-full">
                                    <div
                                      data-active={columnFilters[
                                        column.id
                                      ]?.includes(item)}
                                      className="group/filter-item flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary"
                                    >
                                      <Checkbox
                                        checked={columnFilters[
                                          column.id
                                        ]?.includes(item)}
                                        onCheckedChange={(checked) =>
                                          handleFilterChange(
                                            column.id,
                                            item,
                                            !!checked
                                          )
                                        }
                                      />
                                    </div>
                                    <span className="text-xs">{item}</span>
                                  </label>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </div>
                        </>
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
            <SidebarSeparator className="mx-0" />
          </React.Fragment>
        );
      })}
    </>
  );
}
