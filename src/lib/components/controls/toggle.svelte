<script type="text/javascript" lang="ts">

    export let value: boolean = false;

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="bar" class:on-bar={value} on:click={() => {value = !value;}}>
    <div class="dot" class:on={value}>
    </div>
</div>

<style>

    .on{
        left: calc(100% - 14px) !important;
    }

    .on-bar{
        background-color: #7dbfe8 !important;
    }

    .bar{
        display: inline-block;
        width: 32px;
        height: 20px;
        background-color: #a3a3a3;
        position: relative;
        top: 2px;
        margin: 0px 10px;
        border-radius: 30px;
        padding: 0px 2px;
        transition: all 200ms ease-out;
    }

    .dot{
        transition: all 200ms ease-out;
        left: 0px;
        width: 14px;
        background-color: rgb(0, 0, 0);
        height: 14px;
        border-radius: 30px;
        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        position: relative;
    }
    
</style>
