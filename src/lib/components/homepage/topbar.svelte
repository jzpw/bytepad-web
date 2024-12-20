<script type="text/javascript" lang="ts">
    import Usermenu from "../modals/usermenu.svelte";


let usermenu: Usermenu;

function showMenu(){
        usermenu.call();
    }

</script>

<Usermenu bind:this={usermenu}/>

<div class="hidden-bar"></div>
<div class="container">
<table>
    <tr>
        <td>
            <span class="icon material-symbols-outlined">menu</span>
        </td>
        <td>
            bytepad <span class="down arrow material-symbols-outlined">keyboard_arrow_down</span>
        </td>
        <td on:click={showMenu}>
            <span class="icon material-symbols-outlined">person</span>
        </td>
    </tr>
</table>
</div>

<style>

.hidden-bar{
    z-index: 1010;
    display: block;
    left: 0px;
    height: 160px;
    top: -100px;
    backdrop-filter: blur(12px);
    position: fixed;
    width: 100%;
    background-color: rgba(20, 20, 20, 0.571);
}

.container {
    z-index: 1015;
    width: 100%;
    left: 0px;
    top: 0px;
    position: fixed;
    padding: 0;
}

.arrow{
    position: relative;
    top: 7px;
}

table{
    margin-top: 10px;
    width: 100%;
}

.down{
    font-size: 20px !important;
    top: 4px !important;
}

.icon{
    font-variation-settings: 'wght' 200;
    position: relative;
    top: 5px;
}

td{
    font-size: 19px;
    font-weight: 300;
    text-align: center;
    font-family: Poppins;
    color: #d6fff6;
}

</style>