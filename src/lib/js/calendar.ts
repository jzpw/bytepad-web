import { DateTime } from "luxon";

export namespace CalendarCompose{
    export type calendar_week_T = {
        days: calendar_day_T[]
    }
    
    export type calendar_day_T = {
        date: string,
        day_number: number,
        within_month: boolean,
        events: calendar_event_T[]
    }
    
    export type calendar_event_T = {
        id: number,
        title: string,
        time: string
    }
    
    export function createCalendar(m: number, y: number): Array<calendar_week_T>
    {
        let cal: Array<calendar_week_T> = [];
    
        //Invalid month or year
        if(m < 1 || m > 13 || y < 1900 || y > 2100)
            return cal;
    
        const first_day_month: DateTime = DateTime.local(y, m, 1);
    
        const first_day_calendar: DateTime = first_day_month.minus({days: (first_day_month.weekday - 1)});
    
        let cursor: DateTime = first_day_calendar;
    
        let w, d: number;
    
        for(w = 0; w < 6; w++)
        {
            let week: calendar_week_T = {
                days: []
            };
    
            for(d = 0; d < 7; d++)
            {
                let day: calendar_day_T = {
                    date: cursor.toFormat('yyyy-MM-dd'),
                    day_number: cursor.day,
                    within_month: cursor.month == m,
                    events: []
                };
    
                week.days.push(day);
    
                cursor = cursor.plus({days: 1});
            }

            cal.push(week);
        }
    
        return cal;
    }
}
