<script type="text/javascript" lang="ts">
    import { applyAction } from "$app/forms";
    import type { Types } from "$lib/js/types";
    import * as API from '$lib/js/request';
    import {global_session} from '$lib/js/applicationstore';

	import { flip } from 'svelte/animate';

    import Datetime from "./controls/datetime.svelte";
	import { fade } from 'svelte/transition';
    import File from "./file.svelte";
    import TextArea from "./controls/textarea.svelte";
    import Toggle from "./controls/toggle.svelte";
    import { Datetime_T } from "$lib/js/datetime";
    import Uploadfile from "./modals/uploadfile.svelte";
    import Confirmmodal from "./controls/confirmmodal.svelte";
    import Messagemodal from "./controls/messagemodal.svelte";

    let session_id: string;

    global_session.subscribe((k) => {session_id = k});

    //State parameters
    export let active = false;
    export let callback_close: Function;

    let saving_enabled: boolean = false;
    let item_id: number | null;
    let first_save: boolean = false;

    let document_empty: boolean = true;

    //Autosaving
    let autosave_timeout: number;
    let saving_now: boolean = false;

    //File upload/download
    let upload_dialog_visible: boolean = false;

    //Item Parameters
    let item_type: number = 2;
    let title: string = '';

    let event_datetime: Datetime;

    let datetime_value: Datetime_T;

    let selected_collection: number;

    let recurrence_type: number;

    let msgbox: Messagemodal;

    let confirmbox: Confirmmodal;

    let textbox_content: string;

    let shared_item: boolean;
    let created_by: string = '';

    let title_placeholder: string;
    $: title_placeholder = 'Untitled ' + (() =>
    {
        switch(item_type){
            case 0: return 'Note';
            case 1: return 'Todo';
            case 2: return 'Event';
            default: return 'Item';
        }
    }
    )();

    export let collections: Array<Types.Collection_T> = [];

    let files: Types.File_T = [];

    let event_repeats = [
        {id: 0, name: 'Once'},
        {id: 1, name: 'Daily'},
        {id: 2, name: 'Every other day'},
        {id: 3, name: 'Weekly'},
        {id: 4, name: 'Two Weekly'},
        {id: 5, name: 'Four Weekly'},
        {id: 6, name: 'Every 30 Days'},
        {id: 7, name: 'Monthly'},
        {id: 8, name: 'Yearly'}
    ];

    export function setCollection(n: number){
        selected_collection = n;
    }

    export function newItem(){
        //Clear fields
        document_empty = true;
        item_id = null;
        title = '';
        textbox_content = '';
        setDefaultCollection();
        recurrence_type = 0;
        item_type = 0;
        shared_item = false;
        created_by = '';

        //Assign state
        active = true;
        saving_enabled = false;
        files = [];
    }

    function setDefaultCollection(){
        let found = collections.find((e) => e.userdefault) ?? null;

        if(found)
            selected_collection = found.id;
        else
            selected_collection = collections[0]?.id ?? 0;
    }

    function saveClose(){
        if(document_empty)
        {
            active = false;
            return;
        }
        save(saving_enabled, true);
    }

    function deleteBtn(){
        if(!saving_enabled){
            active = false;
            return;
        }

        confirmbox.call(
            "Delete this item?",
            ()=>{
                itemDelete(item_id);
            },
            ()=>{}
        );
    }

    function itemDelete(id: number | null){
        if(!id)
            return;

        let request = {
            session_id: session_id,
            item_id: id,
            delete: true,
        };

        API.Post("item/itemaction",
            request,
            (data: any) => {
                msgbox.call("Item deleted");
                active = false;
                callback_close();
            },
            (response: Response) => {
                msgbox.call("Something went wrong");
                console.log(response);
            }
        )

    }

    function deleteFile(id: number){
        var formData = new FormData();
        formData.append('session_id', session_id);
        formData.append('type', '1');
        formData.append('item_id', item_id?.toString() ?? '');
        formData.append('file_id', id.toString());

        console.log(formData);

        API.PostForm(
            'item/fileaction',
            formData,
            (data: any) => {
                console.log(data);
                if(data.ok)
                    files = files.filter((file) => file.file_id != id);
                    msgbox.call("File deleted.");
            },
            (r: Response) => {
                console.log(r);
            }
        );
    }

    function startingUpload(n: number){
    }

    function filesUploaded(f: any){
        files = files.filter((f: any) => !f.skeleton).concat(f.data);
    }

    function inputChanged(){
        document_empty = false;

        if(saving_now)
            return;

        clearTimeout(autosave_timeout);
        autosave_timeout = setTimeout(() => {
            save(saving_enabled, false);
            console.log("Autosaving now...");
        } ,2000);
    }

    function save(append: boolean, exit_on_complete: boolean){
        clearTimeout(autosave_timeout);
        saving_now = true;
        document_empty = false;

        let item = {
            id: item_id ?? 0,
            type: item_type,
            collection_id: selected_collection,
            title: (title == '') ? title_placeholder : title,
            content: textbox_content,
            due_date: item_type == 2 ? datetime_value.getDateString() : null,
            start_time: datetime_value.has_time ? datetime_value.getTimeString() : '',
            recurrence_type: recurrence_type,
            remind: 0,
            completed: 0
        };

        var request = {
        session_id: session_id,
        append: append,
        create_version: true,
        item: item
        };

        console.log(request);

        API.Post(
            'item/putitem',
            request,
            (data: any) => {
                saving_enabled = true;
                saving_now = false;

                if(data)
                    item_id = data.data;

                console.log(data);
                if(exit_on_complete)
                {
                    callback_close();
                    active = false;
                }
            },
            (response: Response) => 
            {
            console.log(response);
            saving_now = false;
            }
        );
    }

    export function openItem(id: number){
        let request = {
            session_id: session_id,
            item_id: id
        };

        API.Post(
            'item/getitem',
            request,
            (result: any) =>
                {
                    //Check for valid data
                    if(!result['ok'])
                        return;

                    
                    let data = result.data;

                    console.log(data);

                    //Load into form
                    document_empty = false;
                    title = data.title;
                    item_id = id;
                    selected_collection = data.collection_id;
                    item_type = data.type;
                    textbox_content = data.content;
                    recurrence_type = data.recurrence_type;
                    files = data.files;
                    shared_item = data.shared_item;
                    created_by = data.created_by;

                    let has_time = data.start_time != '';

                    datetime_value = Datetime_T.fromStrings(data.due_date, data.start_time);
                    
                    //Enable visibility
                    active = true;
                    saving_enabled = true;
                },
            (response: Response) =>
                {
                    console.log("Failed to fetch item");
                    console.log(Response);
                }
        );
    }

