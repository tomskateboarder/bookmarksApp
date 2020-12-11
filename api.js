const BASE_URL = 'https://thinkful-list-api.herokuapp.com/tomevans/bookmarks';

function listApiFetch(...args) {
    let error;
    return fetch(...args)
        .then(res => {
            if(!res.ok) {
                error = { code: res.status };
            }

            if(!res.headers.get('content-type').includes('json')) {
                error.message = res.statusText;
                return Promise.reject(error);
            }

            return res.json();
        })
        .then(data => {
            if(error) {
                error.message = data.message;
                return Promise.reject(error);
            }
            return data;
        })
}

// GET items from API
function getItems() {
    return listApiFetch(`${BASE_URL}`);
}

// POST item to API
function createItem(title, url, desc, rating) {
    let newBookmark = {
        'title': title,
        'url': url,
        'desc': desc,
        'rating': rating
    };
    
    newBookmark = JSON.stringify(newBookmark);


    return listApiFetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newBookmark
    });
}

// PATCH item to API
function updateItem(id, updateData) {
    let newUrl = `${BASE_URL}/${id}`;
    let newItem = JSON.stringify(updateData);

    return listApiFetch(newUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: newItem
    });
}

// DELETE item from API
function deleteItem(id) {
    let newUrl = `${BASE_URL}/${id}`;

    return listApiFetch(newUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
}

export default {
    getItems,
    createItem,
    updateItem,
    deleteItem
};