<script type="text/javascript" lang="ts">
    import Calendar from "../homepage/calendar.svelte";
    import {Datetime_T} from '$lib/js/datetime';
    import Collectionbar from "../homepage/collectionbar.svelte";

    export let clickable: boolean = false;

    export let value: Datetime_T = Datetime_T.today();

    const months: Array<string> = [
        'January','February','March','April','May','June','July','August','September','October','November','December'
    ];

    let date: number;
    let month: number;
    let month_name: string;
    let year: number;

    let has_time: boolean = false;
    let hour: number;
    let minute: number;

    let time: string;
    
    let calendar: Calendar;

    $: date = value.date;
    $: month = value.month;
    $: year = value.year;
    $: month_name = months[month - 1]?.toUpperCase();

    $: has_time = value.has_time;
    $: hour = value.hour;
    $: minute = value.minute;

    $: time = has_time ? value.getTimeString() : '';

    function changeDate(){
        if(!clickable)
            return;

        calendar.setDate(value);

        calendar.show();
    }

    function dateChanged(){
        value = calendar.getDateTime();
    }

</script>
{#if clickable}
<Calendar bind:this={calendar} picker={true} ok_callback={dateChanged}/>
{/if}
<div class="main" on:click={changeDate}>
    <div>
        <span class="mon">{month_name}</span>
        <span class="day">{date}</span>
    </div>
    <div class="time" style="text-align: left;">
    <span class="Mon">{time}</span>
</div>
</div>


<style>
    .time{
        display: inline;
        margin-left: 13px;
        font-family: 'Poppins';
        font-weight: 300;
        color: #ffffff;
        font-size: 18px;
        position: relative;
        top: 0px;
        letter-spacing: 2px;
    }
    .main{
        margin-top: 20px;
        border-left: 1px solid #5d5d5d;
        text-align: left;
        padding: 10px 7px;
        margin-left: 20px;
    }

    .main .icon{
        font-size: 20px;
        position: relative;
        top: -20px;
    }

    .main div:first-child{
        text-align: left;
        width: 80px;
    }

    .main div{
        display: inline-block;
    }

    .day{
        font-size: 24px;
        font-family: 'Poppins';
        font-weight: 500;
        margin-top: -5px;
        color: #ffffff;
        border-radius: 50px;
    }

    .mon {
    display: block;
    font-family: 'Poppins';
    color: #e66262;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.5px;
    margin-bottom: -5px;
    }

    .yr{

    }
</style>