import * as XLSXType from "xlsx";

export interface Enroll {
  SCHD_ID: number;
  ENRL_STAT_ID: string;
  STUD_ID: string;
  ENRL_STAT_DESC: string;
  FNAME: string | null;
  LNAME: string;
  EMAIL_ADDR: string | null;
}

export interface Request {
  STUD_ID: string | null;
  FNAME: string | null;
  LNAME: string | null;
  EMAIL_ADDR: string | null;
  CPNT_ID: string;
  CPNT_TYP_ID: string;
  REV_DTE: string;
  ITEM_KEY: string;
}
export interface Sched {
  SCHD_ID: number;
  SCHD_DESC?: string;
  CLASS_START_DATE: string;
  CLASS_END_DATE: string;
  CPNT_TITLE: string;
  CPNT_DESC: string;
  CPNT_ID: string;
  CPNT_TYP_ID: string;
  CPNT_TYP_DESC: string;
  REV_DTE: string;
  INTERNAL_ITEM_KEY: string;
}

export interface CustomColumnsEntry {
  label: string;
  referenced: boolean;
  values: {
    [id: string]: string;
  };
}

export interface CustomColumns {
  sched?: {
    [id: string]: CustomColumnsEntry;
  };
  user?: {
    [id: string]: CustomColumnsEntry;
  };
  cpnt?: {
    [id: string]: CustomColumnsEntry;
  };
}

export interface Data {
  enroll: Enroll[];
  sched: Sched[];
  request: Request[];
  customColumns: CustomColumns;
}

export interface GroupedUsers {
  [key: string]: Enroll[];
}

export interface Preferences {
  localeId: string;
  timeZone: string;
  displayScheduleInUserTimeZone: string;
  percentPattern: {
    decimalSeperator: string;
    groupingSperator: string;
    percentageSymbol: string;
  };
  datePattern: string;
  timePattern: string;
  longPattern: {
    decimalSeperator: string;
    groupingSperator: string;
  };
  currencyPattern: {
    decimalSeperator: string;
    groupingSperator: string;
    currencySymbol: string;
  };
  doublePattern: {
    decimalSeperator: string;
    groupingSperator: string;
  };
}

export interface Labels {
  [key: string]: string;
}

// Add type for globalThis.data
declare global {
  interface Window {
    data?: {
      enroll: Enroll[];
      sched: Sched[];
      request: Request[];
      customColumns: CustomColumns;
    };
    labels?: Labels;
    preferences?: Preferences;
    environment: "preview" | "production";
    debug: boolean;
  }
  const XLSX: typeof XLSXType;
}

export type ColumnDefinitions = {
  id: string;
  label: string;
  referenced: boolean;
  columnType:
    | "customColumnSched"
    | "customColumnUser"
    | "customColumnCpnt"
    | "standard";
  customColumnNumber?: number;
  visible: boolean;
  orderNumber: number;
  sorting?: "asc" | "desc" | null;
  dateField: boolean;
};
