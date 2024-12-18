<script type="text/javascript" lang="ts">

    import {Types} from '$lib/js/types';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
    import Empty from './empty.svelte';
    import {global_session} from '$lib/js/applicationstore';
    import * as API from '$lib/js/request';
    import Messagemodal from '../controls/messagemodal.svelte';
    import Confirmmodal from '../controls/confirmmodal.svelte';
    import Createcollectionmodal from '../modals/createcollectionmodal.svelte';
    import Sharesettings from '../modals/sharesettings.svelte';
    import { swipe } from 'svelte-gestures';

    export let loaded: any;

    let items: Array<Types.Item_T> = [];

        $: items = loaded.results;

    let collection: Types.Collection_T | null;

        $: collection = loaded.collection;

    let collection_id: number = -1;

        $: if(collection) collection_id = collection.id;

    $: console.log('Owned: ' + collection?.owned);

    export let callback_close: Function;
    export let callback_item: Function;
    export let callback_refresh: Function;
    
    let session_id: string;
    global_session.subscribe((k) => session_id = k);

    let archive_open: boolean = false;    

    let msgbox: Messagemodal;

    let confirmbox: Confirmmodal;

    let renamebox: Createcollectionmodal;

    let multiselect: boolean = false;

    let shareSettings: Sharesettings;

    $: {
        if(multiselect == false)
            items.forEach(
            function(item, index, array){
                items[index].multiselected = false;
            }
        );
    }

    function selectMulti(id: number){
        let n = items.findIndex((i) => i.id == id);
        items[n].multiselected = !items[n].multiselected;
    }

    function makeDefault(){
        let request = {
            session_id: session_id,
            make_default: true,
            id: collection?.id
        };

        API.Post(
            "collections/commitcollection", 
            request,
            function(r: any){callback_refresh();
            },
            function(error: Response){}
        );
    }

    function renameCollection(){
        renamebox.callRename(collection?.id ?? -1, collection?.name ?? '');
    }

    function deletePrompt(id: number)
    {
        confirmbox.call(
            "Delete this item?",
            ()=>{
                itemDelete(id);
            },
            ()=>{}
        );
    }

    function itemDelete(id: number){
        let request = {
            session_id: session_id,
            item_id: id,
            delete: true,
        };

        API.Post("item/itemaction",
            request,
            (data: any) => {
               items = items.filter(item => item.id != id);
            },
            (response: Response) => {
                msgbox.call("Something went wrong");
                console.log(response);
            }
        )

    }

    function itemArchive(id: number, undo: boolean){
        let request = {
            session_id: session_id,
            item_id: id,
            archive: !undo,
            unarchive: undo
        };

        API.Post("item/itemaction",
            request,
            (data: any) => {
                msgbox.call(`${undo ? 'Una' : 'A'}rchived item`);

                items[items.findIndex((i) => i.id == id)].archived = !undo;
            },
            (response: Response) => {
                msgbox.call("Something went wrong");
                console.log("Error");
            }
        )
    }

    function itemClicked(id: number)
    {
        if(!multiselect)
            callback_item(id);
        else
            selectMulti(id);
    }

    function deleteCollection()
    {
        let confirmation_text: string = '';

        if(collection?.owned)
            confirmation_text = 'Are you sure you want to delete ' + collection?.name + ' and all its items?';
        else
            confirmation_text = 'Are you sure you want to remove ' + collection?.name + ' from your shared collections?';
        
           

        confirmbox.call(
            confirmation_text,
            deleteCollectionConfirmed,
            ()=>{}
        );
    }

    function deleteCollectionConfirmed()
    {
        let request = {
            session_id: session_id,
            delete: true,
            id: collection?.id ?? -1
        }

        API.Post(
            "collections/commitcollection",
            request,
            ()=>{callback_close(); callback_refresh()},
            (response: Response)=>{console.log(response)}
        )
    }

    function onSwiped(event: any){
        if(event.detail.direction == 'right'){
            callback_close();
        }
    }

</script>

<Sharesettings callback_refresh={callback_refresh}  bind:this={shareSettings}/>
<Createcollectionmodal rename={true} callback_done={callback_refresh} bind:this={renamebox}/>
<Confirmmodal bind:this={confirmbox}/>
<Messagemodal bind:this={msgbox}/>

<div use:swipe={{ timeframe: 300, minSwipeDistance: 100, touchAction: 'pan-y'}} on:swipe={onSwiped} class="container">
<div class="section-header" id="recent-items-header" style="">
    <i on:click={callback_close} class="material-symbols-outlined collection-close-icon" style="display: inline-block;">chevron_left</i>
    <span on:click={renameCollection} class="section-title" id="items-header" style="
    padding: 0px ;">{collection?.name}</span>
</div>

