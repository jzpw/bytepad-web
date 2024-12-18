<script type="text/javascript" lang="ts">

import {CalendarCompose} from '$lib/js/calendar';
import {Types} from '$lib/js/types'
import {DateTime} from "luxon";
  
export let tasks: Number = 0;

let today: Date = new Date();

let initial_cursor: Types.Date_T = new Types.Date_T(today.getDate(), today.getMonth() + 1, today.getFullYear());
   
let weeks = CalendarCompose.createCalendar(11, 2024); 

</script>

<div class="grid">
    <div class="box">
        <div class="cal-title">
            Nov
        </div>
        <table class="cal-table">
            {#each weeks as week}
            <tr>
                {#each week.days as day}
                    <td>
                        <div class:today={day.date == initial_cursor.asString} class:relevant-month={!day.within_month} class="day-dot"></div>
                    </td>
                {/each}
            </tr>
            {/each}
        </table>
    </div>
    <div class="box">
        <div class="num">{tasks}</div>
        <div class="foot">Tasks Outstanding</div>
    </div>
</div>

<style>

.num{
    font-size: 32px;
    font-weight: 300;
    text-align: center;
    color: #ffffff;
    margin-top: 25px;
    font-family: Poppins;
}

.foot{
    text-align: center;
    font-family: Poppins;
    margin-top: 3px;
    font-size: 12px;
    color: #c7c7c7;
}

.cal-title{
    padding-top: 10px;
    font-family: Poppins;
    font-size: 13px;
    font-weight: 400;
    color: #d4d4d4;
    text-align: center;
}

.cal-table{
    width: -webkit-fill-available;
    height: 70px;
    box-sizing: border-box;
    margin: 15px auto;
    max-width: 110px;
}

.day-dot{
    margin: auto;
    width: 3px;
    height: 3px;
    border-radius: 5px;
    background-color: #b5b5b5;

}

.relevant-month{
    background-color: #2b2b2b !important;
}

.today{
    background-color: #27ff8c;
    transform: scale(1.5);
}

.grid{
    margin: 0px 20px;
    grid-gap: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.box{
    height: 120px;
    border-radius: 10px;
    background-color: #1b1b1b;
    margin: 0px 0px;
    padding: 5px 0px;
}

.icon{
    position: relative;
    top: 2px;
    font-size: 20px;
    display: inline-block;
    color: #9efdd6;
    border-radius: 50px;
    padding: 2px;
}

</style>