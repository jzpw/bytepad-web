<script type="text/javascript" lang="ts">
    import {Types} from '$lib/js/types';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
    import Calendar from './calendar.svelte';

    export let title: String = '';

    export let items: Array<Types.Item_Summary_T> = [];

    export let id: String = '0';

    let expand_available: boolean = false;

    let collapsed: boolean = false;

    $: expand_available = items?.length > 7;

    export let callback_item;

    let expanded: boolean = false;

    function getIcon(t: number){
        switch(t)
        {
            case 0: return 'note';
            case 1: return 'done';
            case 2: return 'today';
            default: return 'note';
        }
    }

    function getColor(t: number)
    {
        switch(t)
        {
            case 0: return 'note';
            case 1: return 'todo';
            case 2: return 'event';
        }
    }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if items.length > 0}
<div class="item-group">
    <div on:click={()=>{collapsed = !collapsed}} class="title" style="padding: 8px 13px;">
        {title}
        <span class="material-symbols-outlined" style="float:right; font-size: 13px;">expand_all</span>
    </div>
    {#if !collapsed}
    <div class="grid" class:expanded={expanded || !expand_available}>
        {#each items as {id, title, collection, item_type, todo_complete, shared_with, modified_on} (id)}
            <div class:shared={shared_with} animate:flip={{ duration: 500 }}  on:click={() => {callback_item(id)}} class="item-simple">
                <span  class="{getColor(item_type)} icon material-symbols-outlined">{getIcon(item_type)}</span>
                <div style="display:inline-block">
                    <div class="item-title">
                        <span class:strikeout={todo_complete}>{title}</span>
                    </div>
                    <div class="item-detail">    
                        <span>{collection} </span><span> { modified_on == "Today" ? modified_on : modified_on + " ago" }</span>
                    </div>
                </div>
                <div class="tags">
                    {#if shared_with}
                        <span class="material-symbols-outlined">share</span>
                    {/if}
                    {#if false}
                    <span class="material-symbols-outlined">attach_file</span>
                    {/if}
                </div>
            </div>
        {:else}
            <div>Nothing</div>
        {/each}
    </div>
    <div class:hidden={!expand_available} class="expand-btn" on:click={() => {expanded = !expanded}}>
        <span class="material-symbols-outlined">{#if expanded}keyboard_arrow_up{:else}keyboard_arrow_down{/if}</span>
    </div>
    {:else}
        <div on:click={()=>{collapsed = false;}} class="closed-icon">
            <span class="material-symbols-outlined">arrow_drop_down</span>
        </div>
    {/if}
</div>
{/if}
<style>
    .shared:after{
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 25px 25px 0;
      border-color: transparent #1d5e5b transparent transparent;
      right: 0;
      top: 0;
      position: absolute;
    }

    .tags{
        float: right;
    }

    .tags span{
        font-variation-settings: 'wght' 100;
        position: relative;
        top: 5px;
    }

    .closed-icon{
        text-align: center;
    }

    .closed-icon span{
        font-size: 22px;
        color: #e1e1e1;
    }

    .strikeout{
        text-decoration: line-through;
    }

    .hidden{
        display: none;
    }

    .expand-btn{
        margin-top: 15px;
        color: #aaaaaa;
        text-align:center;
    }
    .expanded{
        max-height: unset !important;
    }

    .item-group {
        border-radius: 10px;
        margin: 2px 0px;
        padding-bottom: 10px;
    }

    .title{
        font-size: 15px;
        margin: 1px 15px;
        font-family: 'Raleway';
        color: #ffffff;
        padding: 10px;
    }

    .grid:not(.expanded){
        -webkit-mask-image: linear-gradient(180deg, #000 80%, transparent);
    }

    .grid{
        border-radius: 10px;
        overflow: hidden;
        max-height: 300px;
        display:grid;
        margin: 0px 20px;
        background-color: #141414;
    }

    .item-simple {
        overflow:hidden;
        position: relative;
        padding: 13px 12px;
        font-family: 'Poppins';
        color: #ffffff;
        font-size: 14.5px;
        cursor: pointer;
        transition: background-color 0.5s;
        max-height: 100px;
        margin: 0px 10px;
    }

    .item-simple:not(:last-child){
        border-bottom: 1px solid #252525;
    }

    .item-simple:active{
        background: linear-gradient(90deg, rgba(26,26,26,1) 0%, rgb(19, 22, 24) 33%, rgb(19, 22, 24) 66%, rgba(26,26,26,1) 100%);
    }

    .item-simple .icon {
        font-size: 18px;
        position: relative;
        top: -8px;
        padding: 0px;
        margin-right: 18px;
        font-variation-settings: 'wght' 300;
    }

    .item-title{
        font-weight: 400;
        color: #ffffff;
    }

    .item-detail{
        font-size: 11px;
        font-weight: 300;
        color: rgb(161, 161, 161);
    }

    .item-detail span:not(:last-child){
        padding-right: 5px;
        margin-right: 7px;
        border-right: 1px solid #5c5c5c;
    }

    .item-simple .tag {
    letter-spacing: 0.5px;
    float: right;
    font-size: 9px;
    color: #dbdbdb;
    padding: 5px 8px;
    border-radius: 7px;
    background-color: #232323;
    position: relative;
    top: 0px;
    font-family: 'Poppins';
    max-width: 109px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    }

    .event{
        color: #a1f3ff;
    }

    .todo{
        color: #ffc1e3;
    }
    
    .note{
        color: #ffffff;
    }
</style>