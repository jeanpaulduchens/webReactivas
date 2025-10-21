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
    <div className="panel pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button className="cal-nav" onClick={goToPreviousMonth} aria-label="Mes anterior">
          ‹
        </button>
        <strong style={{ fontSize: 16, fontWeight: 700 }}>
          {monthNames[month]} {year}
        </strong>
        <button className="cal-nav" onClick={goToNextMonth} aria-label="Mes siguiente">
          ›
        </button>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(7, 1fr)", 
        gap: 6, 
        marginBottom: 8,
        textAlign: "center",
        fontSize: 12,
        color: "#6b7280",
        fontWeight: 600
      }}>
        <div>Do</div>
        <div>Lu</div>
        <div>Ma</div>
        <div>Mi</div>
        <div>Ju</div>
        <div>Vi</div>
        <div>Sá</div>
      </div>

      <div className="cal-grid" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
        {calendarDays.map((dayObj, index) => {
          if (dayObj.day === 0) {
            return <div key={`empty-${index}`} />;
          }

          const isSelected = dayObj.dateStr === selectedDate;
          
          return (
            <button
              key={dayObj.dateStr}
              className={`cal-cell ${isSelected ? "active" : ""}`}
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