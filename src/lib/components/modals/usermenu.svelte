<script type="text/javascript" lang="ts">

    import {global_session} from '$lib/js/applicationstore';
    import Toggle from '../controls/toggle.svelte';

    let session_id: string;

    global_session.subscribe((k) => {session_id = k});
    
    export let visible = false;

    export function call(){
        visible = true;
    }

</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->

{#if visible}
<div on:click={() => {visible = false;}} id="uploadFile" class="modal2" style="display: block;">
    <div on:click={(e) => {e.stopPropagation()}} class="modal3-content" id="modalcontent">
        <div>
        <button>
            Change Password
        </button>
    </div>
    <div>
        <button>
            Log out
        </button>
    </div>
    </div>
</div>
{/if}

<style>    

select{
        background-color: #00000000;
        padding: 5px 14px;
        border-radius: 10px;
        font-family: 'Raleway', Arial, Helvetica, sans-serif;
        color: var(--editor-dropdown);
        border: none;
        width: 160px;
        font-size: 15px;
        margin: 10px 10px;
    }

button{
    font-size: 13px;
    font-family: 'Poppins';
    font-weight: 500;
    margin-right: 0px;
    color: #fefefe;
    /* border: 1px solid #ffffff; */
    width: 180px;
    padding: 6px 15px;
    background-color: #14263e;
    /* box-shadow: 3px 3px #357959; */
    border-radius: 51px;
    cursor: pointer;
    transition: 0.2s;
    border: none;
    transition: all 300ms linear;
}

.modal3-content {
    backdrop-filter: blur(5px);
    text-align: center;
    border-radius: 20px;
    background-color: #1e1e1eb9;
    color: #000000;
    margin: 30% auto;
    padding: 10px 10px;
    max-width: min(240px,90%);
    animation: modal-zoomin 0.2s;
}

.modal3-content div{
    padding: 5px;
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