import { ColumnDefinitions } from "../../types/indes";

export const readColumnDefinitionsToLocalStorage = (
  colDef: ColumnDefinitions[]
) => {
  const storage = localStorage.getItem("reportPreferences");

  const updatedColDef = colDef;

  if (!storage) return colDef;
  const parsedStorage = JSON.parse(storage);
  const reportSched = parsedStorage["report-sched"];
  const columnDefinitionsFromStorage =
    reportSched.columnDefinitions as ColumnDefinitions[];

  if (!reportSched) {
    return colDef;
  }

  // loop over the array of reportSched and check if you find based on the key the object in the colDef if yes relace it with fro  reportsched
  columnDefinitionsFromStorage.forEach((colFromStorage) => {
    const index = colDef.findIndex((c) => c.id === colFromStorage.id);
    if (index !== -1) {
      updatedColDef[index] = colFromStorage;
    }
  });

  return updatedColDef;
};
