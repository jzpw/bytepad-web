<script type="text/javascript" lang="ts">
    import { fade } from "svelte/transition";

    let visible: boolean = false;
    let message: string = '';

    let timeout: number;

    export function call(m: string){
        message = m;
        visible = true;

        clearTimeout(timeout);
        
        timeout = setTimeout(()=>{
            visible = false;
        }, 3000);
        
    }
</script>
{#if visible}
<div>
    <span>{message}</span>
</div>
{/if}

<style>
    .close{
        float: right;
        font-size: 18px;
        margin-left: 30px;
    }

    @keyframes fade-in{
        from{
            transform: translateY(-50px);
        }

        to{
            transform: translateY(0px);
        }
    }

    div{
        text-align: center;
        box-sizing: border-box;
        position: fixed;
        width: 100%;
        padding: 9px 12px;
        background-color: #8ae2f5;
        color: #000000;
        font-family: 'Poppins';
        font-weight: 400;
        font-size: 13px;
        position: fixed;
        left: 0px;
        top: 0px;
        z-index: 10000;
        animation: fade-in 0.2s ease-in;
    }
</style>