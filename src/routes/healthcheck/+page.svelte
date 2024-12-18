<script>

</script>
<div class="container">
    <div class="title">
        Bytepad Server Status
    </div>
    <div class="value">
        Backend: <span>OK</span> <span class="material-symbols-outlined">done</span>
    </div>
    <div class="value">
        Database: <span>OK</span> <span class="material-symbols-outlined">done</span>
    </div>
    <div class="value">
        FileStorage: <span>OK</span> <span class="material-symbols-outlined">done</span>
    </div>
</div>
<style>
:global(body){
    background-color: #eeeeee !important;
}
.title{
    font-family: 'Poppins';
    font-size: 18px;
    color: #252525;
    font-weight: 300;
    padding-bottom: 15px;
    border-bottom: 1px solid #cccccc;
}

.value{
    margin-top: 20px;
    font-size: 15px;
    font-family: Raleway;
    color: #696969;
    font-weight: 400;
}

.value span{

    font-weight: 600;
    color: #719496;
}

.value span:nth-child(1){
    padding-left: 10px;
}

.value span:nth-child(2){
    font-size: 20px;
    line-height: 5px;
    top: 5px;
    position: relative;
}

.container{
    padding:30px;
}

</style>