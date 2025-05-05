const Apibutton = () => {
  return (
    <button
      onClick={async () => {
        // Create a result display element that will show up on the page
        const resultDisplay = document.createElement("div");
        resultDisplay.style.position = "fixed";
        resultDisplay.style.top = "50px";
        resultDisplay.style.left = "50%";
        resultDisplay.style.transform = "translateX(-50%)";
        resultDisplay.style.width = "80%";
        resultDisplay.style.maxHeight = "80vh";
        resultDisplay.style.backgroundColor = "white";
        resultDisplay.style.padding = "20px";
        resultDisplay.style.overflow = "auto";
        resultDisplay.style.border = "1px solid #777";
        resultDisplay.style.borderRadius = "5px";
        resultDisplay.style.zIndex = "9999";
        resultDisplay.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";

        // Add heading
        const heading = document.createElement("h3");
        heading.textContent = "API Response";
        heading.style.marginTop = "0";
        resultDisplay.appendChild(heading);

        // Add close button
        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.padding = "5px 10px";
        closeButton.onclick = () => document.body.removeChild(resultDisplay);
        resultDisplay.appendChild(closeButton);

        // Add log content area
        const logContent = document.createElement("pre");
        logContent.style.marginTop = "30px";
        logContent.style.whiteSpace = "pre-wrap";
        logContent.style.border = "1px solid #eee";
        logContent.style.padding = "10px";
        logContent.style.backgroundColor = "#f8f8f8";
        resultDisplay.appendChild(logContent);

        // Function to add log entry
        const log = (text: string) => {
          const entry = document.createElement("div");
          entry.textContent = text;
          logContent.appendChild(entry);
          const hr = document.createElement("hr");
          hr.style.margin = "10px 0";
          hr.style.border = "0";
          hr.style.borderTop = "1px dashed #ccc";
          logContent.appendChild(hr);
        };

        // Add the result display to the page
        document.body.appendChild(resultDisplay);

        // Start logging
        log("Starting API test...");

        try {
          log("Sending request to SAP API...");

          // Call the specific SAP SuccessFactors Learning API endpoint
          const response = await fetch(
            "https://landschaft-stage.lms.sapsf.eu/learning/admin/api/v1/assignment-profile/items?apID=ALL+MANAGERS",
            {
              method: "GET",
              credentials: "include", // Include cookies automatically
              headers: {
                accept: "application/json, text/javascript, */*; q=0.01",
                "content-type": "application/json; charset=utf-8",
                // Let browser handle the cookies and CSRF tokens automatically
                // as they should be included with credentials: "include"
              },
            }
          );

          log(
            `Response received: Status ${response.status} (${response.statusText})`
          );

          if (response.ok) {
            try {
              const data = await response.json();
              log("Response successfully parsed as JSON");
              log(`Data: ${JSON.stringify(data, null, 2)}`);
            } catch (jsonError: unknown) {
              const errorMessage =
                jsonError instanceof Error
                  ? jsonError.message
                  : "Unknown JSON parsing error";
              log(`Error parsing JSON: ${errorMessage}`);

              // Try to get the text content instead
              const textContent = await response.text();
              log(`Raw response text: ${textContent}`);
            }
          } else {
            log(`Request failed: ${response.status} ${response.statusText}`);

            try {
              const errorText = await response.text();
              log(`Error response: ${errorText}`);
            } catch (textError: unknown) {
              const errorMessage =
                textError instanceof Error
                  ? textError.message
                  : "Could not read error text";
              log(`Could not read error response: ${errorMessage}`);
            }
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          log(`Error during fetch: ${errorMessage}`);
          if (error instanceof Error && error.stack) {
            log(`Stack trace: ${error.stack}`);
          }
        }
      }}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "400px",
        padding: "8px 16px",
        background: "#eee",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      Test SAP API
    </button>
  );
};

export default Apibutton;
