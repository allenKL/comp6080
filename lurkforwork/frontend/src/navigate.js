import { hide, show } from "./helpers.js";
import { getFromLocal } from "./localStorage.js";

export function toLogInPage() {
    document.getElementById('login-page').classList.remove('hide');
    document.getElementById('register-page').classList.add('hide');
    document.getElementById('feed-page').classList.add('hide');
    document.getElementById('profile-page').classList.add('hide');
    hide('feed-page-nav');
    hide('feed-btn');
    hide('logout-btn')
    if (getFromLocal('token')){
        show('my-profile-btn');
    }
    else{
        hide('my-profile-btn');
    }
    show('login-btn')
}

export function toRegisterPage() {
    document.getElementById('register-page').classList.remove('hide');
    document.getElementById('feed-page').classList.add('hide');
    document.getElementById('login-page').classList.add('hide');
    document.getElementById('profile-page').classList.add('hide');
    hide('feed-page-nav');
    if (getFromLocal('token')){
        show('feed-btn');
    }
    else{
        hide('feed-btn');
    }
    
}

export function toFeedPage() {
    document.getElementById('feed-page').classList.remove('hide');
    document.getElementById('register-page').classList.add('hide');
    document.getElementById('login-page').classList.add('hide');
    document.getElementById('profile-page').classList.add('hide');
    show('feed-page-nav');
    hide('login-btn');
    show('my-profile-btn');
    show('feed-btn');
    show('logout-btn');
    window.location.hash = '#feed'
}

export function toProfilePage() {
    document.getElementById('profile-page').classList.remove('hide');
    document.getElementById('register-page').classList.add('hide');
    document.getElementById('login-page').classList.add('hide');
    document.getElementById('feed-page').classList.add('hide');
    hide('login-btn')
    hide('feed-page-nav');
    show('feed-btn');
    show('my-profile-btn')
    show('logout-btn');
}
