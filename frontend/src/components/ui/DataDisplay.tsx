import React from "react";

type DataDisplayProps = {
  data: unknown;
};

const DataDisplay: React.FC<DataDisplayProps> = ({ data }) => {
  // Handle primitive types
  if (data === null || data === undefined) {
    return <div className="p-4 text-gray-500">No data available</div>;
  }

  if (typeof data === "string") {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <pre className="whitespace-pre-wrap break-words font-sans text-sm">
          {data}
        </pre>
      </div>
    );
  }

  // Handle numbers, booleans, etc.
  if (typeof data !== "object") {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <pre className="font-sans text-sm">{String(data)}</pre>
      </div>
    );
  }

  // Convert single objects to array for consistent table handling
  let tableData: Record<string, any>[] = [];
  if (Array.isArray(data)) {
    // Filter out non-object items
    tableData = data.filter(
      (item) => typeof item === "object" && item !== null
    );
  } else {
    tableData = [data];
  }

  // Handle case where we have no valid objects
  if (tableData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No valid object data available
      </div>
    );
  }

  // Get all unique keys from all objects
  const headers = Array.from(
    tableData.reduce<Set<string>>((keys, obj) => {
      Object.keys(obj).forEach((key) => keys.add(key));
      return keys;
    }, new Set<string>())
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {headers.map((header) => {
                const value = item[header];
                const displayValue =
                  value === null || value === undefined
                    ? "N/A"
                    : typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value);

                return (
                  <td
                    key={`${index}-${header}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {displayValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataDisplay;
