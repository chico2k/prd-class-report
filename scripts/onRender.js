var scriptContent =
  // prettier-ignore
  "<script type=\"text/javascript\">\n" +
      // prettier-ignore
    "globalThis.data ="  + JSON.stringify(vars["data"]) + ";\n" +
       // prettier-ignore
    "globalThis.preferences =" + JSON.stringify(getUserPreferences())  + ";\n" +
      // prettier-ignore
          		
    "globalThis.labels =" + JSON.stringify(getLabelsFromSF())  + ";\n" +
      // prettier-ignore
     "globalThis.isPreviewMode =" + JSON.stringify(isPreviewMode())  + ";\n" +
    "</script>\n";

scriptContent;
