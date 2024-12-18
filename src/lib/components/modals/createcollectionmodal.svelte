<script type="text/javascript" lang="ts">
    import { applyAction } from '$app/forms';


    import {global_session} from '$lib/js/applicationstore';
    import Messagemodal from '../controls/messagemodal.svelte';
    import * as API from '$lib/js/request';

    let session_id: string;

    global_session.subscribe((k) => {session_id = k});

    export let callback_done: Function;

    export let visible = false;

    export let rename: boolean = false;

    let collection_id_rename: number;

    let new_name: string = '';
    
    let working: boolean = false;

    let msgbox: Messagemodal;

    export function call(){
        new_name = '';
        rename = false;
        visible = true;
    }

    export function callRename(collection_id: number, collection_name: string){
        rename = true;
        collection_id_rename = collection_id,
        new_name = collection_name;
        visible = true;
    }

    function createRenameCollection(){
        if(!working)
            working = true;
        else
            return;

        if(new_name == ''){
            msgbox.call('Enter a name for the collection');
            return;
        }
        
        if(new_name.length > 30){
            msgbox.call('Collection name must be less than 30 characters');
        }

        let request = {
            session_id: session_id,
            id: collection_id_rename,
            append: rename,
            delete: false,
            name: new_name.trim()
        };

        API.Post(
            "collections/commitcollection",
            request,
            (data: any) => {
                callback_done();
                visible = false;
                working = false;
            },
            (response: Response) => {
                msgbox.call(`Unable to ${rename ? 'rename' : 'create'} collection`);
                working = false;
            }
        );
    }

</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->

{#if visible}
<Messagemodal bind:this={msgbox}/>

<div on:click={() => {visible = false;}} class="modal2">
    <div on:click={(e) => {e.stopPropagation()}} class="modal3-content">
    <div>
        <input bind:value={new_name} placeholder="Collection name"/>
        <div>
            <button class:working={working} on:click={createRenameCollection}>
                {rename ? 'Rename' : 'Create'}
            </button>
        </div>
    </div>
    </div>
</div>
{/if}

<style>    

input{
    font-size: 18px;
    box-sizing: border-box;
    width: 100%;
    background-color: #000000;
    padding: 8px;
    border-radius: 12px;
    font-family: Poppins;
    border: none;
    color: #ffffff;
}

input::placeholder{
    font-size: 15px;
}

input:focus {
    outline: none;
}


button{
    font-size: 13px;
    font-family: 'Poppins';
    font-weight: 500;
    margin-right: 0px;
    margin-top: 10px;
    color: #000000;
    padding: 6px 15px;
    width: 100px;
    background-color: #65c2cd;
    /* box-shadow: 3px 3px #357959; */
    border-radius: 51px;
    cursor: pointer;
    transition: 0.2s;
    border: none;
    border:1px solid #65c2cd;
    transition: all 300ms linear;
}

button.working{
    background-color: transparent !important;
    color: #c4c4c4 !important;
    border:1px solid #767676 !important;
}

.modal3-content {
    text-align: center;
    border-radius: 20px;
    background-color: #191919;
    color: #000000;
    margin: 30% auto;
    padding: 5px 5px;
    max-width: min(250px,90%);
    animation: modal-zoomin 0.2s;
}

.modal3-content div{
    padding: 5px;
}

.modal2 {
    position: fixed;
    z-index: 1100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    animation: modal-zoomin 0.2s;
}

.modal2:not(.windowed) {
    background-color: rgb(0,0,0);
    backdrop-filter: blur(2px);
    background-color: rgb(0 0 0 / 50%);
}

@keyframes modal-zoomin {
    from {
        transform: scale(1.2);
        opacity: 0.2;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

</style>