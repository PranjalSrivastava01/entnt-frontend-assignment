import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CommunicationCalendar = ({ communications }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-600 mb-6">Communication Calendar</h1>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
        <div className="bg-white shadow-md p-5 rounded-lg">
          <Calendar 
            onChange={handleDateChange} 
            value={date} 
            className="rounded-lg border-blue-400"
          />
        </div>
        <div className="flex-1 bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Communications on {date.toLocaleDateString()}
          </h2>
          <div className="space-y-4">
            {communications
              .filter(
                (comm) =>
                  new Date(comm.date).toDateString() === date.toDateString()
              )
              .map((comm, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-blue-100 rounded-md shadow-sm hover:shadow-lg transition"
                >
                  <p className="font-medium text-blue-800">
                    {idx + 1}. {comm.type.name} with {comm.company.name}
                  </p>
                  <p className="text-gray-600 text-sm">{comm.notes}</p>
                </div>
              ))}
            {communications.filter(
              (comm) =>
                new Date(comm.date).toDateString() === date.toDateString()
            ).length === 0 && (
              <p className="text-gray-500">No communications for this date.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationCalendar;
