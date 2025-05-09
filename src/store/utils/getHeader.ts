import { ColumnDefinitions } from "../../types/indes";

export const getHeader = (
  label: string,
  colDef: ColumnDefinitions,
  getSFlabel: (id: string) => string
) => {
  const allCustomColumns = [
    "customColumnSched",
    "customColumnUser",
    "customColumnCpnt",
  ];

  if (
    allCustomColumns.includes(colDef.columnType) &&
    colDef.id.endsWith("_DESC")
  ) {
    return colDef.label + " Description";
  }

  if (
    allCustomColumns.includes(colDef.columnType) &&
    !colDef.id.endsWith("_DESC")
  ) {
    return colDef.label + " ID";
  }

  return getSFlabel(label);
};
