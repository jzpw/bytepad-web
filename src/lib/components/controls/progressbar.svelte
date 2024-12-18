<script type="text/javascript" lang="ts">
    import {progress_value, progress_enabled} from '$lib/js/applicationstore';

    let enabled: boolean;
    let current_progress: string;

    progress_enabled.subscribe((e) => {enabled = e});

    $: {
        if(!enabled)
            current_progress = '0%';
    }

    progress_value.subscribe((v) => {
        current_progress = Math.floor(100*Number(v)) + '%';
    });

</script>

<div style="--progress-percent: {current_progress}">

</div>

<style>
    div{
        transition: width 250ms ease-in-out;
        z-index: 2000;
        position: fixed;
        height: 4px;
        left: 0px;
        top: 0px;
        background-color: rgb(125, 15, 15);
        width: var(--progress-percent);
    }
</style>