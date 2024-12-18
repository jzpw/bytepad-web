<script type="text/javascript" lang="ts">
    export let visible = false;
</script>

{#if visible}
<div id="uploadFile" class="modal2" style="display: block;">
    <div class="modal3-content" id="modalcontent">
        <div class="title-modal" style="text-align:center;">
            <div style="
                background: transparent;
                color: #b1b1b1;
                margin: 9px -1px;" class="small-tag" id="upload-percent">0%</div>

            <a on:click={upload} class="dialog-btn" style="margin-bottom:10px;">
                Upload
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
    .inputfile + label {
    padding: 20px 15px;
    border: dashed 1px #4d461b;
    margin-top: 10px;
    width: -webkit-fill-available;
    background-color: #161616;
    overflow-wrap: break-word;
    font-size: 12px;
    font-family: 'Raleway';
    color: #d4ae69;
    display: inline-block;
    cursor: pointer;
    border-radius: 10px;
}

.title-modal{
    margin-bottom: 10px;
}

.modal3-content {
    border-radius: 20px;
    background-color: #191919;
    color: #000000;
    margin: 30% auto;
    padding: 4px 10px;
    max-width: min(240px,90%);
    /* border: 1px solid #2c2c2c; */
    /* box-shadow: 1px 1px 4px #9f9f9f; */
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
    animation: fadein 0.2s;
}

.modal2:not(.windowed) {
    background-color: rgb(0,0,0);
    backdrop-filter: blur(2px);
    background-color: rgb(0 0 0 / 50%);
}

.inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}

.dialog-btn {
    cursor: pointer;
    margin: auto;
    /* width: max-content; */
    color: #ffffff !important;
    background-color: #467f91;
    padding: 7px 16px;
    /* border: 1px solid #aaaaaa; */
    border-radius: 50px;
    font-family: 'Raleway', sans-serif;
    font-size: 13px;
    min-width: 113px;
}

</style>