<div id="collection-tbar-menu">  
    <i id="" on:click={()=>{multiselect = !multiselect}} class:button-on={multiselect} class="material-symbols-outlined collection-close-icon">sweep</i>
    {#if collection?.owned}
    <i on:click={()=>{shareSettings.call(collection.id)}} id="" class:highlighted={collection.shared} class="material-symbols-outlined collection-close-icon" >co_present</i>
    <i on:click={makeDefault} class="material-symbols-outlined collection-close-icon" class:fave={collection?.user_default}>favorite</i>
    {/if}
    <i on:click={deleteCollection} id="" class="material-symbols-outlined collection-close-icon">{collection?.owned ? 'delete' : 'backspace'}</i>
</div>

{#if (!collection?.owned) || collection.shared}
<div on:click={()=>{if(collection?.owned) shareSettings.call(collection.id)}} style="" class="sharedwith-div">
    <span class="sharedwith-tag">{collection?.owned ? 'Shared with other users' : 'Shared with you'}</span>
</div>
{/if}
{#if items.filter((i) => !i.archived).length < 1}
    <Empty/>
{/if}
<div class="items-list">
    {#each items.filter((i) => !i.archived) as item (item.id)}
    <div class:shared={item.shared_with} animate:flip={{ duration: 500 }} id="item-5596" class="item   note"  class:selected={item.multiselected} style="">
        <table class="item-table" style="width:100%; height:100%;">
            <colgroup>
                <col style="width:20%">
                <col style="width:40%">
                <col style="width:20%">
                <col style="width:20%">
            </colgroup>
            <tbody>
            <tr on:click={() => itemClicked(item.id)} style="border:none;">
                <td colspan="4" class="item-title">
                    <div class="item-title-container">
                        {item.title}
                    </div>
                </td>
            </tr>
            <tr on:click={() => itemClicked(item.id)} style="border: none;">
                <td colspan="2" class="item-content">
                    
                </td>
                <td colspan="2" style="text-align:right;">
                    <div class={"cat-tag " + Types.ItemTypeToString(item.item_type)}>
                        {item.collection?.toUpperCase()}
                    </div>
                </td>
            </tr>
            <tr class="item-content">
                <td>
                    <a><span class="icon-item material-symbols-outlined item-tick">edit</span></a>
                </td>
                <td style="text-align: center;">
                    <div class="date-tag">
                        {item.modified_on}
                    </div>
                </td>
                <td on:click={()=>{itemArchive(item.id, false)}} style="text-align:right;">
                    <a><span class="icon-item material-symbols-outlined item-tick">archive</span></a>
                </td>
                <td style="text-align:right;" class="toolbar-left-border">
                    <a on:click={()=>{deletePrompt(item.id)}} ><span id="delete-btn-5596" class="icon-item material-symbols-outlined item-tick item-command">delete</span></a>
                </td>
            </tr>
        </tbody></table>
    </div>
    {/each}
</div>
    {#if (items.filter((i) => i.archived)).length > 0}
    <div class="button-holder">
        <button on:click={()=>{archive_open = !archive_open}} class="bin-button">
            Archived
            <span class="material-symbols-outlined">
                {archive_open ? 'close' : 'archive'}
            </span>
        </button>
    </div>
    {#if archive_open}
        <div class="items-list">
        {#each items.filter((i) => i.archived) as item (item.id)}
        <div class:shared={item.shared_with} transition:fade animate:flip={{ duration: 500 }} id="item-5596" class="item archived  note" class:selected={item.multiselected} style="">
                <table class="item-table" style="width:100%; height:100%;">
                    <colgroup>
                        <col style="width:20%">
                        <col style="width:40%">
                        <col style="width:20%">
                        <col style="width:20%">
                    </colgroup>
                    <tbody>
                    <tr on:click={() => itemClicked(item.id)} style="border:none;">
                        <td colspan="4" class="item-title">
                            <div class="item-title-container">
                                {item.title}
                            </div>
                        </td>
                    </tr>
                    <tr on:click={() => itemClicked(item.id)} style="border: none;">
                        <td colspan="2" class="item-content">
                            
                        </td>
                        <td colspan="2" style="text-align:right;">
                            <div class={"cat-tag " + Types.ItemTypeToString(item.item_type)}>
                                {item.collection?.toUpperCase()}
                            </div>
                        </td>
                    </tr>
                    <tr class="item-content">
                        <td>
                            <a><span class="icon-item material-symbols-outlined item-tick">edit</span></a>
                        </td>
                        <td style="text-align: center;">
                            <div class="date-tag">
                                {item.modified_on}
                            </div>
                        </td>
                        <td on:click={()=>{itemArchive(item.id, true)}} style="text-align:right;">
                            <a><span class="icon-item material-symbols-outlined item-tick">unarchive</span></a>
                        </td>
                        <td style="text-align:right;" class="toolbar-left-border">
                            <a on:click={()=>{deletePrompt(item.id)}} ><span id="delete-btn-5596" class="icon-item material-symbols-outlined item-tick item-command">delete</span></a>
                        </td>
                    </tr>
                </tbody></table>
            </div>
        {/each}
        </div>  
    {/if}
    {/if}

</div>
<style>

#collection-tbar-menu{
    display: block;
    float: right;
    color: #ffffff;
    margin-right: 10px;
    margin-bottom: 15px;
}

.highlighted{
    color: #d14c4c;
    border-radius: 20px;

}

.container{
    min-height: 50vh;
}
.sharedwith-div{
    text-align: right;
    margin: 0px 20px 20px 10px;
}

.shared:after{
  content: '';
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 30px 30px 0;
  border-color: transparent #153648 transparent transparent;
  right: 0;
  top: 0;
  position: absolute;
}

.sharedwith-tag{
    font-family: Poppins;
    font-size: 13px;
    font-weight: 300;
    color: var(--sharedwith-tag);
    border-radius: 30px;
    background-color: var(--sharedwith-tag-bg);
    border: 1px solid var(--sharedwith-tag-border);
    padding: 5px 13px;
    
}

.sharedwith-tag span{
    color: #eef9ff !important;
}

.button-on {
    border-radius: 40px;
    background-color: #222222;
    color: #adffe7 !important;
}

.selected{
    border: 1px solid var(--item-selected-border) !important;
    background-color: var(--item-selected) !important;
}

.button-holder{
        margin-top: 70px;
        text-align: center;
        margin-bottom: 20px;
    }

    .bin-button {
    margin: 0px 10px;
    background-color: #1f1f1f;
    color: #ffffff;
    border:none;
    font-size: 13px;
    font-family: Poppins;
    font-weight: 400;
    padding: 8px 16px;
    border-radius: 10px;
}

    .bin-button span{
        margin-left: 5px;
        font-size: 18px;
        position: relative;
        font-weight: 250;
        top: 4px;
    }

    .collection-close-icon{
        font-variation-settings: 'wght' 250;
        font-size: 22px;
        margin-right: 10px;
    }

    .section-header {
        margin-top: 30px;
        font-family: Montserrat,Arial,Helvetica,sans-serif;
        color: #ffffff;
        font-weight: 500;
        font-size: 18px;
        padding: 2px 14px 10px 16px;
    }

    .section-title{
        top: -5px;
        position: relative;
    }

    .items-list{
        clear: both;
        display: grid;
        /*grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));*/
        grid-template-columns: 1fr 1fr;
        grid-gap: 18px;
        margin: 0px 15px;
    }

    .item table{
        table-layout: fixed;
        width: 100%;
    }


    .item {
    overflow:hidden;
    position: relative;
    border-radius: 6px;
    height: 110px;
    cursor: pointer;
    transition: background-color linear 200ms, opacity linear 750ms;
    top: 0;
    font-family: Poppins,Arial,Helvetica,sans-serif;
    color: #ffffff;
    font-weight: 500;
    font-size: 15px;
    padding: 14px 15px 0px 15px;
    background-color: #1e1e1a;
    border: 1px solid transparent;
    }


    .item:hover{
        background-color: var(--item-hover-bg);
    }

    .archived{
        opacity: 0.6;
    }

    .item-title-container {
    top: -6px;
    position: relative;
    overflow:hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    text-overflow: ellipsis;
    height: 40px;
    -webkit-box-orient: vertical;
}

    .cat-tag {
        max-width: 125px;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
        width: fit-content;
        float: right;
        text-align: center !important;
        font-weight: normal;
        margin-top: 0;
        margin-bottom: 0px;
        padding: 5px 7px 5px 7px;
        background-color: #2c2c2c;
        border-radius: 8px;
        color: #c3c3c3;
        font-size: 10px;
        letter-spacing: 0.5px;
        font-family: 'Inter';
        opacity: 0.7;
    }

        .cat-tag.event {
        color: #ffffff;
        background-color: #2d0e0e;
        }
        .cat-tag.note {
        color: #ffffff;
        background-color: #052738;
        }
        .cat-tag.todo {
        color: #ffffff;
        background-color: #172e0b;
        }

    .date-tag {
    width: fit-content;
    margin: auto;
    text-align: center !important;
    font-weight: normal;
    margin-top: 0;
    margin-bottom: 0px;
    padding: 1px 7px;
    border-radius: 8px;
    color: #a8a8a8;
    font-size: 11px;
}

    .icon-item{
        font-size: 22px;
        font-variation-settings: 'wght' 250;
    }

    .fave{
        font-variation-settings: 'FILL' 1;
        color: #ad3232;
    }

</style>