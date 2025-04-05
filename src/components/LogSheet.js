import React, { useRef } from "react";
import { usePDF } from "@react-pdf/renderer";
import LogGrid from "./LogGrid";
import MyDocument from "./MyDocument";
const LogSheet = ({ logData }) => {
  const pdfRef = useRef();
  const [instance, updateInstance] = usePDF({
    document: <MyDocument logData={logData} />,
    filename: `eld-log-${logData.date}.pdf`,
  });

  const handleDownload = () => {
    if (instance && instance.url) {
      window.open(instance.url);
    }
  };

  return (
    <div className="mb-8 border border-gray-300 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Log Sheet: {logData.date}</h3>
        <button
          onClick={handleDownload}
          className="bg-primary hover:bg-secondary text-white font-bold py-1 px-3 rounded text-sm"
        >
          Download PDF
        </button>
      </div>

      <div ref={pdfRef} className="bg-white p-4">
        <div className="mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-center mb-2">
            Driver's Daily Log
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <span className="font-semibold">Date:</span> {logData.date}
              </p>
              <p>
                <span className="font-semibold">Driver:</span> {logData.driver}
              </p>
              <p>
                <span className="font-semibold">From:</span> {logData.from}
              </p>
              <p>
                <span className="font-semibold">To:</span> {logData.to}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Carrier:</span>{" "}
                {logData.carrier}
              </p>
              <p>
                <span className="font-semibold">Truck #:</span>{" "}
                {logData.truck_number}
              </p>
              <p>
                <span className="font-semibold">Total Miles:</span>{" "}
                {Math.round(logData.total_miles)}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Hours of Service</h3>
          <LogGrid gridData={logData.grid} title="24-Hour Grid" />

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">Status Totals</h4>
              <ul className="list-disc pl-5">
                <li className="flex items-center">
                  <span className="w-4 h-4 inline-block bg-yellow-400 mr-2"></span>
                  <span>
                    On Duty (Not Driving):{" "}
                    {logData.entries
                      .filter((e) => e.status === 1)
                      .reduce((sum, e) => sum + e.duration, 0)
                      .toFixed(2)}{" "}
                    hrs
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 inline-block bg-purple-400 mr-2"></span>
                  <span>
                    Sleeper Berth:{" "}
                    {logData.entries
                      .filter((e) => e.status === 2)
                      .reduce((sum, e) => sum + e.duration, 0)
                      .toFixed(2)}{" "}
                    hrs
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 inline-block bg-green-400 mr-2"></span>
                  <span>
                    Driving:{" "}
                    {logData.entries
                      .filter((e) => e.status === 3)
                      .reduce((sum, e) => sum + e.duration, 0)
                      .toFixed(2)}{" "}
                    hrs
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 inline-block bg-red-400 mr-2"></span>
                  <span>
                    Off Duty:{" "}
                    {logData.entries
                      .filter((e) => e.status === 4)
                      .reduce((sum, e) => sum + e.duration, 0)
                      .toFixed(2)}{" "}
                    hrs
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Status Changes</h4>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs py-1">Time</th>
                      <th className="text-left text-xs py-1">Status</th>
                      <th className="text-left text-xs py-1">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logData.entries.map((entry, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="text-xs py-1">{entry.start_time}</td>
                        <td className="text-xs py-1">
                          {entry.status === 1
                            ? "On Duty"
                            : entry.status === 2
                            ? "Sleeper Berth"
                            : entry.status === 3
                            ? "Driving"
                            : "Off Duty"}
                        </td>
                        <td className="text-xs py-1">{entry.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Remarks</h3>
          <div className="border rounded p-2 max-h-32 overflow-y-auto">
            {logData.remarks.map((remark, index) => (
              <p key={index} className="text-xs mb-1">
                {remark}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t">
          <p className="text-xs text-center">
            Original - File at home terminal. Duplicate - Driver retains in
            his/her possession for 8 days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogSheet;
