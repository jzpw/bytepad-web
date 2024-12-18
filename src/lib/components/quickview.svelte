<script type="text/javascript" lang="ts">
    import {global_session} from '$lib/js/applicationstore';
    import { Datetime_T } from '$lib/js/datetime';
    import * as API from '$lib/js/request';
    import Confirmmodal from './controls/confirmmodal.svelte';
    import Datetime from './controls/datetime.svelte';
    import Messagemodal from './controls/messagemodal.svelte';
    import File from '$lib/components/file.svelte';
    import { swipe } from 'svelte-gestures';

    export let edit_callback: Function;

    export let callback_refresh: Function;

    let session_id: string;

    global_session.subscribe((k) => {session_id = k});

    let active: boolean = false;
    let item_id: number;
    let item_type: number;

    let icon: string = 'note';
    let title: string = '';
    let content: string = '';
    let collection: string = '';
    let date: string = '';
    let pinned: boolean = false;
    let files: any = [];
    let shared_item: boolean = false;

    let todo_complete: boolean = false;
    let todo_icon: string = 'circle';
    $: todo_icon = todo_complete ? 'done' : 'circle';

    let event_datetime: Datetime_T;

    let confirmmodal: Confirmmodal;
    let messagebox: Messagemodal;

    export function call(id: number){
        item_id = id;
        console.log(id);
        fetch();
    }

    function close(){
        active = false;
    }

    function fetch(){
        let request = {
            session_id: session_id,
            item_id: item_id
        };

        API.Post(
            'item/getitem',
            request,
            (result: any) =>
                {
                    //Check for valid data
                    if(!result['ok']){
                        messagebox.call(result.error);
                        return;
                    }

                    let data = result.data;

                    item_type = data.type;
                    icon = getIcon(data.type);
                    title = data.title;
                    content = data.content;
                    collection = data.collection;
                    date = data.created_on;
                    pinned = data.pinned;
                    files = data.files;
                    todo_complete = item_type == 1 ? data.todo_complete : false;
                    event_datetime = Datetime_T.fromStrings(data.due_date, data.start_time);
                    shared_item = data.shared_item;

                    console.log("QV:");
                    console.log(data);

                    active = true;
                },
            (response: Response) =>
                {
                    active = false;
                    console.log("Failed to fetch item");
                    console.log(Response);
                }
        );
    }

    function getIcon(t: number)
    {
        switch(t){
            case 0: return 'note';
            case 1: return 'check';
            case 2: return 'today';
            default: return 'draft';
        }
    }

    function togglePin(){
        let request = {
            session_id: session_id,
            pin: !pinned,
            unpin: pinned,
            item_id: item_id
        };

        API.Post("item/itemaction",
        request,
        ()=>{
            pinned = ! pinned;

            callback_refresh();
        },
        ()=>{
            console.log("Request failed");
        }
        );
    }

    function deleteBtn(){
        confirmmodal.call(
            "Delete this item?",
            deleteItem,
            ()=>{}
        );
    }

    function deleteItem(){
        let request = {
            session_id: session_id,
            delete: true,
            item_id: item_id
        };

        API.Post("item/itemaction",
        request,
        ()=>{
            messagebox.call("Item deleted");
            callback_refresh();
            active = false;
        },
        ()=>{
            console.log("Request failed");
        }
        );
    }

    function doneClicked(){
        let request = {
            session_id: session_id,
            complete: !todo_complete,
            uncomplete: todo_complete,
            item_id: item_id
        };

        console.log(request);

        API.Post("item/itemaction",
        request,
        ()=>{
            callback_refresh();
            todo_complete = !todo_complete;
        },
        (response: Response)=>{
            console.log("Request failed");
            console.log(response);
        }
        );
    }
</script>

<Messagemodal bind:this={messagebox}/>
<Confirmmodal bind:this={confirmmodal}/>

