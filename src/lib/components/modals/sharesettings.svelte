<script type="text/javascript" lang="ts">

    import {global_session} from '$lib/js/applicationstore';

    import * as API from '$lib/js/request';
    import {flip} from 'svelte/animate';
    import Messagemodal from '../controls/messagemodal.svelte';
    import Toggle from '../controls/toggle.svelte';

    let session_id: string;

    let z: number = 0;

    let username_add: string;

    let msgbox: Messagemodal;

    let sharing_enabled: boolean = false;

    global_session.subscribe((k) => {session_id = k});

    export let visible = false;

    export let callback_refresh: Function;

    let collection_id: number;

    export function call(c: number){
        collection_id = c;
        shared_users = [];
        visible = true;
        getUsers();
        username_add = '';
    }

    let shared_users: any = [];

    function getUsers(){
        let request = {
            session_id: session_id,
            collection_id: collection_id
        };

        console.log(request);

        API.Post('collections/getshares',
            request,
            (res: any) => {
                shared_users = res.data.shared_users;
                if(shared_users.length > 0)
                    sharing_enabled = true;
            },
            () => {msgbox.call('Unable to get shared users')}
        )
    }

    function remove(name: string){
        shared_users = shared_users.filter((u) => u != name);
    }

    function add(){
        if(shared_users.filter((u) => u == username_add.trim()).length > 0)
        {
            msgbox.call('Already added user.');  
            return; 
        }

        let request: any = {
            session_id: session_id,
            username: username_add.trim()
        };

        API.Post(
            'share/validate',
            request,
            (r: any) => {
                let d = r.data;

                if(d.validated){
                   shared_users = shared_users.concat(d.username);
                   sharing_enabled = true;
                }else{
                    msgbox.call('Invalid username');
                }
            },
            () => {
                msgbox.call(`Couldn't validate username`);
            }
        );

        username_add = '';
    }

    function commit(){
        let user_ids: Array<number> = [];

        shared_users.forEach(element => {
                user_ids.push(element);
        });

        if(!sharing_enabled)
            user_ids = [];

        let request = {
            session_id: session_id,
            collection_id: collection_id,
            shared_users: user_ids
        };

        console.log(request);

        API.Post('collections/commitshares',
            request,
            (data: any) => {
                msgbox.call('Shared users updated');
                visible = false;
                callback_refresh();
            },
            () => {msgbox.call('Unable to set shared users')}
        )


    }

</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->

<Messagemodal bind:this={msgbox}/>

{#if visible}
<div on:click={() => {visible = false;}} class="modal2" style="display: block;">
    <div on:click={(e) => {e.stopPropagation()}} class="modal3-content" id="modalcontent">
    <div class="title">
        Sharing
        <div>
            <Toggle bind:value={sharing_enabled}/>
        </div>
    </div>
        <div class="input-row">
        <input bind:value={username_add} placeholder="Enter username"/> <button on:click={add}>Add</button>
    </div>
    <div class="users">
        {#each shared_users as user}
        <div class="user">
            <span class="material-symbols-outlined">person</span>
            {user}
            <span on:click={()=>{remove(user)}} class="material-symbols-outlined">close</span>
        </div>
        {/each}
    </div>
    <div>
        <button on:click={() => {visible = false;}} class="cancel">
            Cancel
        </button>
        <button on:click={commit}>
            Accept
        </button>
    </div>
    </div>
</div>
{/if}

<style>   

.title{
    color: #dfdfdf;
    font-family: Poppins;
    font-size: 15px;
    position: relative;
    margin-top: 10px;
}

.title div{
    display: inline;
    position: relative;
    top: 3px;
}

.users{
    text-align: left;
    padding-top: 0px;
    padding-left: 10px;
    padding-bottom: 20px;
}

.input-row{
    padding: 15px 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #2a2a2a;
}

.user{
    font-family: Raleway;
    color: #ffffff;
    font-size: 14px;
    padding: 5px 10px;
    margin-top: 5px;
}

.user span{
    font-size: 18px;
    position: relative;
    top: 5px;
    margin: 3px 8px;
    color: #a8a8a8;
}

input{
    background-color: rgb(0, 0, 0);
    border-radius: 50px;
    color: #ffffff;
    border: none;
    font-size: 16px;
    width: 120px;
    height: 25px;
    position: relative;
    padding: 5px 15px;
    font-family: Poppins;
}

input::placeholder{
    font-size: 13px;
    color: #aaaaaa;
}

input:focus-visible{
    outline: none;
    border: none;
}

button{
    margin-left: 10px;
    font-size: 13px;
    font-family: 'Poppins';
    font-weight: 500;
    margin-right: 0px;
    display: inline-block;
    color: #000000;
    /* border: 1px solid #ffffff; */
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

button.cancel{
    border: 1px solid #aaaaaa;
    background-color: transparent;
    color: #ffffff;
}

.modal3-content {
    text-align: center;
    border-radius: 20px;
    background-color: #191919;
    color: #000000;
    margin: 30% auto;
    padding: 10px 10px;
    width: 250px;
    animation: modal-zoomin 0.2s;
}

.modal2 {
    display: none;
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