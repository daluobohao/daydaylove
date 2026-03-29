import axios from 'axios'
import { AesEncryption } from '../lib/cipher'

export function uuid(len) {
    return Number(Math.random().toString().substr(3,8) + Date.now()).toString(len ? len : 36)
}
export function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
export function removeCookie(name) {
    var expires = "";
    document.cookie = name + "=" + ("")  + expires + "; path=/";
}
export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const encryption = new AesEncryption({ key: '_0122223333_', iv: '@123331111_' })
export function setLocalEncrpt(name,value) {
    localStorage.setItem(name, encryption.encryptByAES(value))
}

export function getLocalEncrpt(name) {
    const item = localStorage.getItem(name)
    return item ? encryption.decryptByAES(item) : null
}

export function removeLocalEncrpt(name) {
    localStorage.removeItem(name)
}

export async function requestPost(url, data) {
    const res = getCookie("__user")
    const obj = JSON.parse(decodeURIComponent(res))
    return await axios.post(url, data, {
        headers: {
            "x-ui": obj && obj.userId,
            "x-ut": obj && obj.token
        }
    })
}

export async function synchronizationUserState(flag) {
    let localR = getLocalEncrpt('__r')
    const obj = localR ? JSON.parse(localR) : {}
    let currentUserId = null
    try {
        const cookieRaw = getCookie('__user')
        if (cookieRaw) {
            currentUserId = JSON.parse(decodeURIComponent(cookieRaw)).userId || null
        }
    } catch (_) {
        currentUserId = null
    }

    if (flag) {// 重置
    } else {
        const sameUser =
            currentUserId != null &&
            obj.userId != null &&
            String(obj.userId) === String(currentUserId)
        if (
            obj &&
            obj.verify &&
            sameUser &&
            new Date().toDateString() === new Date(obj.timeAt).toDateString()
        ) {
            return true
        }
    }
    let token = obj && obj.token ? obj.token : ""
    const submitURL = `/api/user/state`
    return requestPost(submitURL, {token, flag}).then(response => {
        let result = response.data
        if (result.verify) {
            result.timeAt = new Date()
            setLocalEncrpt('__r', JSON.stringify(result))
        } else {
            removeLocalEncrpt('__r')
        }
        return result
    })
}

export async function clearLocal() {
    setCookie("__user", "")
    removeLocalEncrpt('__r')
}
