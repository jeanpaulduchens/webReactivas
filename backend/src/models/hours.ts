export interface AvailableHour {
    id: number;
    startHour: Date;
    endHour: Date;
    lunchBreak?: lunchBreak;
}