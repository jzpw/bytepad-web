<script type="text/javascript" lang="ts">
    import { global_session } from '$lib/js/applicationstore';
    import Createcollectionmodal from '$lib/components/modals/createcollectionmodal.svelte';

    import {Types} from '$lib/js/types'

    let active_collection: Number = 0;

    export let callback: Function;

    export let callback_refresh: Function;

    export let collections: Array<Types.Collection_T> = [];

    let createmodal: Createcollectionmodal;

    function openCollection(id: Number){
        active_collection = id;
        callback(id);
    }

    export function close(){
        active_collection = 0;
    }

</script>

<Createcollectionmodal callback_done={callback_refresh} bind:this={createmodal}/>

<div class="cat-grid">
    <button on:click={()=>{createmodal.call()}} class="cat-box add">
        Add
    </button>
    {#each collections as {id, name, items_count, userdefault, shared}}
            <button on:click={() => openCollection(id)} class="cat-box" 
                class:active={id == active_collection}>
                {#if shared}
                <span class="shared material-symbols-outlined">person</span>
                {/if}
                     {name}
            </button>
    {/each}
</div>

<style>
    .cat-grid{
        margin: 20px;
    }

    .shared{
        color: #ebebeb;
        font-size: 20px;
        font-weight: 200;
        line-height: 1px;
        position: relative;
        top: 6px;
        left: -3px;
        margin-left: 0px;
    }

    .cat-box {
    overflow: hidden;
    max-width: 186px;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-tap-highlight-color: transparent;
    margin-right: 10px;
    margin-bottom: 8px;
    display: inline-block;
    -webkit-transition: background .4s;
    transition: background .4s;
    cursor: pointer;
    text-align: center;
    font-family: Poppins,Arial,Helvetica,sans-serif;
    font-size: 12px !important;
    background-color: #181818;
    color: #ffffff;
    height: 31px;
    font-weight: 400;
    border: none;
    padding: 6px 13px;
    border-radius: 20px;
    font-size: 100%;
    position: relative;
    }

    .cat-box.add{
        color: #fdfdfd;
        border: 1px solid #ffffff;
    }

    .cat-box.active{
    color: #000000 !important;
    background-color: #dedede;
    }

    .fave {
    font-size: 14px;
    color: #963c3c !important;
    padding-left: 0px !important;
    font-variation-settings: 'FILL' 1;
    position: relative;
    top: 2px;
    }
</style>