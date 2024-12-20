<script type="text/javascript" lang="ts">
    import { applyAction } from "$app/forms";

    import * as API from '$lib/js/request';

    import { global_session } from "$lib/js/applicationstore";
    import Usermenu from "../modals/usermenu.svelte";

    let session_id: string;

    global_session.subscribe((k) => {session_id = k});

    export let placeholder;

    export let active: boolean = false;

    let search_term: string = '';
    export let search_collection: number;

    let results: any = [];

    export let callback_result_clicked: Function;

    let search_timeout: any;

    let more_available: boolean = false;

    $: active = (search_term != '');

    $: if(search_term == '') more_available = false;

    $: 
    {
        clearTimeout(search_timeout);
        search_timeout = setTimeout(()=>loadResults(search_term), 250);
    };

    function buttonClicked(){
        if(active)
            search_term = '';
        else
            return;
    }

    function loadResults(term: string){

        let max_results: number = 5;

        if(term == '')
        {
            results = [];
            return;
        }

        let request = {
            session_id: session_id,
            multiple: true,
            order: 0,
            search_term: term.trim(),
            collection_id: search_collection,
            top_items: max_results
        };

        API.Post('item/getitem',
            request,
            (data: any)=>{
                results = [];

                results = data?.results;

                if(results.length > max_results -1)
                {
                    results = results.slice(0, -1);
                    more_available = true;
                } else{
                    more_available = false;
                }
            },
            (response: Response)=>{
                results = [];
            }
        )        
    }

    function itemClicked(id: number){
        search_term = '';
        callback_result_clicked(id);
    }

    function getIcon(t: number){
        switch(t)
        {
            case 0: return 'note';
            case 1: return 'done';
            case 2: return 'today';
            default: return 'note';
        }
    }

</script>

<div class="displace"></div>

<div class="search-bar" style="">
    <table style="" class="search-table">
        <tbody>
            <tr style="">
                <td>
                    <input bind:value={search_term} autocomplete=off class="search-input" id="search-input" placeholder={placeholder} style="border: none;top: 2px;position: relative;width: 100%;">
                </td>
                <td on:click={buttonClicked} width="40px">
                    <span id="search-icon" class="material-symbols-outlined" style="
                        color: #aaaaaa;
                    ">{active ? 'close' : 'search'}</span>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="search-results"  class:active={active}>
        {#each results as result}
        <div on:click={() => {itemClicked(result.id)}} class="search-result">
            <span class="icon material-symbols-outlined">{getIcon(result.item_type)}</span>
            <span class="title">{result.title}</span>
            <span class="cat">{result.collection.toUpperCase()}</span>
        </div>
        {:else}
           <div class="empty">
                No results
           </div>
        {/each}
        {#if more_available}
        <span class="more material-symbols-outlined">more_horiz</span>
        {/if}

    </div>
</div>

<style>
    .displace{
        height: 35px;
    }

    .more{
        font-size: 20px;
        color: #e4e4e4;
        width: 100%;
        margin-top: 10px;
        text-align: center;
    }

    .empty{
        padding: 10px;
        font-size: 15px;
        color: #cfcfcf;
        text-align: center;
        font-family: 'Poppins';
    }
    .active{
        height: auto !important;
        visibility: visible !important;
    }

    .search-result{
        font-family: 'Poppins';
        font-weight: 350;
        font-size: 13px;
        padding: 12px 8px;
    }

    .search-result:not(:last-child){
    }

    .search-result .icon{
        font-size: 20px;
        font-weight: 250;
        padding-right: 10px;
        position: relative;
        top: 4px;
        color: var(--search-results-icon);
    }

    .search-result .cat {
    float:right;
    margin-left: 20px;
    letter-spacing: 0.5px;
    font-size: 10px;
    color: #d1d1d1;
    padding: 5px 8px;
    border-radius: 7px;
    background-color: #0d1d2c;
    position: relative;
    top: 3px;
    font-family: 'Inter';
}

    .search-results{
        backdrop-filter: blur(5px);
        padding: 10px 10px 20px 10px;
        color:#ffffff;
        width: -webkit-fill-available;
        margin: 0px -10px;
        top: 50px;
        visibility: hidden;
        transition: height 250ms ease-in-out;
        height: 0px;
        position: absolute;
        background-color:#000000e8;
        z-index: 200;
        box-shadow: 0px 5px 50px 0px rgba(0, 0, 0, 0.596);
    }

    .search-bar{
    width: -webkit-fill-available;
    margin: 22px 20px 20px 20px;
    border-radius: 13px;
    position: relative;
    background-color: #000000;
    }
    
    .search-bar:focus-within {
    }

    .search-input{
        color:var(--search-bar-text);
        background-color: #ffffff00;
        font-family: 'Raleway';
        font-size: 16px;
        margin:0px;
    }
        .search-input:focus{
            box-shadow:none;
            outline:none;
            border-bottom: 1px solid #aaaaaa;
        }
        .search-input::placeholder{
            color: #9d9d9d;
        }
        
    .search-table{
        color: #ffffff;
        width:100%;
        height: 41px;
        padding: 0px 2px 0px 12px;
        transition: border 0.3s;
    }

    #search-icon{
        font-variation-settings: 'FILL' 0, 'wght' 100, 'GRAD' 200, 'opsz' 24;
        font-family: 'Material Symbols Outlined';
        position: relative;
        top:2px;
        animation: icon-in 0.5s cubic-bezier(0.17, 0.81, 0.58, 1);
        color: var(--search-bar-icon);
    }

    @keyframes icon-in {
        from {
            left: -60px;
            opacity: 0.2;
        }

        to {
            left: 0px;
            opacity: 1;
        }
    }

</style>