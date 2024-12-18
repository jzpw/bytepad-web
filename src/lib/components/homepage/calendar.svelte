<script type="text/javascript" lang="ts">
    import * as API from '$lib/js/request';
    import { global_session } from "$lib/js/applicationstore";
    import { onMount } from 'svelte';
    import {Types} from '$lib/js/types'
    import Toggle from '../controls/toggle.svelte';
    import { Datetime_T } from '$lib/js/datetime';
    import { swipe } from 'svelte-gestures';
    import {CalendarCompose} from '$lib/js/calendar';
    import {DateTime} from "luxon";
    import Datetime from '../controls/datetime.svelte';

    export let callback_event: Function | null = null;
    export let cancel_callback: Function | null = null;
    export let ok_callback: Function | null = null;
    export let picker: boolean = false;

    export function Refresh(){
        cursor = initial_cursor.asString;
        month = today.getMonth() + 1;
        year = today.getFullYear();

        year_loaded = null;
        year_cached = null;

        Fetch(month, year);
    }

    const days: Array<string> = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    const months: Array<string> = [
        'January','February','March','April','May','June','July','August','September','October','November','December'
    ];

    let first_load: boolean = true;

    let year_loaded: number | null = null;

    let year_cached: any = [];

    let visible: boolean = false;

    let time_enabled: boolean = false;
    let time_value: string;

    $: if(!time_enabled) time_value = '';

    let weeks: any = [];

    let today: Date = new Date();

    let month: number = today.getMonth() + 1;
    let year: number = today.getFullYear();
    let session_id: string;

    let header_title: string;

    let today_title: string;

    let initial_cursor: Types.Date_T = new Types.Date_T(today.getDate(), today.getMonth() + 1, today.getFullYear());
    let cursor: string = initial_cursor.asString;
    let cursor_date: Date;

    $: cursor_date = new Date(cursor);
    
    $: today_title = days[cursor_date.getDay()] + ' ' + toOrdinal(cursor_date.getDate()) + ' ' + months[cursor_date.getMonth()];

    let cursor_events: any = [];

    global_session.subscribe((k) => session_id = k);

    $: Fetch(month, year);

    $: header_title = months[month - 1] + " " + year;
    
    $: LoadEvents(cursor);

    export function show(){
        Fetch(month, year);
        visible = true;
    }

    export function hide(){
        visible = false;
    }

    export function setDate(date: Datetime_T){

        cursor = date.getDateString();

        if(date.has_time) {
            time_enabled = true;
            time_value = date.getTimeString();
        }

        month = date.month;
        year = date.year;
        }

        export function getDateTime(): Datetime_T{
        return Datetime_T.fromStrings(cursor, time_enabled && time_value?.length == 5 ? time_value : '');
    }

    function reset(){
        month = today.getMonth() + 1;
        year = today.getFullYear();
    }

    function cancelBtn(){
        hide();
        if(cancel_callback)
            cancel_callback();
    }

    function okBtn(){
        hide();
        if(ok_callback)
        ok_callback();
    }

    function Fetch(m: number, y: number){
        weeks = CalendarCompose.createCalendar(m, y);     
        console.log(weeks);

        //Check if current year is loaded
        if(!(year_loaded == y))
        {
            const req = {
                session_id: session_id,
                year: y
            };

            console.log(req);

            API.Post(
                'calendar/getevents',
                req,
                function(c: any){ 
                    year_loaded = y;
                    year_cached = c.data;
                    console.log(year_cached);
                    FillEvents();
                },
                function(f: Response){ console.log(Response) }
            );
        } else {
            FillEvents();
        }
        
        return;

        if(first_load && 'calendarCache' in window.localStorage){
            let calendar_cache: any = JSON.parse(window.localStorage.getItem('calendarCache') ?? '');

            if(calendar_cache && calendar_cache.month == m + '-' + y)
                weeks = calendar_cache.weeks;

        }

    }

    function FillEvents(){

        if(!(year_loaded == year))
            return;

        year_cached.forEach(event => {
                for(let i = 0; i < weeks.length; i++) {
                    let week = weeks[i];

                    for(let d = 0; d < week.days.length; d++) {
                        let day = week.days[d];

                        if(event.date == day.date)
                            weeks[i].days[d].events.push(event);
                    }
                }
        });

        weeks = weeks;

        LoadEvents(cursor);
    }

    function LoadEvents(c: string){
        console.log('The date string is: ' + c);

        weeks.forEach(element => {
            element.days.forEach(element => {
                if(element.date == c) {
                    cursor_events = element.events;
                    console.log(cursor_events);
                }
            });
        });

        if(!cursor_events)
            cursor_events = [];
    }

    function StepLeft(){
        if(month == 1){
            year--;
            month = 12;
        }
        else{
            month--;
        }
    }

    function StepRight(){
        if(month == 12){
            year++;
            month = 1;
        }
        else{
            month++;
        }
    }

    function toOrdinal(n: number):string{
        switch(n){
            case 1: return '1st';
            case 2: return '2nd';
            case 3: return '3rd';
            case 4: return '4th';
            default: return n + 'th';
        }

        return '';
    }

    function onSwiped(event: any){
        let direction = event.detail.direction;

        if(direction == 'right')
            StepLeft();
        else if(direction == 'left')
            StepRight();
        else if(direction == 'bottom')
            hide();

    }

