/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
import { renderProfile, renderFeed } from "./render.js";
import { toProfilePage, toFeedPage, toLogInPage } from "./navigate.js";
import { getFromLocal, saveToLocal } from "./localStorage.js";
import { liveUpdateComments, liveUpdateLikes } from "./main.js";
import { fetchFromUrl } from "./api.js";




export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

export function hide(id) {
    document.getElementById(id).classList.add('hide');
}

export function show(id) {
    document.getElementById(id).classList.remove('hide');
}

export function clearPage(id) {
    const Page = document.querySelector(id);
    while (Page.firstChild) {
        Page.removeChild(Page.firstChild);
    }
}
//time convert
export function displayJobPostTime(postTime) {
    const now = new Date();
    const postDate = new Date(postTime);
    const timeDifference = now - postDate;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hoursDifference < 24) {
        if (hoursDifference == 0) {
            return `${minutesDifference % 60} minutes ago`;
        }
        return `${hoursDifference} hours and ${minutesDifference % 60} minutes ago`;
    } else {
        const day = String(postDate.getDate()).padStart(2, '0');
        const month = String(postDate.getMonth() + 1).padStart(2, '0');
        const year = postDate.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
//hash location
export function onHashChange() {
    const hash = window.location.hash;
    if (hash.startsWith('#profile=') && getFromLocal('token')) {
        fetchFromUrl('get-user-info','',getFromLocal('id'))
        .then((response) => {
            renderProfile(response);
            toProfilePage();
        })
    } else if (hash == '#feed' && getFromLocal('token')) {
        fetchFromUrl('get-all-jobs')
            .then((response) => {
                renderFeed(response)
                toFeedPage();
            })
        
    } else {
        if (getFromLocal('token')) {
            fetchFromUrl('get-all-jobs')
            .then((response) => {
                renderFeed(response)
                toFeedPage();
            })
        }else{
            toLogInPage();
        }
    }
}
//toast model
export function messageToast(header, message) {
    const toastElement = document.querySelector('.toast');
    const toastBodyElement = toastElement.querySelector('.toast-body');
    const toastHeader = toastElement.querySelector('.toast-header');
    toastHeader.textContent = header;
    toastBodyElement.textContent = message;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

export function startUpdate() {
    return setInterval(() => {
        if (getFromLocal('token')) {
            liveUpdateComments();
            liveUpdateLikes();
            fetchFromUrl('get-all-jobs')
            .then((response) => {
                if (response) {
                    saveToLocal('all-jobs',JSON.stringify(response))
                }
            })
        }
    },1000);
}

export function startNotice() {
    return setInterval(() => {
        if (getFromLocal('token')) { 
        notification();
        }
    },5000);
}


//new job notification
export function notification () {
    if (!getFromLocal('job-cache')){
        fetchFromUrl('get-all-jobs')
            .then((response) => {
                let latest = response[0].id;
                saveToLocal('job-cache',latest)
            })
    }
    else{
        fetchFromUrl('get-all-jobs')
            .then((response) => {
                let latest = response[0].id;
                if (getFromLocal('job-cache') != latest){
                    messageToast('Notice','A new job posted! Click the feeds button to refresh.')
                }
            })
    }
}

export function clearBody(name,id) {
    const comments = document.querySelectorAll(name);
    comments.forEach((comment) => {
        if (comment.getAttribute('job-id') == id){
            while (comment.firstChild) {
                comment.removeChild(comment.firstChild);
            }
        }
    })
}