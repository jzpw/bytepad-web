<script type="text/javascript" lang="ts">

    import * as cookie from '$lib/js/cookie';
    import Spinner from '$lib/components/controls/spinner.svelte';

    import * as API from '$lib/js/request';

    import { theme, global_session } from '$lib/js/applicationstore';

    var reject_reason: string = '';

    var info: string = '';

    var loading: boolean = false;

    var input_username: string, input_password: string, input_otp: string;

    var otp_mode: boolean = false;

    var attempt_key: string = "";

    var input_enabled: boolean = false;

    CheckSignedIn();

    function CheckSignedIn() {
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);

        var session = cookie.Get('session_id');

        //If user already signed in, redirect to profile
        if (session != '') {

            API.Get(
                "login/checksession/" + session,
                (data: any) => {
                    console.log(data);
                    if(data == 'valid')
                    {
                        window.location.replace("/user");
                        global_session.set(session);
                    }
                    else{
                        reject_reason = 'Session expired please log in again...';
                        input_enabled = true;
                    }
                },
                () => {
                    reject_reason = 'Bytepad is not currently available.';
                    input_enabled = true;
                }
            );



            return;
        }
        else
        {
            input_enabled = true;
            //If redirected from sign in or changed password
            if (urlParams.get("event") == '1') {
            reject_reason = 'New account created, please log in.';
            }

            if (urlParams.get("event") == '1') {
                reject_reason = 'Password changed, please log back in.';
            }
        }
    }

    function AttemptLogin(){
        info = '';
        reject_reason = '';

        loading = true;

        var username = input_username ?? '';
        var password_hash = input_password ?? '';
        var requestObj = { login_username: username, login_password: password_hash };

        console.log(requestObj);

        API.Post('login/trylogin', requestObj, 
         function(data: any){
            console.log(data);

            if(data?.error)
            {
                reject_reason = data?.error_message;
                loading = false;
                info = '';
            }
            else if(data?.tfa_required)
            {
                console.log(data.attempt_key);
                attempt_key = data.attempt_key;
                otp_mode = true;
                loading = false;
                info = data.info_message;
            }
            else if(data?.granted){
                info = '';
                cookie.Set('session_id', data.session_id, 7);
                console.log("Signed in.");
                window.location.replace("/user");
                reject_reason = '';
            }
            else{
                reject_reason = "Incorrect username or password.";
                loading = false;
                info = '';
            }
         }, 
         function(error: Response){
            info = '';
            loading = false;
            reject_reason = "Failed request, try again later.";
            console.log(error.status)
         }
        );
    }

    function submitOTP()
    {
        info = '';
        reject_reason = '';

        loading = true;

        var otp = input_otp ?? '';
        var requestObj = { tfa_number: otp, attempt_key: attempt_key};

        API.Post('login/trytfa', requestObj, 
        function(data: any){
            info = '';
            if(data?.granted)
            {
                cookie.Set('session_id', data.session_id, 7);
                console.log("Signed in.");
                window.location.replace("/user");
            }
            else{
                if(data?.error){
                    reject_reason = data.error_message;
                }
                else{
                    reject_reason = "Something went wrong.";
                }
                loading = false;

            }
        }, 
        function(error: Response){
            info = '';
            loading = false;
            reject_reason = "Failed request, try again later.";
            console.log(error.status)
        }
        );
    }

    function on_key_down(event: any){
        switch(event.key){
            case "Enter":
                {
                    event.preventDefault();
                    
                    if(otp_mode)
                        submitOTP();
                    else
                        AttemptLogin();

                    break;
                }
        }
    }

</script>
  
  <svelte:head>
    <meta name="color-scheme" content={$theme}/> <link rel="stylesheet" href={`/theme/${$theme}.css`} />
  </svelte:head>
  <slot />



{#if input_enabled}
<div style="">
    <div class="login-title">bytepad</div>
    <div class="login-box">
        {#if loading}
            <Spinner />
        {/if}
        {#if !loading}            
        
            <div class="login-info">
                {info}
            </div>
            <div class="login-reject">
                {reject_reason}
            </div>
                {#if !otp_mode}
                    <input bind:value={input_username} on:keydown={on_key_down} id="login_username" type="text" class="validate login-input" autocomplete="off" placeholder="Username">
                    <input bind:value={input_password} on:keydown={on_key_down} id="login_password" type="password" class="validate login-input" placeholder="Password">
                <button class="login-button" on:click={AttemptLogin}>Login</button>
                {:else}
                <div style="margin-top: 30px;">

                </div>
                    <input bind:value={input_otp} on:keydown={on_key_down} type="text" class="validate otp-input login-input" placeholder="One time passcode">
                    <button class="login-button" on:click={submitOTP}>Verify</button>
                {/if}
        {/if}
    </div>
    <div class="login-footer">
        <span class="left">No account? <a href="/signup">Create one</a></span>
        <span class="right"><a href="/forgotpassword">Forgotten password</a></span>
    </div>
</div>

{/if}

<style>
    :global(body)
    {
        background-color: var(--body-color);
    }
    
    a {
    color: #039be5;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    }

    .login-reject{
        color: #d35050;
        font-size: 14px;
        margin-top: 10px;
        font-family: 'Poppins';
    }

    .login-info{
        color: #b2b2b2;
        font-size: 14px;
        margin-top: 10px;
        font-family: 'Poppins';
    }

    .otp-input{
        text-align: center;
        font-size: 24px !important;
        font-family: 'Poppins' !important;
        font-weight: 200 !important;
        width: 200px !important;
    }

    .otp-input::placeholder{
        font-size: 14px;
    }

    .login-title {
    font-size: 35px;
    font-family: 'Poppins', sans-serif;
    color: #9bf2e1;
    margin-top: 70px;
    text-align: center;
    }

    .login-box {
    text-align:center;
    height:230px;
    margin: 30px auto 10px auto;
    max-width: min(90%,330px);
    padding: 10px;
    }

    .login-box input{
    -webkit-tap-highlight-color: transparent;
    line-height: 1.15;
    overflow: visible;
    padding-left: 10px !important;
    background-color: #111111 !important;
    border: none;
    border-bottom: 1px solid #175249;
    outline: none;
    height: 2.5rem;
    width: -webkit-fill-available;
    font-size: 14px;
    font-family: Poppins,Arial,Helvetica,sans-serif;
    color: #ebebeb;
    margin: 20px 13px 13px 10px;
    padding: 0;
    box-shadow: none;
    box-sizing: content-box;
    transition: box-shadow .3s, border .3s, -webkit-box-shadow .3s;
    }

    .login-box input::placeholder{
        color: rgb(137, 171, 161);
    }

    .login-button {
    cursor: pointer;
    background-color: #3fcfb3;
    color: #000000 !important;
    padding: 10px 40px;
    border-radius: 50px;
    border: 0px;
    font-size: 15px;
    font-family: 'Poppins';
    margin-bottom: 20px;
    }

    .login-footer {
    color: #8d8d8d;
    max-width: min(80%,330px);
    margin: 15px auto;
    font-size: 12px;
    font-family: 'Poppins';
    }

    .left{
        float:left;
    }
    .right{
        float:right;
    }
</style>