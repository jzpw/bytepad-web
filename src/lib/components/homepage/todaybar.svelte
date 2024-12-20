<script type="text/javascript" lang="ts">

    import Datetime from '$lib/components/controls/datetime.svelte';
    import {DateTime} from "luxon";
    
    export let tdy_items = [];
    export let tomorrow_items = [];

    export let callback_item_clicked: Function;

    let expanded: boolean = false;
        $: expanded = tomorrow_items?.length > 0;

    let display_date: string = '';

    let date_today = DateTime.now();

    display_date = date_today.toLocaleString({ dateStyle: 'full' });

</script>

<div id="" class="item-group">
    <div class="calendar-title">
        <span>{display_date}</span>
    </div>

    {#if false}
    <div class="today-items">
        <div class="today-title">TODAY</div>
        {#each tdy_items as {id, title, due, time}}
            <div class="event" on:click={()=>{callback_item_clicked(id)}}>
                {title}
                <span class="time">{time}</span>
            </div>
        {:else}
            <div id="today-nothing" class="nothing">No events</div>
        {/each}
        {#if expanded}
        <div class="today-title">TOMORROW</div>
        {#each tomorrow_items as {id, title, due, time}}
            <div class="event" on:click={()=>{callback_item_clicked(id)}}>
                {title}
                <span class="time">{time}</span>
            </div>
        {:else}
            <div id="today-nothing" class="nothing">No events</div>
        {/each}
        {/if}
        <div on:click={()=>{expanded = !expanded;}} class="arrow-dn">
            <span class="material-symbols-outlined">{!expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}</span>
        </div>
    </div>
    {/if}
</div>

<style>
    .arrow-dn{
        text-align: center;
        color: #c7c7c7;
        padding-bottom: 10px;
    }

    .arrow-dn span{
        font-size: 23px !important;
    }

    .today-title{
        font-size: 13px;
        text-align: center;
        color: #ffffff;
        font-family: Poppins;
        padding: 8px 10px;
    }

    .today-items div.event{
        font-family: Poppins;
        font-size: 13px;
        padding: 10px 20px;
        font-weight: 400;
        color: #ffffff;
        border-radius: 10px;
        background-color:#1f1d1d;
        border: 1px solid hsl(0, 7%, 24%);
        margin-bottom: 10px;
    }

    .today-items{
        margin: 0px 20px;
    }

    .today-items div.event span:first-child{
        color: var(--today-bar-event-icon);
        padding-right: 5px;
    }

    .time{
        font-family: Inter !important;
        float:right;
        font-size: 14px !important;
    }

    .today-items div span{
        font-size: 20px;
        font-weight: 200;
        position: relative;
        top: 4px;
    }

    .settings-button{
        position: absolute;
        color: #dddddd;
        font-weight: 200;
        right: 15px;
        top: 15px;
        padding: 2px;
        border-radius: 30px;
        background-color: rgb(15, 32, 36);
    }

    .item-group{
        border-radius: 15px;
        margin: 20px 20px;
        position: relative;
    }

    .calendar-title{
        padding: 16px 13px;
        font-size: 18px;
        font-family: 'Poppins';
        text-align: center;
        color:#e5e5e5;
  }

    .calendar-title span{
        box-shadow: inset 0 -10px #192532;
  
    }

    #today-items{
        display:grid;grid-gap: 4px;max-height: 150px;overflow-y: auto;
    }

    .nothing {
    padding: 4px 2px;
    text-align: center;
    font-family: 'Poppins';
    font-size: 12px;
    color: #b0b0b0;
    width: 122px;
    font-weight: 200;
    margin: 10px auto;
    }   
</style>