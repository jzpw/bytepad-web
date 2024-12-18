<script type="text/javascript" lang="ts">

    export let callback_calendar: Function;
    export let callback_inbox: Function;
    export let callback_new: Function;

    export let items_today: number = 0;
    export let messages_unread: number = 0;

</script>

<div class="navbar">
    <div>
        <button>
            {#if items_today > 0}
            <span>
                {items_today}
            </span>
            {/if}
            <i on:click={callback_calendar} class="material-symbols-outlined">today</i>
        </button>
        <button>
            {#if messages_unread > 0}
            <span>
                {messages_unread}
            </span>
            {/if}
            <i on:click={callback_inbox} class="material-symbols-outlined">message</i>
        </button>
        <button>
            <span class="blue">
                +
            </span>
            <i on:click={callback_new} class="material-symbols-outlined">note</i>
        </button>
    </div>
</div>

<style>
    .navbar {
        z-index: 100;
        background-color: hsl(0, 0%, 10%);
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        margin: auto;
        right: 0;
        height: 70px;
        border-top: 1px solid #1f1f1f;
    }

    .navbar div{
        width:fit-content;
        margin:5px auto;

    }

    button{
        padding: 10px 40px;
        background-color:#ffffff00;
        color:#ffffff;
        border:none;
        top: 2px;
        position: relative;
    }

    button span{
        position: absolute;
        top: 8px;
        left: 31px;
        width: 18px;
        height: 17px;
        background-color: #09273f;
        border-radius: 10px;
        font-size: 12px;
        font-family: 'Inter';
        color: #ffffff;
        padding-top:2px;
        transition: scale 0.3s ease-out;
    }

    button:hover{
        transform: scale(0.9);
        opacity: 0.8;
    }

    button span.blue{
        background-color: #b8808000;
        color: #b9eedd;
    }

    i{
        font-size: 26px;
        font-variation-settings: 'wght' 200;
    }
</style>