export class Datetime_T{
    date: number = 1;
    month: number = 0;
    year: number = 1;

    has_time: boolean = false;

    hour: number = 0;
    minute: number = 0;

    getTimeString(){
        return this.pad(this.hour) + ':' + this.pad(this.minute);
    }

    getDateString(){
        return this.year + '-' + this.pad(this.month) + '-' + this.pad(this.date);
    }

    static fromStrings(d: string, t: string): Datetime_T{
        let r: Datetime_T = new Datetime_T();
        const date_obj = d != '' ? new Date(d) : new Date();

        r.date = date_obj.getDate();
        r.month = date_obj.getMonth() + 1;
        r.year = date_obj.getFullYear();

        r.has_time = (t != '');

        if(r.has_time){
            const hh_mm = t.toString().split(':');

            r.hour = Number(hh_mm[0]);
            r.minute = Number(hh_mm[1]);
        }

        return r;
    }

    static today(): Datetime_T{
        let r: Datetime_T = new Datetime_T();

        let today: Date = new Date();

        r.date = today.getDate();
        r.month = today.getMonth() + 1;
        r.year = today.getFullYear();

        r.has_time = false;

        return r;
    }

    private pad(n: number){
        if(n < 10)
        {
            return '0' + n;
        }
        else{
            return n.toString();
        }
    }
}