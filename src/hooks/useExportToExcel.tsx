import { Table } from "@tanstack/react-table";
import { useState, useCallback } from "react";

function useExportToExcel<T>(table: Table<T>) {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById("xlsx-cdn-script")) {
        setIsLoaded(true);
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.id = "xlsx-cdn-script";
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      script.integrity =
        "sha512-r22gChDnGvBylk90+2e/ycr3RVrDi8DIOkIGNhJlKfuyQM4tIRAI062MaV8sfjQKYVGjOBaZBOA87z+IhZE9DA==";
      script.crossOrigin = "anonymous";
      script.referrerPolicy = "no-referrer";
      script.onload = () => {
        setIsLoaded(true);
        resolve();
      };
      script.onerror = () => {
        console.error("Failed to load XLSX script");
        reject(new Error("Failed to load XLSX script"));
      };

      document.body.appendChild(script);
    });
  }, []);

  const exportToExcel = useCallback(
    async (
      fileName: string = `Report-${new Date().toLocaleDateString()}.xlsx`
    ) => {
      // Lazy load the script
      if (!isLoaded) {
        try {
          await loadScript();
        } catch (error) {
          console.error("Failed to load the XLSX library:", error);
          return;
        }
      }

      if (typeof XLSX === "undefined") {
        console.error("XLSX is not defined after loading the script.");
        return;
      }

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Get visible columns
      const visibleColumns = table
        .getAllColumns()
        .filter((col) => col.getIsVisible());

      // Prepare headers for the worksheet
      const headers = visibleColumns.map((col) => {
        const header = col.columnDef.header;
        return typeof header === "string" ? header : col.id;
      });

      // Get filtered rows instead of all rows
      const filteredRows = table.getFilteredRowModel().rows;

      // Prepare data rows for filtered rows
      const rows = filteredRows.map((row) => {
        const rowData: Record<string, any> = {};
        visibleColumns.forEach((col) => {
          const header = col.columnDef.header;
          const headerKey = typeof header === "string" ? header : col.id;
          rowData[headerKey] = row.getValue(col.id);
        });
        return rowData;
      });

      // Create a worksheet from headers and rows
      const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });

      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

      // Write the workbook and trigger a download
      XLSX.writeFile(workbook, fileName);
    },
    [isLoaded, loadScript, table]
  );

  return { exportToExcel };
}

export default useExportToExcel;
