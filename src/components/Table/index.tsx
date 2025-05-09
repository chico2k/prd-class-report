"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripHorizontalIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
  Filter,
} from "lucide-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  FilterFn,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStore } from "@/store";
import useExportToExcel from "@/hooks/useExportToExcel";
import { useSidebar } from "../ui/sidebar";
import { getDateTime } from "@/store/utils/getDateTime";

// Multi-select filter function from the original table
const multiSelectFilter: FilterFn<any> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue || filterValue.length === 0) return true;
  const rowValue = String(row.getValue(columnId)).trim();
  return filterValue.some((filterVal) => rowValue === String(filterVal).trim());
};

// Draggable column header component
function DraggableColumnHeader({
  column,
  onRemove,
  isLastColumn,
  context,
}: {
  column: any;
  onRemove: (id: string) => void;
  isLastColumn: boolean;
  context: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
    position: "relative" as const,
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLastColumn) {
      onRemove(column.id);
    }
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className="relative border-r group"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2 cursor-grab">
        <GripHorizontalIcon className="h-4 w-4 text-muted-foreground" />
        {flexRender(column.column.columnDef.header, context)}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`ml-1 h-6 w-6 p-0 transition-opacity ${
                  isLastColumn
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-0 group-hover:opacity-100"
                }`}
                onClick={handleRemove}
                disabled={isLastColumn}
              >
                <XIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                <span className="sr-only">Remove</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isLastColumn ? "Cannot remove the last column" : "Remove column"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </TableHead>
  );
}

