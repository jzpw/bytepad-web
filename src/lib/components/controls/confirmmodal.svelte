<script type="text/javascript" lang="ts">
    import { fade } from "svelte/transition";

    let callback_ok: Function | null;
    let callback_cancel: Function | null;

    let called: boolean = false;

    let visible: boolean = false;
    let message: string = 'Delete this item? ';

    let timeout: number;

    export function call(m: string, on_ok: Function, on_cancel: Function){
        if(called)
            return;

        called = true;

        callback_ok = on_ok;
        callback_cancel = on_cancel;

        message = m;
        visible = true;

        clearTimeout(timeout);
        
        return;

        timeout = setTimeout(()=>{
            cancel();
        }, 8000);
        
    }

    function cancel(){
        visible = false, called = false;
        if(callback_cancel)
        {
            callback_cancel();
            callback_cancel = null, callback_ok = null;
        }
    }

    function ok(){
        visible = false, called = false;
        if(callback_ok)
        {
            callback_ok();
            callback_cancel = null, callback_ok = null
        }
        
    }

</script>
{#if visible}
<div class="cover" on:click={(e)=>{cancel(); e.stopPropagation();}}>

</div>
<div class="content">
    <div class="message">
    <span>{message}</span>
    </div>
    <div class="buttons">
        <div on:click={cancel} class="button">Cancel 
        </div>
        <div on:click={ok} class="button confirm">Confirm
        </div>
    </div>
</div>
{/if}

<style>
    .cover{
        z-index: 9999;
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
        background-color: #0000002a;
    }
    .button{
        color: #ffffff;
        background-color: #000000;
        border: 1px solid #000000;
        border-radius: 30px;
        padding: 9px 10px;
        margin: 10px 30px;
        font-size: 15px;

    }

    .buttons{
        margin-top: 25px;
        text-align:center;
    }

    .buttons div{
        width: -webkit-fill-available;
        margin-bottom: 15px;
        display: block;
    }

    .button i{
        font-size: 20px;
        position: relative;
        top:4px;
        color: #000000;
    }

    .confirm{
        border: none !important;
        background-color: rgb(17, 39, 69) !important;
        color: #ffffff !important;
    }

    .content{
        text-align: center;
        padding: 30px 0px 30px 0px;
        background-color: #1c1c1c93;
        backdrop-filter: blur(15px);
        color: #e6e6e6;
        font-family: 'Poppins';
        font-weight: 400;
        font-size: 14px;
        position: fixed;
        bottom: 0px;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        z-index: 10000;
        box-shadow: 3px 3px 15px 5px rgba(0, 0, 0, 0.863);
        animation: slidein-btm 0.2s;
    }


    @keyframes slidein-btm {
    from {
        opacity: 0;
        transform: translateY(100px);
    }

    to {
        opacity: 1;
        transform: translateY(0px);
    }
}


    .message{
        margin: 10px 10px 40px 10px;
        color: #ffffff;
    }

</style>