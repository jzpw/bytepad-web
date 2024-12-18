<script>	
    import { text } from '@sveltejs/kit';
	import { createEventDispatcher } from 'svelte';

	export let value = '';
	export let minRows = 4;
	export let maxRows;
	export let placeholder = '';

	const dispatch = createEventDispatcher();

	$: minHeight = `${1 + minRows * 1.2}em`;
	$: maxHeight = maxRows ? `${1 + maxRows * 1.2}em` : `auto`;

	function textChanged() {
		dispatch('input', {});
	}

</script>

<div class="container">
	<pre
		aria-hidden="true"
		style="border: none; min-height: {minHeight}; max-height: {maxHeight}"
	>{value + '\n'}</pre>

	<textarea on:input={textChanged} placeholder={placeholder} bind:value></textarea>	
</div>

<style>

textarea,
input[type="text"],
input[type="button"],
input[type="submit"] {
     -webkit-appearance: none;
     border-radius: 0;
}

	.container {
		position: relative;
	}
	
	pre, textarea {
		font-family: inherit;
		padding: 0.5em;
		box-sizing: border-box;
		border: 1px solid #eee;
		line-height: 1.2;
		overflow: hidden;
	}
	
	textarea {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		resize: none;
		border-radius: none;
		outline: none;
		border: none;
      background-color: #00000000;
        box-sizing: border-box;
        color: #d5d5d5;
        font-family: 'Inter';
        font-size: 16px;
        padding: 10px;
		border-left: 1px solid transparent;
	}

    textarea:focus-visible{
		border: none;
        border-left: 1px solid #1f622d !important;
        outline: none;
    }

		textarea,
	input[type="text"],
	input[type="button"],
	input[type="submit"] {
		-webkit-appearance: none;
		border-radius: 0;
	}

</style>