export namespace Types{
    export type Item_Summary_T = {
        id: number,
        title: String,
        due?: Date,
        item_type: number
        collection?: String
        todo_complete: boolean
    }

    export type Item_T = {
        id: number,
        title: String,
        item_type: Number,
        due?: String,
        collection?: String,
        text?: String,
        shared_with?: Number,
        modified_on: String,
        created_on: Date,
        due_date?: Date,
        todo_complete?: Number,
        can_delete?: Boolean,
        archived?: boolean,
        multiselected: boolean,
    }
    
    //Define Collection
    export type Collection_T = {
        name: string,
        id: number,
        items_count?: number,
        shared?: boolean,
        userdefault?: boolean,
        owned?: boolean
    }

    export type File_T = {

    }

    export type Calendar_Week_T = {
        
    }

    export class Date_T {
        day: number;
        month: number;
        year: number;

        constructor(d: number, m: number, y: number){
            this.day = d;
            this.month = m;
            this.year = y;
        }

        fromString(s: string){
            let d: Date = new Date(s);

            this.day = d.getDay();
            this.month = d.getMonth();
        }

        get asString(){
            return this.year + '-' + this.pad(this.month) + '-' + this.pad(this.day);
        }

        private pad(n: number){
            if(n < 9)
            {
                return '0' + n;
            }
            else{
                return n.toString();
            }
        }
    }

    export enum app_state{
        Home,
        Collection_Open,
        Search,
    }

    export function ItemTypeToString(n: Number)
    {
        switch(n){
            case 0: return "note";
            case 1: return "todo";
            case 2: return "event";

            default: return 0;
        }
    }
}
