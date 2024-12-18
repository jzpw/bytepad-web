<script type="text/javascript" lang="ts">
    import { onMount } from 'svelte';
    import Collectionbar from '$lib/components/homepage/collectionbar.svelte';
    import Editor from '$lib/components/editor.svelte';
    import ItemLongGrid from '$lib/components/homepage/itemgridwide.svelte';
    import Navbar from '$lib/components/navbar.svelte';
    import Searchbar from '$lib/components/homepage/searchbar.svelte';
    import Todaybar from '$lib/components/homepage/todaybar.svelte';
    import Info from '$lib/components/homepage/info.svelte';
    import Topbar from '$lib/components/homepage/topbar.svelte';

    import {Types} from '$lib/js/types'
    import { applyAction } from '$app/forms';
    import * as API from '$lib/js/request';
    import { getStores } from '$app/stores';
    import { global_session, theme } from '$lib/js/applicationstore';
    import * as navigate from '$lib/js/navigate';

    import { writable } from 'svelte/store';

    import * as cookie from '$lib/js/cookie';
    import Itemgrid from '$lib/components/homepage/itemgrid.svelte';
    import Quickview from '$lib/components/quickview.svelte';
    import Calendar from '$lib/components/homepage/calendar.svelte';
    import Progressbar from '$lib/components/controls/progressbar.svelte';
    import Recyclebin from '$lib/components/homepage/recyclebin.svelte';
    import Inbox from '$lib/components/homepage/inbox.svelte';
    import Messagemodal from '$lib/components/controls/messagemodal.svelte';
    import Loadingcover from '$lib/components/controls/loadingcover.svelte';
    import Quickadd from '$lib/components/homepage/quickadd.svelte';

    let session_id: String = '';    

    global_session.set(cookie.Get('session_id'));
    global_session.subscribe((k) => session_id = k );
    
    let first_load: boolean = true;

    let state: Types.app_state = Types.app_state.Home;
    let collection_open: number = 0;

    let current_collection: Types.Collection_T | null;

    let search_placeholder: string = 'Search in all';
    let search_collection: number;

    $: search_placeholder = (state == Types.app_state.Home) ? 'Search in all' : 'Search in ' + current_collection?.name;
    $: search_collection = (state == Types.app_state.Collection_Open) ? (current_collection?.id ?? -1) : -1;

    let items_active: any;

    let homepage_data: any;
    
    let collections: Array<Types.Collection_T> = [];
        $: collections = homepage_data?.collections_list;

    let recents: Array<Types.Item_Summary_T> = [];
        $: recents = homepage_data?.recents_list;

    let todo: Array<Types.Item_Summary_T> = [];
        $: todo = homepage_data?.upcoming_list;

    let pinned: Array<Types.Item_Summary_T> = [];
        $: pinned = homepage_data?.pinned_list;

    let deleted: Array<Types.Item_Summary_T> = [];
        $: deleted = homepage_data?.deleted_list;

    let events_today = [];
        $: events_today = homepage_data?.events_today;
    let events_tomorrow = [];
        $: events_tomorrow = homepage_data?.events_tomorrow;

    let homepage_ready = false;

    let loadingcover: Loadingcover;

    let messagemodal: Messagemodal;

    let messages_unread: number;

    let quickview_modal: Quickview;

    let editor: Editor;
    let editor_visible: boolean = false;

    let calendar: Calendar;

    let collectionbar: Collectionbar;

    $: {
        current_collection = collections?.find((e) => e.id == collection_open) ?? null;
    }
    
    //
    // Page Initialisation
    //
    onMount(reload);

    function reload(){

        /*
        if(first_load && 'homepageCache' in window.localStorage){
            homepage_data = JSON.parse(window.localStorage.getItem('homepageCache') ?? '') ?? [];
        }
        */
        calendar.Refresh();
        inbox.refresh();

        if(state == Types.app_state.Collection_Open)
            loadCollection(collection_open);

        const request = {
            session_id: session_id,
            local_datetime: new Date()
        };

        API.Post(
            "homepage/gethomepage", 
            request,
            function(r: any){
                if(r){
                    if(first_load)
                        setTimeout(()=>{loadingcover.hide()},800);

                    first_load = false;
                    //Cache latest homepage
                    window.localStorage.setItem('homepageCache', JSON.stringify(r.data));

                    //Load current homepage
                    homepage_data = r.data;
                    console.log(homepage_data);
                    homepage_ready = true;
                }
                else{
                    console.log("nothing");
                }
            },
            function(error: Response){ console.log(error) }
        );
    }

    //
    // Collection Click Callback
    //
    function loadCollection(id: number): any{
        let request = {
            session_id: session_id,
            multiple: true,
            collection_id: id,
            order: 0
        };

        console.log(request);

        API.Post(
            "item/getitem", 
            request,
            function(r: any){ 
                if(r){
                    if(r.status == 1)
                    {
                        messagemodal.call('This collection does not exist or you don\'t have access');
                        return;
                    }
                    console.log("Collection loaded:")
                    console.log(r);
                    items_active = r;
                    state = Types.app_state.Collection_Open;
                    collection_open = id;
                }
                else{
                }
            
            },
            function(error: Response){  }
        );
    }

    //
    // Return to homepage
    //
    function returnHome(){
        state = Types.app_state.Home;
        collectionbar.close();
    }

    //
    // Open Editor in new item mode
    //
    function newItem(){
        editor.newItem();
        if(state == Types.app_state.Collection_Open)
            editor.setCollection(collection_open);
    }

    //
    // Open Editor for existing item
    //
    function editItem(id: number){
        calendar.hide();
        console.log("Editing item...");
        editor.openItem(id);
    }

    let inbox: Inbox;

    function showInbox(){
        inbox.call();
    }

    function showCalendar(){
        calendar.show();
    }

