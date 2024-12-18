<script type="text/javascript" lang="ts">
    import Spinnerdots from "./spinnerdots.svelte";

    export let visible = true;

    let cover_element: HTMLElement;

    export function hide(){
        console.log("hidden");

        cover_element.style.opacity = 0;
        setTimeout(()=>{visible = false;}, 500);
    }


</script>

{#if visible}
<div bind:this={cover_element} class="cover">
    <div class="text">
        bytepad
    </div>
    <div class="small">
        <Spinnerdots/>
    </div>
</div>
{/if}

<style>

    .cover{
        top: 0;
        left: 0;
        z-index: 1000;
        position: fixed;
        background-color: #0a0a0a;
        width: 100%;
        height: 100%;
        transition: opacity 0.5s;
    }

    .text{
        font-display: block;
        font-size: 25px;
        font-family: Poppins;
        font-weight: 200;
        color: #a1e0d3;
        width: 100%;
        text-align: center;
        margin-top:50%;
        margin-bottom: 20px;

    }

    .small{
        transform: scale(0.4);
        opacity: 1;
        position: relative;
        width: 100%;
        text-align: center;
        margin: auto;
        animation: slidein 0.5s ease;
    }

    
@keyframes slidein {
    0% {
        bottom: -100px;
        opacity: 0;
    }
    100% {
        bottom: 0px;
        opacity: 1;
    }
}
</style>