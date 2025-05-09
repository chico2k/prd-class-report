import { ColumnDefinitions, CustomColumns } from "../../types/indes";

export const getFieldValue = (
  value: string,
  colDef: ColumnDefinitions,
  customColumns: CustomColumns
) => {
  if (colDef.columnType === "standard") {
    return value;
  }

  if (
    colDef.columnType === "customColumnSched" &&
    colDef.id.endsWith("_DESC")
  ) {
    const id = colDef.customColumnNumber;

    if (!id) return value;

    return customColumns.sched?.[id]?.values[value] || value;
  }

  if (colDef.columnType === "customColumnUser" && colDef.id.endsWith("_DESC")) {
    const id = colDef.customColumnNumber;

    if (!id) return value;
    return customColumns.user?.[id]?.values[value] || value;
  }

  if (colDef.columnType === "customColumnCpnt" && colDef.id.endsWith("_DESC")) {
    const id = colDef.customColumnNumber;

    if (!id) return value;
    return customColumns.cpnt?.[id]?.values[value] || value;
  }
  return value;
};
