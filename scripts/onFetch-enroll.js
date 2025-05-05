vars["data"] = initArrayProperty(vars["data"], "enroll");

/* Set to false for production */
var debugMode = true;

// Create JSON string dynamically using the new function
var jsonString = createJsonFromRow(row, row.columnDefns);

vars["data"].enroll.push(jsonString);
