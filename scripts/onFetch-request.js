vars["data"] = initArrayProperty(vars["data"], "request");

var jsonString = {
  STUD_ID: row["STUD_ID"],
  FNAME: row["FNAME"],
  LNAME: row["LNAME"],
  EMAIL_ADDR: row["EMAIL_ADDR"],
  CPNT_ID: row["CPNT_ID"],
  CPNT_TYP_ID: row["CPNT_TYP_ID"],
  REV_DTE: row["REV_DTE"],
  ITEM_KEY: row["ITEM_KEY"],
};

vars["data"].request.push(jsonString);
