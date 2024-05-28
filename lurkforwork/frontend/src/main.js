import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl, onHashChange, messageToast, startNotice, startUpdate, clearBody } from './helpers.js';
import { fetchFromUrl } from './api.js';
import { saveToLocal, getFromLocal, removeFromLocal  } from "./localStorage.js";
import { toFeedPage, toLogInPage, toProfilePage, toRegisterPage,  } from './navigate.js'
import { renderFeed, renderProfile } from './render.js';


let start = 5;
let startNoticeInterval = null;
let startUpdateInterval = null;
//navbar buttons
document.getElementById('login-btn').addEventListener('click', toLogInPage);
//navbar buttons
document.getElementById('register-btn').addEventListener('click', toRegisterPage);
//navbar buttons
document.getElementById('feed-btn').addEventListener('click', () => {
    fetchFromUrl('get-all-jobs')
        .then((response) => {
            renderFeed(response)
            toFeedPage()
            saveToLocal('job-cache',response[0].id)
            start = 0;
        })
    
});
//navbar buttons
document.getElementById('my-profile-btn').addEventListener('click', () => {
    fetchFromUrl('get-user-info','',getFromLocal('id'))
        .then((response) => {
            renderProfile(response);
            toProfilePage();
        })
    
});
//navbar buttons
document.getElementById('logout-btn').addEventListener('click', () => {
    removeFromLocal('token');
    removeFromLocal('id');
    removeFromLocal('job-cache')
    removeFromLocal('all-jobs')
    clearInterval(startUpdateInterval);
    clearInterval(startNoticeInterval);
    toLogInPage();
});
//login submit
document.getElementById('login-submit').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const data = [email, password];
    fetchFromUrl('login', data)
        .then((userData) => {
            saveToLocal('token', userData.token);
            saveToLocal('id', userData.userId);
            fetchFromUrl('get-all-jobs')
                .then((jobs) => {
                    renderFeed(jobs);
                    messageToast('Notice','Welcome back! You have successfully logged in.')
                })
                .then(() => {
                    toFeedPage();
                    startUpdateInterval = startUpdate();
                    startNoticeInterval = startNotice();
                })
        })
})
//register submit
document.getElementById('register-submit').addEventListener('click', () => {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const name = document.getElementById('register-name').value;
    const confirm = document.getElementById('register-password-confirm').value;
    if (password != confirm) {
        alert('Password do not match! Try again.')
    }
    else{
        const data = [email, password, name];
        fetchFromUrl('register', data);
        messageToast('Notice','Congratulations! You have successfully registered an account.')
        if (getFromLocal('token')){
            toFeedPage()
        }else{
            toLogInPage()
        }
    }
})
//edit profile submit
document.getElementById('edit-submit').addEventListener('click', () => {
    const newEmail = document.getElementById('edit-email').value;
    const newName = document.getElementById('edit-name').value;
    const newPassword = document.getElementById('edit-password').value;
    const newImage = document.getElementById('edit-image').files[0];
    if (!newImage) {
        messageToast('Error','Please select an valid image.')
    }
    fileToDataUrl(newImage)
        .then((response) => {
            const data = [newEmail, newPassword, newName, response]
            fetchFromUrl('update-profile',data,'')
                .then(() => {
                    messageToast('Notice','Profile update successful! Your changes have been saved, click the profile button to refresh.')
                })
        })
});
//submit for a post
document.getElementById('post-submit').addEventListener('click',() => {
    const jobTitle = document.getElementById('title-input').value;
    const jobImage = document.getElementById('image-input').files[0];
    const jobDescription = document.getElementById('description-input').value;
    fileToDataUrl(jobImage)
        .then((response) => {
            const data = [jobTitle, response, jobDescription]
            fetchFromUrl('create-job',data,'')
                .then(() => {
                    messageToast('Notice','Job posting successful!')
                })
        })
})
//submit for updating a job
document.getElementById('update-submit').addEventListener('click', () => {
    const newTitle = document.getElementById('update-title').value;
    const newDescription = document.getElementById('update-description').value;
    const newImage = document.getElementById('update-image').files[0];
    fileToDataUrl(newImage)
        .then((response) => {
            const data = [newTitle, response, newDescription]
            fetchFromUrl('update-job',data,getFromLocal('jobId'))
                .then(() => {
                    messageToast('Notice','Job update successful! Your changes have been saved, click the feed button to refresh.')
                })
        })
})
//live generate comment component
export function liveUpdateComments() {
    const commentAmount = document.querySelectorAll(`#comment-amount`);
    const commentBody = document.querySelectorAll(`#comment-body`);
    commentAmount.forEach((item) => {
        const jobId = item.getAttribute('job-id')
        for (let i = 0; i <= start; i += 5) {
            fetchFromUrl('get-all-jobs','',i)
            .then((response) => {
                response.forEach((job) => {
                    if (job.id == jobId) {
                        item.textContent = `${job.comments.length} comments`
                        commentBody.forEach((body) => {
                            if (body.getAttribute('job-id') == job.id){
                                if (body.childElementCount != job.comments.length){
                                    clearBody('#comment-body',job.id);
                                    job.comments.forEach((item) => {
                                    const modelBodyPartC = document.createElement('div');
                                    const commentUser = document.createElement('a');
                                    const comments = document.createElement('p');
                                    const string = document.createElement('span');
                                    commentUser.classList.add('link');
                                    commentUser.setAttribute('data-bs-dismiss','modal');
                                    commentUser.setAttribute('aria-label','close');
                                    modelBodyPartC.classList.add('modal-body')
                                    commentUser.textContent = item.userName;
                                    string.textContent = ' \'s comment:';
                                    comments.textContent = item.comment;
                                    modelBodyPartC.appendChild(commentUser);
                                    modelBodyPartC.appendChild(string);
                                    modelBodyPartC.appendChild(comments);
                                    body.appendChild(modelBodyPartC);
                                    commentUser.addEventListener('click',(e) => {
                                        fetchFromUrl('get-user-info','',item.userId)
                                            .then((response) => {
                                                renderProfile(response);
                                                toProfilePage();
                                            })
                                        })
                                    })
                                }
                            }
                        })
                    }
                })
            })
        }
    })
}

