import { fetchFromUrl } from "./api.js";
import { messageToast, hide, show, clearPage, displayJobPostTime} from "./helpers.js";
import { toProfilePage } from "./navigate.js";
import { getFromLocal } from "./localStorage.js";

//render feed page
export function renderFeed(data,clear=true) {
    if (clear) {
        clearPage('#feed-page')
    }
    data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
        });
    data.forEach(element => {
        const card = document.createElement('div');
        const cardBody = document.createElement('div');
        const cardTitle = document.createElement('h5');
        const cardText = document.createElement('p');
        const cardImage = document.createElement('img');
        const iconsContainer = document.createElement('div');
        const amountContainer = document.createElement('div');
        const likeAmountContainer = document.createElement('div');
        const commentAmountContainer = document.createElement('div');
        const commentIcon = document.createElement('i');
        const likeIcon = document.createElement('i');
        const unlikeIcon = document.createElement('i');
        const likeAmount = document.createElement('a');
        const commentAmount = document.createElement('a');
        const likeButton = document.createElement('button');
        const unlikeButton = document.createElement('button');
        const commentButton = document.createElement('button');
        const likeLabel = document.createElement('span')
        const likeLabel1 = document.createElement('span')
        const commentLabel = document.createElement('span')
        likeLabel.textContent = 'Like';
        likeLabel1.textContent = 'Like';
        commentLabel.textContent = 'Comment';
        const timeStamp = document.createElement('small');
        cardImage.src = element.image
        cardImage.style.width = '100%';
        cardImage.style.height = '100%';
        cardTitle.textContent = element.title;
        cardText.textContent = element.description;
        timeStamp.textContent = displayJobPostTime(element.createdAt);
        var array = Object.keys(element.likes);
        var likeObject = Object.values(element.likes);
        likeAmount.textContent = `${array.length} likes`;
        commentAmount.textContent =  `${element.comments.length} comments`;
        card.classList.add('card');
        card.classList.add('mb-3');
        cardBody.classList.add('card-body');
        cardTitle.classList.add('card-title');
        cardText.classList.add('card-text');
        amountContainer.classList.add('show-amounts');
        likeAmount.classList.add('link');
        likeAmount.setAttribute('data-bs-toggle','modal')
        likeAmount.setAttribute('data-bs-target',`#likeModal${element.id}`)
        likeAmount.setAttribute('job-id',`${element.id}`)
        likeAmount.setAttribute('id','like-amount')
        commentAmount.classList.add('link');
        commentAmount.setAttribute('id','comment-amount')
        commentAmount.setAttribute('job-id',`${element.id}`)
        likeButton.classList.add('btn');
        likeButton.classList.add('btn-outline-secondary');
        likeButton.classList.add('like');
        unlikeButton.classList.add('btn');
        unlikeButton.classList.add('btn-outline-secondary');
        unlikeButton.classList.add('hide');
        unlikeButton.classList.add('unlike');
        commentButton.classList.add('btn');
        commentButton.classList.add('btn-outline-secondary');
        commentButton.setAttribute('data-bs-toggle','collapse');
        commentButton.setAttribute('data-bs-target',`#collapseComment${element.id}`);
        commentButton.setAttribute('aria-expanded','false')
        likeButton.setAttribute('type','button');
        unlikeButton.setAttribute('type','button');
        likeButton.setAttribute('id',`${element.id}`);
        unlikeButton.setAttribute('id',`${element.id}`);
        commentButton.setAttribute('type','button');
        commentAmount.setAttribute('data-bs-toggle',"modal");
        commentAmount.setAttribute('data-bs-target',`#commentModal${element.id}`);
        iconsContainer.classList.add('icon-flex');
        likeIcon.classList.add('fa-regular');
        likeIcon.classList.add('fa-heart');
        unlikeIcon.classList.add('fa-solid');
        unlikeIcon.classList.add('fa-heart');
        commentIcon.classList.add('fa-regular');
        commentIcon.classList.add('fa-comment');
        const posterInfo = document.createElement('a');
        posterInfo.classList.add('link');
        const modelBox1 = document.createElement('div');
        const modelBox2 = document.createElement('div');
        const modelBody = document.createElement('div');
        const closeButtonContainer = document.createElement('div');
        const closeButton = document.createElement('button');
        const textBodyL = document.createElement('div');
        textBodyL.setAttribute('id','like-body')
        textBodyL.setAttribute('job-id',`${element.id}`)
        modelBox1.classList.add('modal')
        modelBox1.classList.add('fade')
        modelBox1.setAttribute('id',`likeModal${element.id}`)
        modelBox1.setAttribute('tabindex','-1')
        modelBox1.setAttribute('aria-labelledby','exampleModalLabel')
        modelBox1.setAttribute('aria-hidden','true')
        modelBox2.classList.add('modal-dialog');
        modelBody.classList.add('modal-content');
        closeButtonContainer.classList.add('modal-header');
        closeButton.classList.add('btn-close');
        closeButton.setAttribute('type','button');
        closeButton.setAttribute('data-bs-dismiss','modal');
        closeButton.setAttribute('aria-label','close');
        closeButtonContainer.appendChild(closeButton)
        modelBody.appendChild(closeButtonContainer)
        //to those liked the post people profile 
        likeObject.forEach((object) => {
            let item = Object.values(object);
            const userInfoContainer = document.createElement('div');
            userInfoContainer.classList.add('modal-body');
            const userInfo = document.createElement('a');
            userInfo.classList.add('link');
            userInfo.setAttribute('data-bs-dismiss','modal');
            userInfo.textContent = `${item[2]}  ${item[1]}`
            userInfo.addEventListener('click', () => {
                fetchFromUrl('get-user-info','',item[0])
                    .then((response) => {
                        renderProfile(response);
                        toProfilePage();
                    })
                
            })
            userInfoContainer.appendChild(userInfo);
            textBodyL.appendChild(userInfoContainer);
        })
        modelBody.appendChild(textBodyL);
        modelBox2.appendChild(modelBody);
        modelBox1.appendChild(modelBox2);
        const commentCollapse = document.createElement('div');
        const commentText = document.createElement('textarea');
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit'
        commentCollapse.classList.add('collapse');
        commentCollapse.classList.add('comment-area');
        commentCollapse.setAttribute('id',`collapseComment${element.id}`);
        commentText.classList.add('form-control')
        commentText.classList.add('text-content')
        commentText.setAttribute('id',`commentInput${element.id}`);
        commentText.setAttribute('aria-labe','With textarea');
        commentText.setAttribute('placeholder','Add a comment...');
        submitButton.classList.add('btn')
        submitButton.classList.add('comment-submit')
        submitButton.classList.add('btn-primary');
        submitButton.setAttribute('data-bs-toggle','collapse');
        submitButton.setAttribute('data-bs-target',`#collapseComment${element.id}`);
        submitButton.setAttribute('aria-expanded','true')
        submitButton.setAttribute('job-id',element.id);
        commentCollapse.appendChild(commentText);
        commentCollapse.appendChild(submitButton);
        submitButton.addEventListener('click', ()=> {
            const jobId = submitButton.getAttribute('job-id');
            const commentInput = document.getElementById(`commentInput${jobId}`).value
            fetchFromUrl('comment-job',commentInput,jobId)
            messageToast('Notice','Comment submited.')
        })
        document.querySelector('#feed-page').appendChild(modelBox1);
        fetchFromUrl('get-user-info','',element.creatorId) 
            .then((response) => {
                posterInfo.textContent = response.name;
                cardBody.appendChild(posterInfo)
                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardBody.appendChild(timeStamp);
                likeAmountContainer.appendChild(likeAmount);
                commentAmountContainer.appendChild(commentAmount);
                amountContainer.appendChild(likeAmountContainer);
                amountContainer.appendChild(commentAmountContainer);
                likeButton.appendChild(likeIcon);
                likeButton.appendChild(likeLabel);
                unlikeButton.appendChild(unlikeIcon);
                unlikeButton.appendChild(likeLabel1);
                commentButton.appendChild(commentIcon);
                commentButton.appendChild(commentLabel);
                iconsContainer.appendChild(likeButton);
                iconsContainer.appendChild(unlikeButton);
                iconsContainer.appendChild(commentButton);
                cardBody.appendChild(amountContainer);
                cardBody.appendChild(iconsContainer)
                card.appendChild(cardImage);
                card.appendChild(cardBody);
                card.appendChild(commentCollapse)
            })
        const modelBox1C = document.createElement('div');
        const modelBox2C = document.createElement('div');
        const modelBodyC = document.createElement('div');
        const closeButtonContainerC = document.createElement('div');
        const modalFooterC = document.createElement('div');
        const closeButtonC = document.createElement('button');
        const textBodyC = document.createElement('div');
        textBodyC.setAttribute('id','comment-body')
        textBodyC.setAttribute('job-id',`${element.id}`)
        modelBox1C.classList.add('modal')
        modelBox1C.classList.add('fade')
        modelBox1C.setAttribute('id',`commentModal${element.id}`)
        modelBox1C.setAttribute('tabindex','-1')
        modelBox1C.setAttribute('aria-labelledby','exampleModalLabel')
        modelBox1C.setAttribute('aria-hidden','true')
        modelBox2C.classList.add('modal-dialog');
        modelBodyC.classList.add('modal-content');
        modalFooterC.classList.add('modal-footer');
        closeButtonContainerC.classList.add('modal-header');
        closeButtonC.classList.add('btn-close');
        closeButtonC.setAttribute('type','button');
        closeButtonC.setAttribute('data-bs-dismiss','modal');
        closeButtonC.setAttribute('aria-label','close');
        closeButtonContainerC.appendChild(closeButtonC);
        modelBodyC.appendChild(closeButtonContainerC)
        element.comments.forEach(item => {
            fetchFromUrl('get-user-info','',item.userId)
                .then((response) => {
                    const modelBodyPartC = document.createElement('div');
                    const commentUser = document.createElement('a');
                    const comments = document.createElement('p');
                    const string = document.createElement('span');
                    commentUser.classList.add('link');
                    commentUser.setAttribute('data-bs-dismiss','modal');
                    commentUser.setAttribute('aria-label','close');
                    modelBodyPartC.classList.add('modal-body')
                    modelBodyPartC.setAttribute('id','numbers')
                    commentUser.textContent = response.name;
                    string.textContent = ' \'s comment:';
                    comments.textContent = item.comment;
                    modelBodyPartC.appendChild(commentUser);
                    modelBodyPartC.appendChild(string);
                    modelBodyPartC.appendChild(comments);
                    textBodyC.appendChild(modelBodyPartC);
                    modelBodyC.appendChild(textBodyC);
                    commentUser.addEventListener('click',(e) => {
                        renderProfile(response);
                        toProfilePage();
                    })
                })
        })
        modelBox2C.appendChild(modelBodyC);
        modelBox1C.appendChild(modelBox2C);
        document.querySelector('#feed-page').appendChild(modelBox1C);
        document.querySelector('#feed-page').appendChild(card);
        //like and unlike event
        likeButton.addEventListener('click',(e) => {
            e.target.closest('.like').classList.add('hide');
            e.target.closest('.like').nextElementSibling.classList.remove('hide');
            fetchFromUrl('like-job','',element.id)
            messageToast('Notice','You liked the post.')
        })
        unlikeButton.addEventListener('click',(e) => {
            e.target.closest('.unlike').classList.add('hide');
            e.target.closest('.unlike').previousElementSibling.classList.remove('hide');
            fetchFromUrl('unlike-job','',element.id)
            messageToast('Notice','You unliked the post.')
                
        })
        //to poster's profile
        posterInfo.addEventListener('click',() => {
        fetchFromUrl('get-user-info','',element.creatorId)
            .then((response) => {
                clearPage('#profile-page')
                renderProfile(response)
                toProfilePage();
            })
        })
    });
} 