</script>

<svelte:head>
    <meta name="color-scheme" content={$theme}/> <link rel="stylesheet" href={`/theme/${$theme}.css`} />
  </svelte:head>
  <slot />

<Loadingcover bind:this={loadingcover}/>

<Messagemodal bind:this={messagemodal}/>
<div class:invisible={editor_visible}>
    <Topbar/>
    <Searchbar callback_result_clicked={(id) => quickview_modal.call(id)} search_collection={search_collection} placeholder={search_placeholder}/>
    <Collectionbar bind:this={collectionbar} callback_refresh={reload} callback={loadCollection} collections={collections}/>
    <Navbar 
        messages_unread={messages_unread}
        items_today={1}
        callback_calendar={showCalendar}    
        callback_inbox={showInbox} 
        callback_new={newItem}
    />
    
    {#if state == Types.app_state.Home}
        <Todaybar callback_item_clicked={(id)=> quickview_modal.call(id)}  tomorrow_items = {events_tomorrow} tdy_items={events_today}/>
        <ItemLongGrid 
        callback_item={(id) => quickview_modal.call(id)} 
        title="Pinned" items={pinned}
        />

        <ItemLongGrid 
            callback_item={(id) => quickview_modal.call(id)} 
            title="Recent" items={recents}
        />
        
        <ItemLongGrid 
            callback_item={(id) => quickview_modal.call(id)} 
            title="Todo" items={todo}
        />
        <Recyclebin callback_refresh={reload} items={deleted}/>
    {:else}
        <Itemgrid 
            callback_refresh={reload}
            callback_item={(id) => quickview_modal.call(id)} 
            callback_close={returnHome} 
            loaded={items_active}
        />

    {/if}
    
</div>
<Progressbar/>
<Inbox bind:items_unread={messages_unread} callback_open_item={(id)=>{quickview_modal.call(id)}} callback_open_collection={loadCollection} bind:this={inbox}></Inbox>
<Calendar callback_event={(id) => quickview_modal.call(id)} bind:this={calendar}/>
<Editor bind:this={editor} callback_close={()=>{console.log("reloading"); reload();}} collections={collections}/>

<Quickview callback_refresh={reload} edit_callback={(id) => {editItem(id)}} bind:this={quickview_modal}/>
<div style="height: 100px;"></div>

<style>
    :global(body){
        background-color: var(--body-color);
    }

    .invisible{
        display: none;
    }
</style>