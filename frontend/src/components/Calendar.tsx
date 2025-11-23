import { useState } from "react";

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const generateCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push({ day: 0, dateStr: "" });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      days.push({ day, dateStr });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white rounded-card shadow-card p-[18px]">
      <div className="flex justify-between items-center mb-4">
        <button 
          className="border border-gray-200 bg-white w-9 h-9 rounded-lg cursor-pointer text-lg hover:bg-gray-50 hover:border-indigo-300 transition-all" 
          onClick={goToPreviousMonth} 
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <strong className="text-base font-bold">
          {monthNames[month]} {year}
        </strong>
        <button 
          className="border border-gray-200 bg-white w-9 h-9 rounded-lg cursor-pointer text-lg hover:bg-gray-50 hover:border-indigo-300 transition-all" 
          onClick={goToNextMonth} 
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-xs text-muted font-semibold">
        <div>Do</div>
        <div>Lu</div>
        <div>Ma</div>
        <div>Mi</div>
        <div>Ju</div>
        <div>Vi</div>
        <div>Sá</div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {calendarDays.map((dayObj, index) => {
          if (dayObj.day === 0) {
            return <div key={`empty-${index}`} />;
          }

          const isSelected = dayObj.dateStr === selectedDate;
          
          return (
            <button
              key={dayObj.dateStr}
              className={`w-full aspect-square grid place-items-center rounded-lg border cursor-pointer text-sm transition-all ${
                isSelected 
                  ? "bg-indigo-100 text-primary font-bold border-primary" 
                  : "border-transparent bg-white text-gray-700 hover:border-indigo-300 hover:bg-blue-50"
              }`}
              onClick={() => onDateSelect(dayObj.dateStr)}
              aria-label={`Seleccionar día ${dayObj.day}`}
            >
              {dayObj.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}