import type { AvailableHour } from "@types/domain";

interface HourListProps {
    // Define any props if needed
    hours: AvailableHour[];
}

export const HourList = ( { hours }: HourListProps) => {
    const  formattedHours = hours.map(hour => ({
        ...hour,
        startHour: new Date(hour.startHour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endHour: new Date(hour.endHour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lunchBreak: hour.lunchBreak ? {
            start: new Date(hour.lunchBreak.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            end: new Date(hour.lunchBreak.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        } : undefined,
    }));

    return (
        <div className="hour-grid">
      {formattedHours.map((hour) => (
        <div key={hour.id}>
            <div className="hour-start"> {hour.startHour}</div>
            <div className="hour-block">
                    <div>
                        {hour.lunchBreak ? (
                            <div className="lunch-break">
                                <span className="lunch-break-text">Colación</span>
                            </div>
                        ) : null}   
                    </div>
            </div>
            <div id={`endHour${hour.id}`}>{hour.endHour}</div>
        </div>
      ))}
    </div>
  );
}