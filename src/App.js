import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TripForm from "./components/TripForm";
import RouteMap from "./components/RouteMap";
import LogSheet from "./components/LogSheet";

function App() {
  const [tripData, setTripData] = React.useState();
  useEffect(() => {
    console.log("datatrip", tripData);
  }, [setTripData]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-white shadow-md">
          <div className="container mx-auto py-4 px-6">
            <h1 className="text-2xl font-bold">ELD Logger</h1>
            <p className="text-sm">Electronic Logging Device Generator</p>
          </div>
        </header>

        <main className="container mx-auto py-6 px-4">
          <Routes>
            <Route
              path="/"
              element={
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <TripForm setTripData={setTripData} />
                  </div>
                  <div>
                    {tripData ? (
                      <div className="bg-white rounded-lg shadow-lg p-4">
                        <h2 className="text-xl font-semibold mb-4">
                          Route Summary
                        </h2>
                        <div className="mb-4">
                          <p>
                            <span className="font-medium">Total Distance:</span>{" "}
                            {Math.round(tripData.route.total_distance)} miles
                          </p>
                          <p>
                            <span className="font-medium">Total Duration:</span>{" "}
                            {Math.round(tripData?.route.total_duration)} hours
                          </p>
                          <p>
                            <span className="font-medium">Days Required:</span>{" "}
                            {tripData?.hos.days_required}
                          </p>
                          <p>
                            <span className="font-medium">Rest Stops:</span>{" "}
                            {tripData?.hos?.rest_stops?.length}
                          </p>
                          <p>
                            <span className="font-medium">Fuel Stops:</span>{" "}
                            {tripData?.route?.fuel_stops?.length}
                          </p>
                        </div>
                        <RouteMap
                          routeData={tripData?.route}
                          hosData={tripData?.hos}
                        />
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-xl font-semibold mb-2">
                          No Route Generated
                        </h2>
                        <p className="text-gray-600">
                          Please fill out the form to generate a route and ELD
                          logs.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              }
            />
            <Route
              path="/logs"
              element={
                tripData ? (
                  <div className="bg-white rounded-lg shadow-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">ELD Logs</h2>
                    {tripData.logs.map((log, index) => (
                      <LogSheet key={index} logData={log} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h2 className="text-xl font-semibold mb-2">
                      No ELD Logs Available
                    </h2>
                    <p className="text-gray-600">
                      Please generate a route first.
                    </p>
                  </div>
                )
              }
            />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-white mt-12">
          <div className="container mx-auto py-4 px-6 text-center">
            <p>&copy; 2025 ELD Logger</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
