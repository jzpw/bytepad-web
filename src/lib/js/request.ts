import { dev } from '$app/environment';
import axios from 'axios';

function getAPIURL(){
    if (dev) {
        return "https://localhost:7180/api/";
    } else {
        return "api/";
    }
}

export async function Post(path: String, request_data: Object, on_ok: Function, on_fail: Function){
    try{
        const response = await fetch(getAPIURL() + path, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(request_data)
        });
        const result_data = await response.json();
        
        const ok = await response.ok;

        if (!ok) {
            on_fail(response);
        }

        on_ok(result_data);
    }
    catch(e){
        on_fail();
        console.log(e);
    }
}

export async function PostGetBLOB(path: String, request_data: Object, on_ok: Function, on_fail: Function){
    try{
        const response = await fetch(getAPIURL() + path, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(request_data)
        });
        const result_data = await response.blob();
        
        const ok = await response.ok;

        if (!ok) {
            on_fail(response);
        }

        on_ok(result_data);
    }
    catch(e){
        on_fail();
        console.log(e);
    }
}

export async function Get(path: String, on_ok: Function, on_fail: Function){
    try{
        const response = await fetch(getAPIURL() + path, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        });
        const result_data = await response.json();
        
        const ok = await response.ok;

        if (!ok) {
            on_fail(response);
        }

        on_ok(result_data);
    }
    catch(e){
        on_fail();
        console.log(e);
    }
}

export async function PostForm(path: String, request_data: any, on_ok: Function, on_fail: Function){
    try{
        const response = await fetch(getAPIURL() + path, {
            method: 'POST',
            body: request_data
        });
        const result_data = await response.json();
        
        const ok = await response.ok;

        if (!ok) {
            on_fail(response);
        }

        on_ok(result_data);
    }
    catch(e){
        on_fail();
        console.log(e);
    }
}

export async function axiosRequest(path: string, data: any, on_ok: Function, ok_fail: Function, on_progress: Function){

    axios.request({
        method: "post",
        url: getAPIURL() + path,
        data: data,
        onUploadProgress: (p) => {
            on_progress(p);
        }
    }).then (data => {
        on_ok(data);
    });
}