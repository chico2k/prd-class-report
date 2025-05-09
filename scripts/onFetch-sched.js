vars["data"] = initArrayProperty(vars["data"], "sched");

var jsonString = createJsonFromRow(row, row.columnDefns);

vars["data"].sched.push(jsonString);
