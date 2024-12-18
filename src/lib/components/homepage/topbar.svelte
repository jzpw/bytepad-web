<script type="text/javascript" lang="ts">
    import Usermenu from "../modals/usermenu.svelte";


let usermenu: Usermenu;

function showMenu(){
        usermenu.call();
    }

</script>

<Usermenu bind:this={usermenu}/>

<div>
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

.arrow{
    position: relative;
    top: 7px;
}

table{
    margin-top: 15px;
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