//live generate likes component
export function liveUpdateLikes() {
    const likeAmount = document.querySelectorAll(`#like-amount`);
    const likeBody = document.querySelectorAll(`#like-body`);
    likeAmount.forEach((item) => {
        const jobId = item.getAttribute('job-id')
        for (let i = 0; i <= start; i+=5) {
            fetchFromUrl('get-all-jobs','',i)
            .then((response) => {
                response.forEach((job) => {
                    if (job.id == jobId) {
                        var likeObjKey = Object.keys(job.likes)
                        var likeObjVal = Object.values(job.likes)
                        item.textContent = `${likeObjKey.length} likes`
                        likeBody.forEach((body) => {
                            if (body.getAttribute('job-id') == job.id){
                                if (body.childElementCount != likeObjKey.length){
                                    clearBody('#like-body',job.id);
                                    likeObjVal.forEach((Obj) => {
                                        const likelist = Object.values(Obj)
                                        const userInfoContainer = document.createElement('div');
                                        userInfoContainer.classList.add('modal-body');
                                        const userInfo = document.createElement('a');
                                        userInfo.classList.add('link');
                                        userInfo.setAttribute('data-bs-dismiss','modal');
                                        userInfo.textContent = `${likelist[2]}  ${likelist[1]}`
                                        userInfo.addEventListener('click', () => {
                                            fetchFromUrl('get-user-info','',likelist[0])
                                                .then((response) => {
                                                    renderProfile(response);
                                                    toProfilePage();
                                                })
                                        })
                                        userInfoContainer.appendChild(userInfo);
                                        body.appendChild(userInfoContainer);
                                    })
                                }
                            }
                        })
                    }
                })
            })
        }
    })
}
//infinite scroll
export function checkScrollPosition() {
    if (window.location.hash != '#feed'){
        return
    }
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    if (scrollTop + windowHeight > scrollHeight) {
        fetchFromUrl('get-all-jobs','',start)
            .then((response) => {
                if (response.length != 0) {
                    renderFeed(response, false)
                    start += 5
                }
            })
    }
}
window.addEventListener('scroll', checkScrollPosition);

window.addEventListener('hashchange', onHashChange());
window.onload = function () {
    onHashChange();
}
//show feed page when offline
window.addEventListener('offline', () => {
    renderFeed(JSON.parse(getFromLocal('all-jobs')))
    toFeedPage();
});
//offline notice
window.addEventListener('offline', () => {
    messageToast('Error','"Warning: You are currently offline. Some features may not work as expected. Please check your internet connection."')
});