export function FinalTable() {
  const {
    data,
    columnDefinitions,
    getSFlabel,
    getFieldValue,
    getHeader,
    columnFilters,
    setColumnDefinitions,
  } = useStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownColumns, setDropdownColumns] = React.useState<
    typeof columnDefinitions
  >([]);
  const columnHelper = createColumnHelper<any>();

  // Update dropdown columns when dropdown opens or columnDefinitions change
  React.useEffect(() => {
    if (dropdownOpen) {
      setDropdownColumns(columnDefinitions);
    }
  }, [dropdownOpen, columnDefinitions]);

  const { preferences } = useStore();

  // TanStack Table state
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });

  // Get visible and non-visible columns
  const visibleColumns = React.useMemo(() => {
    return columnDefinitions
      .filter((col) => col.visible)
      .sort((a, b) => a.orderNumber - b.orderNumber);
  }, [columnDefinitions]);

  // DnD sensors setup
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {})
  );

  // Column management functions
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = visibleColumns.findIndex((col) => col.id === active.id);
      const newIndex = visibleColumns.findIndex((col) => col.id === over.id);

      const reorderedVisibleColumns = arrayMove(
        visibleColumns,
        oldIndex,
        newIndex
      );
      const updatedVisibleColumns = reorderedVisibleColumns.map(
        (col, index) => ({
          ...col,
          orderNumber: index + 1,
        })
      );

      const newColumnDefinitions = [
        ...updatedVisibleColumns,
        ...columnDefinitions.filter((col) => !col.visible),
      ];

      setColumnDefinitions(newColumnDefinitions); // update store only
    }
  };

  const addColumn = (columnId: string) => {
    const newColumnDefinitions = columnDefinitions.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          visible: true,
          orderNumber: visibleColumns.length + 1,
        };
      }
      return col;
    });
    setColumnDefinitions(newColumnDefinitions); // update store only
  };

  const removeColumn = (columnId: string) => {
    if (visibleColumns.length <= 1) return;

    const columnToRemove = columnDefinitions.find((col) => col.id === columnId);
    if (!columnToRemove) return;

    const orderNumberToRemove = columnToRemove.orderNumber;
    const newColumnDefinitions = columnDefinitions.map((col) => {
      if (col.id === columnId) {
        return { ...col, visible: false, orderNumber: 0 };
      } else if (col.visible && col.orderNumber > orderNumberToRemove) {
        return { ...col, orderNumber: col.orderNumber - 1 };
      }
      return col;
    });

    setColumnDefinitions(newColumnDefinitions); // update store only
  };

  // TanStack Table setup
  const columns = React.useMemo(() => {
    if (!data?.sched || data.sched.length === 0) return [];

    return columnDefinitions.map((column) =>
      columnHelper.accessor(column.id, {
        cell: (info) => {
          const value = info.getValue();
          if (column.dateField) {
            console.log("here?");
            return getDateTime(value, preferences);
          }
          if (column.referenced) {
            return getFieldValue(value, column, data?.customColumns);
          }
          return value;
        },
        header: getHeader(column.label, column, getSFlabel),
        filterFn: multiSelectFilter,
        size: 200, // Default max size
        minSize: 100, // Minimum size
        maxSize: 400, // Maximum size
      })
    );
  }, [
    data,
    columnDefinitions,
    columnHelper,
    getFieldValue,
    getHeader,
    getSFlabel,
    preferences,
  ]);

  const columnOrder = React.useMemo(
    () => visibleColumns.map((col) => col.id),
    [visibleColumns]
  );

  const columnVisibility = React.useMemo(
    () =>
      columnDefinitions.reduce(
        (acc, col) => ({
          ...acc,
          [col.id]: col.visible,
        }),
        {}
      ),
    [columnDefinitions]
  );

  const sorting = React.useMemo(
    () =>
      columnDefinitions
        .filter((col) => col.sorting)
        .map((column) => ({
          id: column.id,
          desc: column.sorting === "desc",
        })),
    [columnDefinitions]
  );

  const columnFiltersState = React.useMemo(
    () =>
      Object.entries(columnFilters)
        .filter(([_, values]) => values.length > 0)
        .map(([id, values]) => ({
          id,
          value: values,
        })),
    [columnFilters]
  );

  const table = useReactTable({
    data: data?.sched || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: true,
    state: {
      columnVisibility,
      columnOrder,
      sorting,
      pagination,
      columnFilters: columnFiltersState,
    },
    onPaginationChange: setPagination,
    filterFns: {
      multiSelect: multiSelectFilter,
    },
    enableColumnFilters: true,
    enableFilters: true,
    filterFromLeafRows: true,
  });

  const { exportToExcel } = useExportToExcel(table);
  const sidebar = useSidebar();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-6">
            <Button variant="outline" onClick={() => sidebar.toggleSidebar()}>
              <Filter /> Filter
            </Button>

            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Field Chooser
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[400px]">
                <div className="flex items-center border-b px-3 py-2">
                  <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <Input
                    placeholder="Search fields..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 border-0 p-0 focus-visible:ring-0"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      onClick={() => setSearchQuery("")}
                      className="h-auto p-0 px-1.5"
                    >
                      <XIcon className="h-4 w-4" />
                      <span className="sr-only">Clear</span>
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 px-3 py-2 border-b">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      const newColumns = dropdownColumns.map((col) => ({
                        ...col,
                        visible: true,
                      }));
                      setDropdownColumns(newColumns);
                      setColumnDefinitions(newColumns);
                    }}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      const newColumns = dropdownColumns.map((col) => ({
                        ...col,
                        visible: false,
                      }));
                      setDropdownColumns(newColumns);
                      setColumnDefinitions(newColumns);
                    }}
                  >
                    Deselect All
                  </Button>
                </div>
                <div className="max-h-[400px] overflow-y-auto py-1">
                  {(() => {
                    // Use dropdownColumns instead of columnDefinitions while dropdown is open
                    const columns = dropdownOpen
                      ? dropdownColumns
                      : columnDefinitions;

                    // Filter based on search
                    const filteredColumns = columns.filter((col) =>
                      searchQuery
                        ? col.label
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          col.id
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        : true
                    );

                    return (
                      <div className="px-2 py-1.5">
                        {filteredColumns.map((column) => (
                          <DropdownMenuItem
                            key={column.id}
                            className="flex items-center gap-2 cursor-pointer hover:bg-accent"
                            onClick={(e) => {
                              e.preventDefault();
                              if (column.visible) {
                                removeColumn(column.id);
                              } else {
                                addColumn(column.id);
                              }
                              // Update the dropdown view immediately
                              setDropdownColumns((prev) =>
                                prev.map((col) =>
                                  col.id === column.id
                                    ? { ...col, visible: !col.visible }
                                    : col
                                )
                              );
                            }}
                          >
                            <div
                              className={`h-4 w-4 shrink-0 rounded border ${
                                column.visible
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                              }`}
                            />
                            <span className="truncate">
                              {getHeader(column.label, column, getSFlabel)}
                            </span>
                          </DropdownMenuItem>
                        ))}
                        {filteredColumns.length === 0 && (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No fields found
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => exportToExcel()}
              className="shadow-lg"
              size="default"
            >
              Export to Excel
            </Button>
          </div>
        </header>
      </div>

      <div className="w-full rounded-md border ">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableContext
                    items={visibleColumns.map((col) => col.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {table
                      .getHeaderGroups()
                      .map((headerGroup) =>
                        headerGroup.headers.map((header) => (
                          <DraggableColumnHeader
                            key={header.id}
                            column={header}
                            onRemove={removeColumn}
                            isLastColumn={visibleColumns.length <= 1}
                            context={header.getContext()}
                          />
                        ))
                      )}
                  </SortableContext>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="pl-8 text-left max-w-[400px] truncate"
                        style={{
                          maxWidth: cell.column.getSize(),
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DndContext>
        <div className="flex items-center justify-end space-x-2 py-4 px-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FinalTable;
