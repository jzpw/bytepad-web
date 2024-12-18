<div id="empty" class="empty">
    <span>
        No items
    </span>
</div>

<style>
    .empty {
        clear: both;
        position: relative;
        animation-duration: 0.5s;
        animation-name: slidein;
        text-align: center;
        margin-top: 60px;
    }

    .empty span{
    color: #d49090 !important;
    padding-bottom: 12px;
    border-bottom: 1px solid rgb(99, 66, 66);
    font-family: 'Raleway';
    font-size: 15px;
}

@keyframes slidein{
    0% {
    bottom: -50px;
    opacity: 0;
}
    100% {
        bottom: 0px;
        opacity: 1;
    }
}


</style>