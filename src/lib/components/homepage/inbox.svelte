<script type="text/javascript" lang="ts">
    import * as API from '$lib/js/request';
    import {global_session} from '$lib/js/applicationstore';
    import Modal from '../modals/modal.svelte';

    let session_id: string;
        global_session.subscribe((k) => {session_id = k});

    let visible: boolean = false;
        $: if(visible) getInbox();

    export let items_unread: number = 0;
        $: items_unread = items.filter((i) => !i.seen).length;

    export let callback_open_item: Function;
    export let callback_open_collection: Function;

    let items: any = [];

    export function call(){
        visible = true;
        getInbox();
    }

    export function refresh(){
        getInbox();
    }

    function getInbox(){
        API.Get('inbox/getinbox/' + session_id,
            (data: any) => {items = data},
            () => {}
        );
    }

    function itemClicked(item: any){
        markAsSeen(item.id);

        console.log(item);
        if(item.type == 1)
        {
            callback_open_collection(item.collection_id);
            visible = false;
        }
        else if(item.type == 0)
        {
            callback_open_item(item.item_id);
            visible = false;
        }
    }

    function markAsSeen(item: number){
        let request = {
            session_id: session_id,
            message_id: item
        };

        API.Post('inbox/messageread',
            request,
            () => {},
            () => {}
        )
    }

</script>
{#if visible}

<div on:click={()=>{visible = false;}}  class="modal">
    <div on:click={(e)=>{e.stopPropagation()}} class="modal-content">
        <div class="title">
            <span class="material-symbols-outlined icon">inbox</span> Inbox
            <span on:click={()=>{visible = false;}} class="material-symbols-outlined icon right">close</span>
        </div>
            
        <table>
            {#each items as item}
            <tr class:seen={item.seen} on:click={()=>{itemClicked(item)}} class="item">
                <td>
                    <span class="material-symbols-outlined">{item.type == 0 ? 'edit_note' : 'folder'}</span>
                </td>
                <td>
                    {item.username}
                </td>
                <td>
                    {item.header}
                    <span class="content">{item.content}</span>
                </td>
            </tr>
            {/each}
        </table>
    </div>
</div>

{/if}

<style>
    .seen{
        opacity: 0.5;
    }

    .right{
        float: right;
        margin-right: -10px;
    }

    .modal{
        z-index: 1000;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background-color: #00000023;
        backdrop-filter: blur(2px);
        position: fixed;
    }

    .modal-content{
        background-color: #111d1e;
        border-radius: 10px;
        min-height: 100vh;
        width: 100%;
        margin:40px auto;
        overflow: hidden;
    }

    .title{
        color: #e5e5e5;
        padding: 20px 20px;
        font-size: 17px;
        background-color: #0a1415;
        font-family: Poppins;
        border-bottom: 1px solid #152720;
        margin-bottom: 25px;
    }
    
    .title span{
        font-size: 22px;
        position: relative;
        top: 5px;
        padding-right: 10px;
        font-weight: 200;
    }

    .item{
        font-family: Poppins;
        color: #d4d4d4;
        font-size: 13px;
    }

    .item td{
        padding: 15px 10px;
        border-bottom: 1px solid #163428;
    }

    table{
        width: -webkit-fill-available;
        margin: 10px 15px;
        row-gap: 10px;;
        layout: fixed;
    }

    .item td:nth-child(1) span{
        font-size: 22px;
        font-weight: 300;
        padding-right: 0px;
        position: relative;
        top: 2px;
    }

    .item td:nth-child(2)
    {
        width: 60px;
        font-weight: 400;
        padding-right: 20px;
        color: #9ddac8;
        font-size: 13px;
    }

    .item td:nth-child(3)
    {
        font-weight: 200;
        color: #c3c3c3;
    }

    .item .content{
        font-style: italic;
        color: #ffffff;
    }
</style>