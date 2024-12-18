<script type="text/javascript" lang="ts">
    import { applyAction } from '$app/forms';
    import * as API from '$lib/js/request';

    
    import {global_session, progress_value, progress_enabled} from '$lib/js/applicationstore';
    import Confirmmodal from './controls/confirmmodal.svelte';
    import SpinnerDots from './controls/spinnerdots.svelte';
    import Imageviewer from './controls/imageviewer.svelte';
    let session_id: string;
    global_session.subscribe((k) => {session_id = k});

    export let file: any;
    export let item_id: number | null;

    export let deletable: boolean = false;

    export let callback_delete: Function;

    let deleteConfirm: Confirmmodal;

    let xhr_download: XMLHttpRequest;

    let loading: boolean = false;

    let image_url: string;

    let imageObject: HTMLElement;

    let imageViewer: Imageviewer;

    let image_opened: boolean = false;

    let fileNode: HTMLElement;

    $: if(file.has_thumbnail) getThumbnail();

    function getThumbnail(){

        loading = true;
        
        let data = {
            file_id: file.file_id,
            item_id: item_id,
            session_id: session_id,
            get_thumbnail: true
        };
        
        API.PostGetBLOB('item/filedownload',
            data,
            (responseBlob: Blob) => {
                loading = false;
                let objectURL = URL.createObjectURL(responseBlob);
                image_url = objectURL;
                imageObject.style.opacity = 1;
                //fileNode.style.background = "url('" + objectURL + "') no-repeat";
            },
            () => {}
        )
    }

    function downloadFile() {
        console.log("Downloading file...");
        if(!item_id)
            return;

        progress_enabled.set(true);

        var data = {
            file_id: file.file_id,
            item_id: item_id,
            session_id: session_id,
            get_thumbnail: false
        };

        API.PostGetBLOB( 'item/filedownload',
            data,
                (blob: Blob) => {
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = file.filename;
            a.dispatchEvent(new MouseEvent('click'));
            },
            (response: Response) => {console.log(response); }
        );
    }



    function opened(){
    if(file.has_thumbnail)
        imageViewer.call(file.filename, file.file_id, item_id ?? -1);
    else
        downloadFile();
    }

    function btnDelete(){
        deleteConfirm.call('Are you sure you want to delete ' + file.filename + ' permanently?',
            () => {callback_delete(file.file_id)},
            () => {}
        )
    }


</script>

<Imageviewer bind:this={imageViewer}/>

<Confirmmodal bind:this={deleteConfirm} />

<div bind:this={fileNode} class="file" on:click={opened}>
    {#if !file.has_thumbnail}
        <span class="material-symbols-outlined file-icon">
            draft
        </span>
    {/if}
    <img src={image_url} bind:this={imageObject} class="bg-image">
    {#if loading}
    <div class="spinner">
        <SpinnerDots/>
    </div>
    {/if}
    <div class="top">
        <span class="filename">
            {file.filename}
        </span>

    </div>    
    <div class="btm">
     <span class:cat-skeleton={file?.skeleton} class="cat-tag">
        {file.size}
    </span>

    </div>

    {#if deletable} 
    <span on:click={(e) => {e.stopPropagation(); btnDelete()}}  class="material-symbols-outlined delete-btn icon-small">close</span>
    {/if}
</div>

<style>

.file-icon{
    position: absolute;
    font-size: 35px;
    font-variation-settings: 'wght' 200;
    color: #cccccc;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.spinner{
    left: 50%;
    transform: translateY(-50%) translateX(-50%) scale(0.4);
    top: 50%;
    position: absolute;
}

.bg-image{
    left: 0px;
    top: 0px;
    overflow: hidden;
    opacity: 0;
    transition: opacity 1s ease-in-out;
    object-fit: cover;
    width: 100%;
    height: 100%;
    position: absolute;
}

.delete-btn{
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: #ffffff;
    text-shadow: 2px 2px 10px #000000, 2px 2px 10px #000000;
}

.btm{
    position: absolute;
    bottom: 5px;
}

.top{
    overflow: hidden;
    position: relative;
}
    .right{
        float: right;
}

    .file {
        width: -webkit-fill-available;
        z-index: 0;
        overflow: hidden;
        box-sizing: border-box;
        transition: background-color linear .2s,opacity linear 1s;
        display: inline-block;
        vertical-align: middle;
        padding: 10px 20px 10px 10px;
        font-family: Poppins;
        border-radius: 5px;
        font-size: 13px;
        background-color: #181818;
        color: #fff;
        cursor: pointer;
        margin: 7px;
        height: 120px;
        position: relative;
        background-size: cover!important;
        background-position: center!important;
    }

    .file div{
        text-overflow: ellipsis;
    }

.filename{    
    padding: 3px 3px;
    position: relative;
    top: 0px;
    left: 0px;
    font-size: 12px;
    background-color: #31313155;
    border-radius: 3px;
}

.icon-small{
    font-size: 22px;
    font-variation-settings: 'wght' 200;
}

.cat-tag{
    position: relative;
    top: -7px;
    max-width: 125px;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    width: fit-content;
    text-align: center !important;
    font-weight: normal;
    margin-top: 0;
    margin-bottom: 0px;
    padding: 3px 7px;
    background-color: #31313155;
    color: #dadada;
    font-size: 12px;
    font-family: 'Inter';
    opacity: 0.7;
    border-radius: 3px;
}

.cat-skeleton
{
    background-color: #454545 !important;
    color: #969696 !important;   
}

</style>