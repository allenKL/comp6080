import { getFromLocal } from "./localStorage.js";

//login fetch
export function fetchFromUrl(request, data, _id=0) {
    if (request === 'login') {
        const options = {
            method: 'POST',
            headers: {
                'Content-type':  'application/json'
            },
            body: JSON.stringify({
                email: data[0],
                password: data[1],
            }),
        }
        return fetch('http://localhost:5005/auth/login', options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        
                        
                        return data;
                    }
                })
            })
    }
//register fetch
    if (request === 'register') {
        const options = {
            method: 'POST',
            headers: {
                'Content-type':  'application/json'
            },
            body: JSON.stringify({
                email: data[0],
                password: data[1],
                name: data[2],
            }),
        }
        return fetch('http://localhost:5005/auth/register', options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        
                        return 'good';
                    }
                })
                
            })
    }
//get jobs
    if (request === 'get-all-jobs') {
        const options = {
            method: 'GET',
            headers: {
                'Content-type':  'application/json',
                'Authorization': `Bearer ${getFromLocal('token')}`,
            },
            
        }
        
        return fetch(`http://localhost:5005/job/feed?start=${_id}`, options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        
                        return data;
                    }
                })
                
            })
    }
//create job
    if (request === 'create-job') {
        const date = new Date();
        const formattedDate = date.toISOString();
        const options = {
            method: 'POST',
            headers: {
                'Content-type':  'application/json',
                'Authorization': `Bearer ${getFromLocal('token')}`,
            },
            body: JSON.stringify({
                title: data[0],
                image: data[1],
                start:  formattedDate,
                description: data[2]
            }),
        }
        return fetch('http://localhost:5005/job', options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        
                    }
                })
            })
    }
//update a job
    if (request === 'update-job') {
        
        const date = new Date();
        const formattedDate = date.toISOString();
        const options = {
            method: 'PUT',
            headers: {
                'Content-type':  'application/json',
                'Authorization': `Bearer ${getFromLocal('token')}`,
            },
            body: JSON.stringify({
                id: _id,
                title: data[0],
                image: data[1],
                start: formattedDate,
                description: data[2] 
            }),
        }
        return fetch('http://localhost:5005/job', options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        return 'Update job successfully!'
                    }
                })
            })
    }
//delete a job
    if (request === 'delete-job') {
        
        const options = {
            method: 'DELETE',
            headers: {
                'Content-type':  'application/json',
                'Authorization': `Bearer ${getFromLocal('token')}`,
            },
            body: JSON.stringify({
                id: _id,
            }),
        }
        return fetch('http://localhost:5005/job', options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        return 'Delete job successfully!'
                    }
                })
            })
    }
//comment a job
    if (request === 'comment-job') {
        const options = {
            method: 'POST',
            headers: {
                'Content-type':  'application/json',
                'Authorization': `Bearer ${getFromLocal('token')}`,
            },
            body: JSON.stringify({
                id: _id,
                comment: data,
            }),
        }
        return fetch('http://localhost:5005/job/comment', options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        return 'Comment posted'
                    }
                })
            })
    }
//like a job
    if (request === 'like-job') {
        const options = {
            method: 'PUT',
            headers: {
                'Content-type':  'application/json',
                'Authorization': `Bearer ${getFromLocal('token')}`,
            },
            body: JSON.stringify({
                id: _id,
                turnon: true,
            }),
        }
        return fetch('http://localhost:5005/job/like', options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        console.log('Who liked this post:',_id)
                        console.log('response',response)
                        return 'Liked'
                    }
                })
            })
    }
//unlike a job
    if (request === 'unlike-job') {
        const options = {
            method: 'PUT',
            headers: {
                'Content-type':  'application/json',
                'Authorization': `Bearer ${getFromLocal('token')}`,
            },
            body: JSON.stringify({
                id: _id,
                turnon: false,
            }),
        }
        return fetch('http://localhost:5005/job/like', options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        console.log('Who unliked this post:',_id)
                        console.log('response',response)
                        return 'Unliked'
                    }
                })
            })
    }
//get user infomation
    if (request === 'get-user-info') {
        const options = {
            method: 'GET',
            headers: {
                'Content-type':  'application/json',
                'Authorization': `Bearer ${getFromLocal('token')}`,
            },
        }
        return fetch(`http://localhost:5005/user?userId=${_id}`, options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        return data;
                    }
                })
            })
    }
//edit profile
    if (request === 'update-profile') {
        const options = {
            method: 'PUT',
            headers: {
                'Content-type':  'application/json',
                'Authorization': `Bearer ${getFromLocal('token')}`,
            },
            body: JSON.stringify({
                email: data[0],
                password: data[1],
                name: data[2],
                image: data[3] 
            }),
        }
        return fetch('http://localhost:5005/user', options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        return 'Update profile successfully!'
                    }
                })
            })
    }
//watch a user
    if (request === 'watch-user') {
        const options = {
            method: 'PUT',
            headers: {
                'Content-type':  'application/json',
                'Authorization': `Bearer ${getFromLocal('token')}`,
            },
            body: JSON.stringify({
                email: data,
                turnon: true,
            }),
        }
        return fetch('http://localhost:5005/user/watch', options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        return 'Watched'
                    }
                })
            })
    }
//unwatch a user
    if (request === 'unwatch-user') {
        const options = {
            method: 'PUT',
            headers: {
                'Content-type':  'application/json',
                'Authorization': `Bearer ${getFromLocal('token')}`,
            },
            body: JSON.stringify({
                email: data,
                turnon: false,
            }),
        }
        return fetch('http://localhost:5005/user/watch', options)
            .then((response) => {
                return response.json()
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        return 'Unwatched'
                    }
                })
            })
    }
}