//render profile page
export function renderProfile (userInfo) {
    clearPage('#profile-page');
    //assemble the profile component
    const profileCard = document.createElement('div');
    const profileCardBody = document.createElement('div');
    const profileCardImage = document.createElement('img');
    const imgContainer = document.createElement('div');
    const textContainer = document.createElement('div');
    const userEmail = document.createElement('p');
    const userName = document.createElement('h1');
    const watchButton = document.createElement('button');
    const unwatchButton = document.createElement('button');
    const watchButtonContainer = document.createElement('div')
    const watchAmount = document.createElement('a');
    const watchAmountContainer = document.createElement('div');
    const showAmounts = document.createElement('div');
    const watchIcon = document.createElement('i');
    const unwatchIcon = document.createElement('i');
    const watchLabel = document.createElement('span');
    const watchLabel1 = document.createElement('span');
    watchLabel.textContent = 'watch';
    watchLabel1.textContent = 'watch';
    const modelBox1 = document.createElement('div');
    const modelBox2 = document.createElement('div');
    const modelBody = document.createElement('div');
    const closeButtonContainer = document.createElement('div');
    const closeButton = document.createElement('button');
    var array = userInfo.watcheeUserIds;
    watchAmount.textContent = `${array.length} watches`;
    profileCardImage.src = userInfo.image;
    userEmail.textContent = userInfo.email;
    userName.textContent = userInfo.name;
    modelBox1.classList.add('modal')
    modelBox1.classList.add('fade')
    modelBox1.setAttribute('id','watch-list')
    modelBox1.setAttribute('tabindex','-1')
    modelBox1.setAttribute('aria-labelledby','exampleModalLabel')
    modelBox1.setAttribute('aria-hidden','true')
    modelBox2.classList.add('modal-dialog');
    modelBody.classList.add('modal-content');
    closeButtonContainer.classList.add('modal-header');
    closeButton.classList.add('btn-close');
    closeButton.setAttribute('type','button');
    closeButton.setAttribute('data-bs-dismiss','modal');
    closeButton.setAttribute('aria-label','close');
    profileCard.classList.add('card');
    profileCard.classList.add('mb-3');
    profileCardBody.classList.add('row');
    profileCardBody.classList.add('g-0');
    textContainer.classList.add('col-md-8')
    imgContainer.classList.add('col-md-4');
    profileCardImage.classList.add('img-fluid');
    userEmail.classList.add('user-email');
    userName.classList.add('user-name');
    watchIcon.classList.add('fa-regular');
    watchIcon.classList.add('fa-eye');
    unwatchIcon.classList.add('fa-solid');
    unwatchIcon.classList.add('fa-eye');
    watchButton.classList.add('btn');
    watchButton.classList.add('btn-outline-secondary');
    unwatchButton.classList.add('btn');
    unwatchButton.classList.add('btn-outline-secondary');
    unwatchButton.classList.add('hide');
    showAmounts.classList.add('show-amounts');
    watchAmount.classList.add('link');
    watchAmount.setAttribute('data-bs-toggle','modal')
    watchAmount.setAttribute('data-bs-target','#watch-list')
    watchButton.setAttribute('type','button')
    unwatchButton.setAttribute('type','button')
    watchButton.setAttribute('id','watching')
    unwatchButton.setAttribute('id','unwatching')
    watchButton.appendChild(watchIcon);
    watchButton.appendChild(watchLabel);
    unwatchButton.appendChild(unwatchIcon);
    unwatchButton.appendChild(watchLabel1);
    watchButtonContainer.appendChild(watchButton);
    watchButtonContainer.appendChild(unwatchButton);
    watchAmountContainer.appendChild(watchAmount);
    imgContainer.appendChild(profileCardImage);
    textContainer.appendChild(userName);
    textContainer.appendChild(userEmail);
    showAmounts.appendChild(watchButtonContainer);
    showAmounts.appendChild(watchAmountContainer);
    profileCardBody.appendChild(imgContainer);
    profileCardBody.appendChild(textContainer);
    profileCardBody.appendChild(showAmounts);
    profileCard.appendChild(profileCardBody);
    modelBody.appendChild(closeButtonContainer);
    //if it is my profile, add a edit component 
    if (userInfo.id == getFromLocal('id')) {
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('btn')
        editButton.classList.add('btn-primary')
        editButton.classList.add('edit-btn')
        editButton.setAttribute('type','button');
        editButton.setAttribute('data-bs-toggle','modal');
        editButton.setAttribute('data-bs-target','#editModal');
        textContainer.appendChild(editButton);
    }
    array.forEach((id) => {
        const userInfoContainer = document.createElement('div');
        userInfoContainer.classList.add('modal-body');
        const userInfo = document.createElement('a');
        userInfo.classList.add('link');
        userInfo.setAttribute('data-bs-dismiss','modal');
        userInfo.setAttribute('aria-label','close');
        fetchFromUrl('get-user-info','',id)
            .then((response) => {
                userInfo.textContent = `${response.name}  ${response.email}`
                userInfo.addEventListener('click', () => {
                    clearPage('#profile-page');
                    renderProfile(response);
                    toProfilePage();
                })
                userInfoContainer.appendChild(userInfo);
                modelBody.appendChild(userInfoContainer);
            })
    })
    closeButtonContainer.appendChild(closeButton);
    modelBox2.appendChild(modelBody);
    modelBox1.appendChild(modelBox2);
    document.querySelector('#profile-page').appendChild(profileCard);
    const header = document.createElement('h2');
    if (userInfo.id == getFromLocal('id')) {
        header.textContent = 'My posts:';
    }
    else{
        header.textContent = `${userInfo.name}'s posts:`;
    }
    
    document.querySelector('#profile-page').appendChild(header);
    //reverse order display
    userInfo.jobs.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
        });
    //render posts
    userInfo.jobs.forEach(job => {
        const card = document.createElement('div');
        const cardBody = document.createElement('div');
        const cardTitle = document.createElement('h5');
        const cardText = document.createElement('p');
        const cardImage = document.createElement('img');
        const dateString = job.createdAt;
        const timeStamp = document.createElement('p');
        const formattedDate = displayJobPostTime(dateString);
        cardImage.src = job.image; 
        cardImage.style.width = '100%';
        cardImage.style.height = '100%';
        cardTitle.textContent = job.title;
        cardText.textContent = job.description;
        timeStamp.textContent = formattedDate;
        card.classList.add('card');
        card.classList.add('mb-3');
        cardBody.classList.add('card-body');
        cardTitle.classList.add('card-title');
        cardText.classList.add('card-text');
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(timeStamp);
        card.appendChild(cardImage);
        card.appendChild(cardBody);
        document.querySelector('#profile-page').appendChild(card);
    });

    array.forEach((id) => {
        if (id == getFromLocal('id')) {
            hide('watching')
            show('unwatching')
        }
    })
    //watch and unwatch event
    watchButton.addEventListener('click',() => {
        watchButton.classList.add('hide');
        unwatchButton.classList.remove('hide');
        messageToast('Notice','Watching successful.')
        fetchFromUrl('watch-user',userInfo.email,'')
    })
    unwatchButton.addEventListener('click',() => {
        unwatchButton.classList.add('hide');
        watchButton.classList.remove('hide');
        messageToast('Notice','Unwatching successful.')
        fetchFromUrl('unwatch-user',userInfo.email,'')
    })
    document.querySelector('#profile-page').appendChild(modelBox1);
    
}
