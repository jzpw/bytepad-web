<script type="text/javascript" lang="ts">

    import {global_session, progress_value, progress_enabled} from '$lib/js/applicationstore';
    import * as API from '$lib/js/request';
    
    let session_id: string;

    global_session.subscribe((k) => {session_id = k});

    let progress: number = 0;

    let current_progress;

    $: current_progress = Math.floor(100*Number(progress)) + '%';

    export let visible = false;

    let uploading_now: boolean = false;

    $: {
        if(!visible && fileinput)
            fileinput.files = null;
    }

    export let callback_uploaded: Function;

    export let item_id_: number | null;

    let files: any;

    let fileinput: any;

    let uploadEnabled: boolean = false;

    $: if (files) {
        uploadEnabled = true;

        for (const file of files) {
            console.log(`${file.name}: ${file.size} bytes`);
        }
        }
        else {
            uploadEnabled = false;
        }

    function upload(){
        if(uploading_now || !uploadEnabled) 
            return;

        console.log(item_id_);
        if(fileinput.files.length == 0){
            fileinput.files = null;
            visible = false;
        }

        if(!item_id_)
            return;

        uploading_now = true;

        const formData = new FormData();

        const f = fileinput.files;

        for (var i = 0; i < f.length; i++) {
            formData.append("file", files[i]);
        }

        formData.append("session_id", session_id);
        formData.append("item_id", item_id_.toString());
        formData.append("type", (0).toString());

        API.axiosRequest(
            'item/fileaction',
            formData,
            (data: any) => {
                uploading_now = false;
                console.log("Uploaded:");
                console.log(data);
                callback_uploaded(data.data);
                reset();
            }, (response: Response) => {
                uploading_now = false;
            }, (p: any) => {
                if(uploading_now)
                    progress = p.progress;
            }
        )
    }

    function bytesToMB(bytes: number){
        return (bytes/1024/1024).toFixed(2) + 'MB';
    }

    function reset(){
        progress = 0;
        fileinput.value = null;
        files = null;
        visible = false;
    }

</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->

{#if visible}
<div on:click={reset} id="uploadFile" class="modal2" style="display: block;">
    <div on:click={(e) => {e.stopPropagation()}} class="modal3-content" id="modalcontent">
     <div class="title-modal" style="text-align:center;">
            <form id="uploadForm" enctype="multipart/form-data">
                <input bind:this={fileinput} bind:files id="fileInput" name="file" type="file" class="inputfile" multiple>
                <label class="inputlabel" id="fileLabel" for="fileInput" style="">
                    {#if files && files.length > 0}
                    {#each files as {name, size}}
                        <p>{name} ({bytesToMB(size)})</p>
                    {/each}
                    {:else}
                        Select file(s)...
                    {/if}

                </label>
            </form>
            <div class="pbar">
                <div style="--progress-percent-upload: {current_progress}">
                </div>
            </div>
            <div style="" class="small-tag" id="upload-percent">{current_progress}</div>

        <a on:click={upload} class="dialog-btn" class:disabled={uploading_now || !uploadEnabled} style="margin-bottom:10px;">
                {uploading_now ? 'Uploading...' : 'Upload'}
                <i class="material-symbols-outlined" style="
                    top: 5px;
                    padding-left: 5px;
                    position: relative;
                    font-size: 20px;
                ">upload</i>
            </a>
        </div>
    </div>
</div>
{/if}

<style>

    .inputlabel{
        max-height: 300px;
        overflow-y: scroll;
    }


    .pbar{
        margin-top: 13px;
        height: 8px;
        background-color: #000000;
        border-radius: 5px;
    }

    .pbar div{
        width: 50%;
        background-color: rgb(193, 227, 226);
        height: 8px;
        border-radius: 5px;
        transition: width 250ms ease-in-out;
        width: var(--progress-percent-upload);
    }

    .inputfile + label {
    padding: 25px 25px;
    border: dashed 1px #777777;
    margin-top: 10px;
    width: -webkit-fill-available;
    overflow-wrap: break-word;
    font-size: 12px;
    font-family: 'Raleway';
    color: #cdcdcd;
    display: inline-block;
    cursor: pointer;
    border-radius: 15px;
}

.small-tag{
    background: transparent;
    color: #b1b1b1;
    margin: 9px -1px;
    font-family: Poppins;
    font-size: 14px;
    margin: 10px 0px;
    padding-bottom: 10px;
}

.title-modal{
    margin-bottom: 10px;
}

.modal3-content {
    background-color: #0b0b0bb7;
    color: #000000;
    bottom: 0;
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    padding: 20px 30px;
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
    background-color: #000000c7;
    backdrop-filter: blur(5px);
}

@keyframes modal-zoomin {
    from {
        bottom: -50px;
        opacity: 0.2;
    }

    to {
        bottom: 0px;
        opacity: 1;
    }
}


.inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}

.disabled{
    border: 1px solid #404040 !important;
    background-color: #00000000 !important;
    color: #7f7f7f !important;
}

.dialog-btn {

    
    border: none;
    background-color: rgb(17, 39, 69);
    color: #ffffff ;
    border-radius: 30px;
    padding: 9px 10px;
    margin: 10px 30px;
    font-size: 15px;
    
    margin: auto;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Poppins';
    margin-right: 0px;
    margin-bottom: 15px;
    color: #ffffff;
    /* border: 1px solid #ffffff; */
    display: block;
    padding: 9px 15px;
    /* box-shadow: 3px 3px #357959; */
    border-radius: 30px;
    cursor: pointer;
    transition: 0.2s;
    border: none;
    transition: all 300ms linear;
}

</style>