</script>

{#if visible}
<div id="calendarModal" class="modal2" on:click={hide}>
    <div class="modal2-content" on:click={(e) => {e.stopPropagation()}}>
        <div class="calendar-header">
            <button on:click={StepLeft}><i class="material-symbols-outlined">chevron_left</i></button>
            <span on:click={reset}>{header_title}</span>
            <button on:click={StepRight}><i class="material-symbols-outlined">chevron_right</i></button>
        </div>

        <div use:swipe={{ timeframe: 300, minSwipeDistance: 100, touchAction: 'pan-y'}} on:swipe={onSwiped} class="calendar-table">
            <table>                   
                <tr>
                    <td>
                        Mon
                    </td>
                    <td>
                        Tue
                    </td>
                    <td>
                        Wed
                    </td>
                    <td>
                        Thu
                    </td>
                    <td>
                        Fri
                    </td>
                    <td>
                        Sat
                    </td>
                    <td>
                        Sun
                    </td>
                </tr>
                {#each weeks as week}
                    <tr>
                        {#each week.days as day}
                            <td on:click={() => {cursor = day.date}} 
                                class:cursor-selected={day.date == cursor} 
                                class:relevant-month={!day.within_month}
                                class:today={day.date == initial_cursor.asString}>
                                {day.day_number}
                                {#if day.events?.length > 0}
                                <span class="dot"></span>
                                {/if}
                            </td>
                        {/each}
                    </tr>
                {:else}
                    <tr>

                    </tr>
                {/each}
            </table>
        </div>

        {#if !picker}
        <div class="calendar-items">
            <div class="section-header header-calendar" id="calendar-current-date">{today_title}<i class="material-symbols-outlined quickadd-icon">bookmark_add</i></div>
            {#if cursor_events?.length > 0}
            <table class="calendar-items-table">
                <colgroup>
                    <col span="1" style="width: 10%;">
                    <col span="1" style="width: 75%;">
                    <col span="1" style="width: 15%;">
                 </colgroup>
                <tbody>
                        {#each cursor_events as event}
                        <tr on:click={() => {callback_event(event.id)}}>
                            <td class="calendar-items-icon-row">
                                <i class="material-symbols-outlined calendar-items-icon">event</i>
                            </td>
                            <td>
                                {event.title}
                            </td>
                            <td class="time">
                                {event.time}
                            </td>
                        </tr>
                        {:else}
                            No events
                        {/each}

                </tbody>
            </table>
            {:else}
                <div class="no-events">No events</div>
            {/if}
        </div>
        {:else}
        <div class="time-container">
            <span class="small-icon material-symbols-outlined">schedule</span>
            <Toggle bind:value={time_enabled}/>
            <input class="time" bind:value={time_value} class:hidden={!time_enabled} type="time" name="appt"/>
        </div>
        <div class="button-container">            
            <button on:click={cancelBtn} class="save-btn inverted">
                <span>
                    Cancel
                </span>
                <span class="material-symbols-outlined" style="
                font-size: 20px;
                padding-left: 7px;
                line-height: 10px;
                position: relative;
                top: 5px;"
            >close</span>
            </button>
            <button on:click={okBtn} class="save-btn">
                <span>
                    Select
                </span>
                <span class="material-symbols-outlined" style="
                font-size: 20px;
                padding-left: 7px;
                line-height: 10px;
                position: relative;
                top: 5px;
            ">today</span>
            </button>      
    

        </div>
     {/if}
    </div>
</div>

{/if}

<style>

.save-btn {
    font-size: 13px;
    font-family: 'Poppins';
    margin-right: 0px;
    color: #000000;
    /* border: 1px solid #ffffff; */
    width: max-content;
    padding: 6px 15px;
    background-color: #65c2cd;
    /* box-shadow: 3px 3px #357959; */
    border-radius: 51px;
    cursor: pointer;
    transition: 0.2s;
    border: none;
    border:1px solid #65c2cd;
    transition: all 300ms linear;
}

    .save-btn.inverted{
        background-color: #00000000 !important;
        border: 1px solid #aaaaaa;
        color: #c9c9c9;
        margin-right: 20px;
    }

.hidden{
    visibility: hidden;
}

.time-container{
    margin: 20px 10px 20px 10px;
    text-align: left;
    padding-bottom: 10px;
}

.button-container{
    margin: 20px 10px 10px 10px;
    text-align: right;
}

.small-icon{
    font-variation-settings: 'wght' 200;
    font-size: 22px;
    margin: 0px 0px;
    color: #4f4f4f;
    position: relative;
    top: 2px;
}

.time{
    font-size: 19px;
    background-color: #e8f6ff00;
    border: none;
    color: #444444;
    border-radius: 0px;
    font-family: 'Inter';
    padding: 0px 10px;
}

input[type="time"]::-webkit-calendar-picker-indicator {
   filter: invert(0.5) sepia(1) saturate(1) hue-rotate(175deg);
   transform: scale(0.9);
}

.no-events{
    font-family: 'Raleway';
    color: #999999;
    text-align: center;
    font-size: 14px;
    margin-top: 25px;
}

.calendar-items{
    margin: 15px 5px 0px 5px;
    table-layout: fixed;
}

.calendar-items-table{
    width:100%;
}

.calendar-items-table td{
    text-align: left;
    font-family: 'Raleway';
    font-size: 14px;
    font-weight: 500;
    color: #e7e7e7;
}

.calendar-items-table td:last-child{
    text-align:right !important;
}

.calendar-items-table td i{
    font-weight: 200;
    font-variation-settings: 'wght' 200;
    font-size: 22px;
    color: #91d1b4;
    position: relative;
    top: 1px;
}

.modal2 {
    background-color: #00000023;
    backdrop-filter: blur(2px);
    position: fixed;
    z-index: 1200;
    left: 0;
    top: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    animation: fadein 0.2s;
}

@keyframes fadein {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slidein-btm {
    from {
        opacity: 0;
        transform: translateY(200px);
    }

    to {
        opacity: 1;
        transform: translateY(0px);
    }
}


.calendar-header{
    font-family: 'Poppins';
    color: #a0b9d7;
    text-align: center;
    padding-bottom: 10px;
    font-weight: 300;
    margin-bottom: 10px;
}

.calendar-header button{
    background: transparent;
    border: none;
    color: #9dbbdb;
    font-size: 20px;
    padding: 0px 22px;
}

.calendar-header span {
    display: inline-block;
    width: 150px;
    padding: 8px 20px;
    border-radius: 8px;
    background-color: #0e1721;
}

.calendar-header button i{
    position: relative;
    top: 5px;
    font-variation-settings: 'wght' 300;
}

.calendar-table{
}

.calendar-table table{
    width: 100%;
    table-layout: fixed;
}

.modal2-content {
    z-index: 1000;
    bottom: 0;
    border-radius: 15px 15px 0px 0px;
    top: 55px;
    background-color: rgb(0, 0, 0);
    margin: 0 auto;
    padding: 40px 10px;
    width: 100%;
    min-height: 100%;
    animation: slidein-btm 0.2s;
    position: relative;
    box-shadow: 2px 2px 8px 0px #57393971;
    box-sizing: border-box;
}

.relevant-month{
    color: #4c4c4c;
}

.cursor-selected{
    background-color: #1b5252;
    color: #ffffff;
}

.today{
    border: 1px solid #d3d3d3;
}

.section-header{
    font-family: 'Montserrat';
    color: #ececec;
    padding: 15px 5px;
    border-bottom: 1px solid #2e2e2e;
}

.section-header i{
    font-size: 20px;
    padding-left: 10px;
    color: #b4d8db;
    font-weight: 300;
}

td{
    border-radius: 10px;
    border: 2px solid transparent;
    text-align: center;
    color: #ececec;
    font-family: 'Inter';
    font-size: 13px;
    padding: 10px 0px;
    font-weight: 400;
    position: relative;
}

.dot {
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: #237563;
    border-radius: 10px;
    left: 4px;
    top: 16px;
}

</style>