</script>

<Confirmmodal bind:this={confirmbox}/>
<Messagemodal bind:this={msgbox}/>

<Uploadfile callback_uploaded={(f) => {filesUploaded(f)}} bind:item_id_={item_id}  bind:visible={upload_dialog_visible}/>
<div class="background" class:invisible={!active}>
    
<div class="editor">
    <div class="menu">
        <button on:click={saveClose} class:saving={saving_now} class="save-btn">
            <span>
                {document_empty ? 'Close' : 'Save'}
            </span>
            <span class="material-symbols-outlined" style="
            font-size: 20px;
            padding-left: 7px;
            line-height: 10px;
            position: relative;
            top: 5px;
        ">{document_empty ? 'close' : 'save'}</span>
        </button>      

        {#if !shared_item && saving_enabled}      
        <button on:click={deleteBtn} class="save-btn inverted">
 
            <span>
                Delete
            </span>
            <span class="material-symbols-outlined" style="
            font-size: 20px;
            padding-left: 7px;
            line-height: 10px;
            position: relative;
            top: 5px;"
        >delete</span>
        </button>
        {/if}
        <button on:click={()=>{if(!saving_enabled) save(false, false); upload_dialog_visible = true;}} class="save-btn inverted" style="float:right;">
            <span>
                Attach
            </span>
            <span class="material-symbols-outlined" style="
            font-size: 20px;
            padding-left: 7px;
            line-height: 10px;
            position: relative;
            top: 5px;
        ">attach_file_add</span>
        </button>
    </div>

    <div class="editor-title">
        <input on:input={inputChanged} bind:value={title} placeholder="{title_placeholder}" class="title-input"/> 
        <span class="underline"></span>
    </div>
    {#if shared_item}
    <div class="editor-subtitle">
        Created by <span>{created_by}</span>
    </div>
    {/if}
    {#if item_type == 2}    
    <div style="width: 100%; margin-bottom: 10px; text-align: right;">   
        <Datetime clickable={true} bind:this={event_datetime} bind:value={datetime_value}/>     
    </div>
    <div class="editor-settings" style="text-align:right;">
        <span class=" small-icon material-symbols-outlined">
            notifications_active
        </span>
        <Toggle/>
        <span style="margin-left: 10px;">
        </span>
        <select on:input={inputChanged} bind:value={recurrence_type} class="collection-select">
            {#each event_repeats as {id, name}}
            <option value={id}>{name}</option>
            {/each}
          </select>        
          <span class=" small-icon material-symbols-outlined">
            event_repeat
        </span>

    </div>
    {/if}
   <div class="editor-settings" style="">
        <div>
            <span class:selected={item_type == 0}>
                <i on:click={() => item_type = 0} class="material-symbols-outlined">note</i>
            </span>
            <span class:selected={item_type == 1}>
                <i on:click={() => item_type = 1} class="material-symbols-outlined">done</i>
            </span>
            <span class:selected={item_type == 2}>
                <i on:click={() => item_type = 2} class="material-symbols-outlined">today</i>
            </span>
        </div>

        <select on:input={inputChanged} bind:value={selected_collection} class="collection-select">
            {#each collections as {id, name}}
            <option value={id}>{name}</option>
            {/each}
          </select>
    </div>
    <div class="file-grid">
        {#each files as file (file.file_id)}
            <div animate:flip={{ duration: 500 }} class="file-outer">
                <File callback_delete={(id)=>{deleteFile(id)}} deletable={true} bind:item_id={item_id} file={file}/>
            </div>
       {/each}
    </div>
    <div class="textbox">
        <textarea
            placeholder={"Item content..."}
            bind:value={textbox_content}/>
    </div>

</div>

</div>
<style>
    .editor-subtitle{
        margin-right: 25px;
        font-size: 13px;
        font-family: Raleway;
        margin-bottom: 15px;
        text-align: right;
    }

    .editor-subtitle span{
        color: #ffffff;
    }

    .file-grid{
        display: grid;
        grid-template-columns: 50% 50%;
        clear: both;
        padding-top: 20px;
        margin: 20px 20px;
        box-sizing: border-box;
    }

    .invisible{
        display: none;
    }

    .small-icon{
        font-variation-settings: 'wght' 200;
        font-size: 22px;
        margin: 0px 0px;
        color: #ffffff;
        position: relative;
        top: 2px;
    }

    .background{
        z-index: 1000;
        position: fixed;
        top: 0px;
        width: 100%;
        left: 0px;
        height: 100vh;
        backdrop-filter: blur(2px);
    }

    .editor {
    overscroll-behavior: contain;
    background-color: #000000;
    top: 35px;
    border-radius: 15px 15px 0px 0px;
    left: 0px;
    color: var(--editor-text);
    width: 100%;
    z-index: 1050;
    height: 100%;
    position: fixed;
    overflow-y: scroll;
    animation: slidein-btm 0.2s cubic-bezier(0.54, 1.01, 1, 1);
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


    .editor-settings{
        clear: both;
        padding: 10px 20px;
    }

    .editor-settings div{
        float: left;
    }

    .editor-settings div span i{
        font-variation-settings: 'wght' 200;
        font-size: 22px;
        margin: 0px 8px;
        color: #a8a8a8;
    }

    .editor-settings div span.selected{
        border-bottom: 2px solid #5dc192;
    }

    .editor-settings div span.selected i{
        color: #ffffff;
    }

    .menu{
        height: 50px;
        padding: 20px 20px 5px 20px;
    }

    .menu i{
        color: #e0e0e0;
        padding-top: 7px;
        font-size: 22px;
        margin-right: 20px;
        font-variation-settings: 'wght' 150;
    }

    .textbox{
        border: none;
        width: -webkit-fill-available;
        margin: 0px 20px;
    }

    .textbox textarea{
        width: -webkit-fill-available;
        border: none;
        min-height: 300px;
        border-left: 1px solid #686868;
        border-radius: 0px;
        padding-left: 10px;
        background-color: transparent;
        font-size: 16px;
        outline: none;
        color: #ffffff;
        font-family: Raleway;
    }

    .save-btn {
    float: right;
    font-size: 13px;
    font-family: 'Poppins';
    font-weight: 500;
    margin-right: 0px;
    color: #000000;
    /* border: 1px solid #ffffff; */
    width: max-content;
    padding: 6px 15px;
    background-color: #68d1d7;
    /* box-shadow: 3px 3px #357959; */
    border-radius: 51px;
    cursor: pointer;
    transition: 0.2s;
    border: none;
    border:1px solid #00000000;
    transition: all 300ms linear;
}

    .save-btn.saving{
        background-color: #000000;
        color: #4d4d4d;
        border:1px solid #2c2c2c;
    }

    .save-btn.inverted{
        float: left;
        background-color: #00000000 !important;
        border: 1px solid #a7a7a7;
        color: #ffffff;
        margin-right: 10px;
    }

    .editor-title{
        padding: 20px 20px;
        margin-bottom: 0px;
    }

    .title-input{
        background-color: transparent;
        border: none;
        border-bottom: 1px solid #00000000;
        color: #ffffff;
        font-size: 22px;
        font-weight: 300;
        font-family: Poppins, Arial, Helvetica, sans-serif;
        width: calc(100% - 20px);
        border-radius: 0px;
        margin-top: 0px;
        margin-left: 0px;
    }

    .title-input:placeholder{
        color: #1f1f1f;
    }

    .title-input:focus-visible{
        outline: none;
    }

    
    input:focus+.underline {
    transform: scale(1);
    }

    .underline {
        background-color: #356964;
        display: inline-block;
        height: 1px;
        margin-top: -4px;
        position: relative;
        top: -9px;
        -webkit-transform: scale(0, 1);
        transform: scale(0, 1);
        -webkit-transition: all 0.1s ease-in;
        transition: all 0.3s ease-in-out;
        width: 100%;
    }

    .collection-select{
        float: right;
        background-color: #00000000;
        padding: 5px 14px;
        border-radius: 10px;
        font-family: 'Raleway', Arial, Helvetica, sans-serif;
        color: #aaaaaa;
        border: none;
        width: 160px;
        font-size: 15px;
    }

</style>