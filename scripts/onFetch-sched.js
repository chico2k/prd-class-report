vars["data"] = initArrayProperty(vars["data"], "sched");

var jsonString = {
  SCHD_ID: row["SCHD_ID"],
  CLASS_START_DATE: row["CLASS_START_DATE"],
  CLASS_END_DATE: row["CLASS_END_DATE"],
  CPNT_TITLE: getLabel(row["CPNT_TITLE"], row["CPNT_ID"]),
  CPNT_DESC: getLabel(row["CPNT_DESC"], "DESC"),
  CPNT_ID: row["CPNT_ID"],
  CPNT_TYP_ID: row["CPNT_TYP_ID"],
  REV_DTE: row["REV_DTE"],
  CPNT_TYP_DESC: getLabel(row["CPNT_TYP_DESC"], row["CPNT_TYP_ID"]),
  ITEM_KEY: row["ITEM_KEY"],
};

vars["data"].sched.push(jsonString);
