<script type="text/javascript" lang="ts">
    import { applyAction } from '$app/forms';
    import {global_session} from '$lib/js/applicationstore';
    import {Types} from '$lib/js/types';
    import Messagemodal from '../controls/messagemodal.svelte';
    import * as API from '$lib/js/request';

    let session_id: string;

    global_session.subscribe((k)=>{session_id = k}); 

    let opened: boolean = false;

    let modal_undeleted: Messagemodal;

    export let items: Array<Types.Item_Summary_T> = [];

    export let callback_refresh: Function;

    function getIcon(t: number){
        switch(t)
        {
            case 0: return 'note';
            case 1: return 'done';
            case 2: return 'today';
            default: return 'note';
        }
    }

    function undelete(d: number){
        let request = {
            session_id: session_id,
            undelete: true,
            item_id: d
        };

        API.Post("item/itemaction",
        request,
        ()=>{        
            callback_refresh();
            modal_undeleted.call('This item has been restored');
        },
        ()=>{
            modal_undeleted.call('Failed to restore item')
        }
        );


 }

</script>

<Messagemodal bind:this={modal_undeleted}/>

{#if !opened}
<div class="button-holder">
    <button on:click={()=>{opened = true;}} class="bin-button">
        Recycle Bin
        <span class="material-symbols-outlined">
            auto_delete
        </span>
    </button>
</div>
{:else}
<div class="gap-top">
</div>
<div on:click={()=>{opened = false}} class="title" style="padding: 8px 13px;">
    Deleted Items
    <span class="material-symbols-outlined" style="float:right; font-size: 13px;">close</span>
</div>
<div class="grid">
    {#each items as {id, title, collection, item_type}}
        <div on:click={() => {undelete(id)}} class="item-simple">
            <span class="icon material-symbols-outlined">{getIcon(item_type)}</span><span>{title}</span>
            <span class="tag">{collection?.toUpperCase()}</span>
        </div>
    {:else}
        <div>Nothing</div>
    {/each}
</div>
{/if}
<style>
    .gap-top{
        margin: 30px auto;
        width: 50px;
        border-bottom: 1px solid #3a3a3a;
    }

    .button-holder{
        margin-top: 35px;
        text-align: center;
    }

    .bin-button{
        margin: 0px 10px;
        background-color: #1c1c1c;
        border: 1px solid #000000;
        color: #ffffff;
        font-size: 13px;
        font-family: Poppins;
        font-weight: 400;
        padding: 8px 14px;
        border-radius: 10px;
    }
    .bin-button span{
        margin-left: 5px;
        font-size: 18px;
        position: relative;
        font-weight: 250;
        top: 4px;
    }

    .closed-icon{
        text-align: center;
    }

    .closed-icon span{
        font-size: 22px;
        color: #ffffff;
    }

    .expand-btn{
        margin-top: 15px;
        color: #ffffff;
        text-align:center;
    }
    .expanded{
        max-height: unset !important;
    }

    .item-group {
        margin: 2px 3px;
        padding-bottom: 10px;
    }

    .title{
        font-size: 15px;
        margin: 1px 15px;
        font-family: 'Raleway';
        color: #ffffff;
        padding: 10px;
    }

    .grid{
        display:grid;
        grid-gap: 4px;
    }

    .item-simple {
        border-radius: 5px;
        padding: 9px 17px;
        font-family: 'Poppins';
        color: #ffffff;
        font-size: 13px;
        margin: 5px 15px;
        cursor: pointer;
        transition: background-color 0.5s;
    }

    .item-simple .icon {
        font-size: 17px;
        position: relative;
        top: 4px;
        padding: 0px;
        margin-right: 12px;
        color: #cecece;
    }

    .item-simple .tag {
    letter-spacing: 0.5px;
    float: right;
    font-size: 10px;
    color: #ffffff;
    padding: 5px 8px;
    border-radius: 7px;
    background-color: #242424;
    position: relative;
    top: 0px;
    font-family: 'Inter';
}
</style>