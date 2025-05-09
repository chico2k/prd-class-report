import { headerLabels } from "../../mockData/labels";
import { Data, Preferences } from "../../types/indes";
import { useStore } from "../index";

const initialVisibility = {
  SCHD_ID: true,
  CPNT_ID: true,
};

const dateFields = ["CLASS_START_DATE", "CLASS_END_DATE"];

export const createColumnDefinition = (data: Data | null) => {
  if (!data) return [];

  const ids = Object.keys(data.sched[0]);

  const columns = [];
  for (const [, id] of ids.entries()) {
    console.log("dateFields.includes(id)", dateFields.includes(id));

    if (id.startsWith("INTERNAL_")) {
      continue;
    }

    const orderNumber = 0;

    let visible = false;
    if (initialVisibility[id as keyof typeof initialVisibility]) {
      visible = true;
    }

    if (id.startsWith("CC_SCHED_")) {
      // If no custom fields for sched available
      if (!data.customColumns.sched) continue;

      const number = id.split("_")[2];
      const exists = data.customColumns.sched[number];
      if (!exists) continue;
      if (id.endsWith("_DESC") && !exists.referenced) continue;

      columns.push({
        id,
        label: exists.label ?? id,
        referenced: exists.referenced,
        columnType: "customColumnSched" as const,
        customColumnNumber: parseInt(number),
        visible,
        orderNumber,
        dateField: dateFields.includes(id) ? true : false,
      });
      continue;
    }

    if (id.startsWith("CC_USER_")) {
      // If no custom fields for user available
      if (!data.customColumns.user) continue;

      const number = id.split("_")[2];
      const exists = data.customColumns.user[number];
      if (!exists) continue;

      columns.push({
        id,
        label: exists.label ?? id,
        referenced: exists.referenced,
        columnType: "customColumnUser" as const,
        customColumnNumber: parseInt(number),
        visible,
        orderNumber,
        dateField: dateFields.includes(id) ? true : false,
      });
      continue;
    }

    if (id.startsWith("CC_CPNT_")) {
      // If no custom fields for cpnnt available
      if (!data.customColumns.cpnt) continue;

      const number = id.split("_")[2];
      const exists = data.customColumns.cpnt[number];
      if (!exists) continue;

      columns.push({
        id,
        label: exists.label ?? id,
        referenced: exists.referenced,
        columnType: "customColumnCpnt" as const,
        customColumnNumber: parseInt(number),
        visible,
        orderNumber,
        dateField: dateFields.includes(id) ? true : false,
      });
      continue;
    }

    columns.push({
      id,
      label: headerLabels[id as keyof typeof headerLabels] ?? id,
      referenced: false,
      columnType: "standard" as const,
      visible,
      orderNumber,
      dateField: dateFields.includes(id) ? true : false,
    });
  }

  console.log("columns", columns);
  return columns;
};
