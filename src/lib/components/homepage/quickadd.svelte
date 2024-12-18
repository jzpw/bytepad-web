<script type="text/javascript" lang="ts">

    let text: String = "";

</script>

<div>
    <table>
        <tr>
            <td>
                <input bind:value={text} placeholder="Create quick task..."/>
            </td>
            <td class:hidden={text == ""} width="40px;">
                <span on:click={()=>{text = "";}} class="material-symbols-outlined done-btn close">close</span>
            </td>
            <td width="40px;">
                <span class="material-symbols-outlined done-btn">done</span>
            </td>
        </tr>
    </table>
</div>

<style>

div:focus-within{
    border-bottom: 2px solid #238b6a;
}

.hidden{
    visibility: hidden;
}

table{
    width: 100%;
}
div{
    border-bottom: 2px solid #ffffff00;
    border-radius: 10px;
    background-color: #1b1b1b;
    margin: 20px 20px;
    padding: 5px 0px;
    transition: all 0.2s;
}

input{
    display: inline-block;
    font-family: Poppins;
    font-size: 14px;
    font-weight: 300;
    width: -webkit-fill-available;
    background-color: #aaaaaa00;
    transition: border .2s;
    outline: none;
    border: none;
    margin: 5px 15px;
    color: #ffffff;
}

input::placeholder{
    color: #848484;
}

input:focus{
}

.close{
    color: #737373 !important;
}

.done-btn{
    position: relative;
    top: 2px;
    font-size: 22px;
    display: inline-block;
    color: #9efdd6;
    border-radius: 50px;
    padding: 2px;
}

</style>