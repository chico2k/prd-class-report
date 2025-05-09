function handleCustomColByType(row, colType) {
  // Initialize data structure if needed
  if (!vars["data"]) {
    vars["data"] = {};
  }

  // Initialize customColumns as an object, not an array
  if (!vars["data"].customColumns) {
    vars["data"].customColumns = {};
  }

  // Get column info
  var colNum = row["COL_NUM"];
  var label = row["LABEL"];
  var referenced = row["REFERENCED"] === "Y"; // Convert to boolean
  var userId = row["USER_ID"];
  var userDesc = row["USER_DESC"];

  // Convert colType to lowercase for consistency
  var type = colType.toLowerCase();

  // Make sure the type object exists
  if (!vars["data"].customColumns[type]) {
    vars["data"].customColumns[type] = {};
  }

  // Make sure the column number object exists
  if (!vars["data"].customColumns[type][colNum]) {
    vars["data"].customColumns[type][colNum] = {
      referenced: referenced,
      values: {},
      // Use the getLabel function to process labels with proper fallback
      label: getLabel(label, String(label)),
    };
  }

  // Get the column object
  var colObj = vars["data"].customColumns[type][colNum];

  // Update the referenced value (if any row has it referenced, set it to true)
  colObj.referenced = colObj.referenced || referenced;

  // Add the user ID and description to values
  if (userId) {
    // When column is referenced, process the user description with getLabel
    if (colObj.referenced && userDesc) {
      // Use getLabel for user description when column is referenced
      colObj.values[userId] = getLabel(userDesc, String(userDesc));
    } else {
      // Otherwise, use the raw value with string conversion
      colObj.values[userId] = userDesc ? String(userDesc) : String(userId);
    }
  }

  // Debug info if needed
  // if (!vars["data"].customColumns._debug) vars["data"].customColumns._debug = {};
  // vars["data"].customColumns._debug[type + "_" + colNum] = (vars["data"].customColumns._debug[type + "_" + colNum] || 0) + 1;
}

// Main function to process each row from the SQL query
function onFetchCustomCol(row) {
  // Get column type directly from the COL_TYPE field
  var colType = row["COL_TYPE"];

  if (colType) {
    handleCustomColByType(row, colType);
  } else {
    // Fallback to detect type if COL_TYPE field is missing
    if (row["SCHED"]) {
      handleCustomColByType(row, "SCHED");
    }
    if (row["USER"]) {
      handleCustomColByType(row, "USER");
    }
    if (row["CPNT"]) {
      handleCustomColByType(row, "CPNT");
    }
    // Add other type detection logic here if needed
  }
}

// Initialize and process the current row
if (!vars["data"]) {
  vars["data"] = {};
}
if (!vars["data"].customColumns) {
  vars["data"].customColumns = {};
}
onFetchCustomCol(row);