{#if active}

    <div on:click={() => {active = false}} class="modal2">
        <div
        on:click={(e) => {e.stopPropagation()}} class="modal2-content">
                    <div class="thumb-icon">
                        <i id="quickview-icon" class="material-symbols-outlined">{icon}</i>
                    </div>
            <div class="quickview-toolbar">
                {#if !shared_item}
                <div on:click={deleteBtn}>
                    <i class="material-symbols-outlined">delete</i>
                </div>
                {/if}
                <div on:click={togglePin} class:pinned={pinned}>
                    <i id="quickview_pin" class="material-symbols-outlined" style="transform: rotate(45deg);">push_pin</i>
                </div>
                <div on:click={() => {close(); edit_callback(item_id);}}>
                    <i class="material-symbols-outlined">edit</i>
                </div>
                <div class="esc">
                    <i on:click={close} class="material-symbols-outlined">close</i>
                </div>
            </div>

            <div class="title-modal" id="title-qv">
                {#if item_type == 1}
                <span on:click={doneClicked} class="tick">
                        <i class="material-symbols-outlined">{todo_icon}</i>
                </span>
                {/if}
                <span id="modal-title" class:struck={todo_complete} style="padding-left:10px;">{title}</span>
            </div>
            {#if item_type == 2}
            <Datetime clickable={false} value={event_datetime} />
            {/if}
            <div id="modal-content" class="content-modal" style="min-height: 50px;">
                {content}
            </div>

            <div id="quickview-files" class="scrollbox" style="
                max-height: 30vh;
                overflow-y: auto;
                margin-top: 10px;
            ">
            {#each files as file}
                <File deletable={false} file={file} item_id={item_id}/>
            {/each}
        </div>
            <div id="modal-content" class="content-modal">
                <span style="float: left;">
                    <div id="quickview-cat" class="cat-box">{collection}</div>
                </span>
                <span style="float: right;">
                    <div id="quickview-date" class="date">{date}</div>
                </span>
            </div>
        </div>
    </div>
{/if}

<style>
    #quickview-files{
        display: grid;
        grid-template-columns: 50% 50%;
    }

    .struck{
        color: #888888 !important;
        text-decoration: line-through;
    }

    .tick i{
        padding-left: 10px;
        position: relative;
        top: 3px;
        font-size: 20px;
        color: #aaaaaa;
    }

    .modal2 {
    position: fixed;
    z-index: 1300;
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    animation: fadein 0.2s;
    background-color: #0000005a;
}

.pinned{
    box-shadow: 0px 2px 0px 0px #60b796;
}

.pinned i{
    color: #ffffff;
}

.modal2-content {
    overscroll-behavior: contain;
    bottom: 0;
    border-radius: 15px 15px 0px 0px;
    background-color: #000000;
    margin: 0 auto;
    padding: 20px;
    width: -webkit-fill-available;
    animation: slidein-btm 0.2s;
    position: fixed;
    white-space: pre-line;
}

.quickview-toolbar {
    position: relative;
    top: -10px;
    right: 5px;
    padding: 2px 3px 0px 0px;
    /* width: 100%; */
    text-align: right;
    border-radius: 10px;
    color: #060606 !important;
}
.quickview-toolbar div {
    text-align: left;
    font-size: 12px;
    display: inline-block;
    margin: 4px;
    padding: 4px 6px 2px 6px;
    color: #555555;
    font-family: 'Poppins';
    font-size: 14px;
    cursor: pointer;
    height: 24px;
}
.quickview-toolbar div i {
    top: 2px;
    position: relative;
    font-size: 18px !important;
    color: #ffffff;
    font-variation-settings: 'FILL' 0, 'wght' 100, 'GRAD' 200, 'opsz' 24;
}

.title-modal {
    color: #ffffff;
    font-size: 20px;
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    margin-bottom: 8px;
}
.content-modal {
    line-height: 22px;
    margin-top: 5px;
    font-family: 'Inter';
    color: #ffffff;
    padding: 8px 10px;
    font-size: 14px;
    max-height: 65vh;
    overflow: auto;
}
.cat-box {
    margin-right: 6px;
    margin-bottom: 8px;
    display: inline-block;
    -webkit-transition: background 400ms;
    transition: background 400ms;
    cursor: pointer;
    text-align: center;
    font-family: Inter,Arial,Helvetica,sans-serif;
    font-size: 12px !important;
    color: #bcbcbc;
    background-color: #171717;
    height: 20px;
    font-weight: 400;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 100%;
}

.date {
    background: transparent;
    color: #ffffff !important;
    cursor: auto;
}
.thumb-icon {
    position: absolute;
    top: -16px;
    left: 40px;
    background-color: #ffffff00;
    padding: 3px;
    border-radius: 27px;
    width: 25px;
    text-align: center;
}

    .thumb-icon i{
        color: #ffffff;
            font-size: 24px;
            font-variation-settings: 'wght' 300;
            position: relative;
            top: 1px;
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
        transform: translateY(100px);
    }

    to {
        opacity: 1;
        transform: translateY(0px);
    }
}

</style>