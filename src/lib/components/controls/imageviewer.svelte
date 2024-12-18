<script type="text/javascript" lang="ts">

    import SpinnerDots from '$lib/components/controls/spinnerdots.svelte';

    import {global_session} from '$lib/js/applicationstore';
    import * as API from '$lib/js/request';

    let session_id: string;
    global_session.subscribe((k) => {session_id = k});

    let loading: boolean = true;

    let file_id: number;
    let item_id: number;
    let file_name: string;

    let image_url: string;
    let image_object: HTMLElement;

    let opened: boolean = false;

    export function call(f_name: string, f_id: number, i_id: number)
    {
        opened = true;
        file_name = f_name;
        file_id = f_id;
        item_id = i_id;

        getThumbnail();
    }

    function getThumbnail(){

        loading = true;

        let data = {
            file_id: file_id,
            item_id: item_id,
            session_id: session_id,
            get_thumbnail: false,
            fetch_mode: 1
        };

        console.log(data);

        API.PostGetBLOB('item/filedownload',
            data,
            (responseBlob: Blob) => {
                loading = false;
                let objectURL = URL.createObjectURL(responseBlob);
                image_url = objectURL;

                image_object.onload = () => {
                    image_object.style.opacity = 1;
                }
            },
            (response: Response) => { console.log(response); }
        );
    }

    function downloadFullSize(){

        let data = {
            file_id: file_id,
            item_id: item_id,
            session_id: session_id,
            get_thumbnail: false
        };

        API.PostGetBLOB( 'item/filedownload',
            data,
                (blob: Blob) => {
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = file_name;
            a.dispatchEvent(new MouseEvent('click'));
            },
            (response: Response) => {console.log(response); }
        );
    }

</script>

{#if opened}
    <div on:click={(event)=>{event.stopPropagation(); opened = false;}} class="wrapper">
        {#if loading}
            <div class="loader">
                <SpinnerDots/>
            </div>
        {/if}

        <div on:click={downloadFullSize} class="download">
        Download <span class="material-symbols-outlined">download</span>
        </div>

        <div class="image">
            <img bind:this={image_object} src={image_url} alt="image">
        </div>   
        <div class="filename">
            {file_name}
        </div>
    </div>
{/if}

<style>

.filename{    
    font-family: Poppins;
    position: fixed;
    width: max-content;
    font-size: 12px;
    left: 15px;
    padding: 2px 5px;
    top: 12px;
    background-color: #1414397f;
    border-radius: 3px;
    color: #e1e1e1;
}

    .loader{
        top:50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -50%) scale(0.5);
    }

    .wrapper{
        top: 0px;
        left: 0px;
        z-index: 1500;
        position: fixed;
        height: 100%;
        width: 100%;
        background-color: #000000cb;
        backdrop-filter: blur(9px);
    }

    .image{
        border-radius: 3px;
        background-color: #1e1e1e00;
        width: 90%;
        height: 80%;
        margin: 0 auto;
        top: 50%;
        left: 50%;
        transform: translate(-50% , -50%);
        position: fixed;
        overflow: hidden;
    }

    .image img{
        opacity: 0;
        transition: opacity 0.7s ease-in-out;
        image-rendering: optimizeQuality;
        object-fit: contain;
        width: 100%;
        height: 100%;
    }

    .download{
        width: max-content;
        padding: 5px 18px;
        right: 20px;
        bottom: 20px;
        color: #dcdcdc;
        font-family: Poppins;
        font-weight: 400;
        font-size: 13px;
        position: fixed;
        border-radius: 8px;
        background-color: #0b0c25;
        z-index: 50;
        box-shadow: 2px 2px 12px 5px rgba(0, 0, 0, 0.514);
    }

    .download span{
        font-size: 18px;
        top: 4px;
        position: relative;
    }
</style>