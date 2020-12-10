// import $ from 'jquery';

import api from './api.js';
import store from './store.js';



// Main Page 

function generateMainPage(bookmark) {
     // HTML loop with title and rating 
    
    // bookmark HTML structure and variable strings/dummy array
    let bookmarkStructure = "";
    let description = "";
    let rating = "";
    let filteredBookmarks = [];
    let filteredHtml = "";

    // Conditional for filter dropdown menu 
    // Sets selected filter menu to the top selected rating.
   
    if(store.filter !== -1) {
        filteredBookmarks = bookmark.filter(item => item.rating >= store.filter);

        filteredHtml = `
            <select name="filter-menu" class="js-filter-menu">
                <option disabled>Filter By:</option>
            `;
// loop
        for(let i = 1; i <= 5; i++) {
            if(i === store.filter) {
                    filteredHtml += `<option value="${i}" selected>${i}+ Stars</option>`;
                
            } else {
                    filteredHtml += `<option value="${i}">${i}+ Stars</option>`;
            }
        }

        filteredHtml += `</select>`;

    } else {
        filteredBookmarks = bookmark;

        filteredHtml = `
            <select name="filter-menu" class="js-filter-menu">
                <option disabled selected>Filter By:</option>
                <option value="1">1+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5+ Stars</option>
            </select>
        `;
    }
    
    
    filteredBookmarks.forEach(item => {

        // conditional for empty info
        
        if(item.desc === null || item.desc === "") {
            description = "No description provided.";
           
        } else {
            description = item.desc;
        }

        // Conditional for rating
        let ratingHtml = "";

        if(item.rating !== null) {
            rating = item.rating;

            for(let i = 1; i <= rating; i++) {
                ratingHtml += `<div class="star-inner"></div>`;
            }
        } else {
            ratingHtml = `<div class="no-rating-box">No Rating</div>`;
        }

        // conditional for accordion
        if(item.expanded) {
            bookmarkStructure += `
            <li class="combo-container">
                <div class="bookmark-container" tabindex="0" role="tab">
                    <div class="title-box">${item.title}</div>
                    <div class="star-box">${ratingHtml}</div>
                </div>
                <div class="info-container" data-item-id="${item.id}">
                    <div class="info-inner-top">
                        <div class="info-inner-url-container">
                            <button onclick="window.location.href = '${item.url}';" class="info-url-button">Visit Site</button>
                        </div>
                        <div class="info-inner-controls">
                            <button class="info-edit-button">Edit</button>
                            <button class="info-trash-button">Delete</button>
                        </div>
                    </div>
                    <div class="info-inner-bottom">
                        ${description}
                    </div>
                </div>
            </li>
            `;
        } else {
            bookmarkStructure += `
            <li class="combo-container">
                <div class="bookmark-container" tabindex="0" role="tab">
                    <div class="title-box">${item.title}</div>
                    <div class="star-box">${ratingHtml}</div>
                </div>
                <div class="info-container" data-item-id="${item.id}">
                </div>
            </li>
            `;
        }
    });

    // add bookmark
    let mainStructure = `
        <section class="main-container">
            <section class="upper-container" role="menu">
                <button class="new-button">+ New</button>
                ${filteredHtml}
            </section>
            <ul class="lower-container" role="tablist">
                ${bookmarkStructure}
            </ul>
        </section>
        <section class="js-error-message hidden" role="errorhandler">ERROR: ${store.errorMessage} </section>
        `;


    return mainStructure;
}

// create and edit bookmark

function generateCreateOrEditBookmark(bookmark) {
    
    let headerString = "Add New Bookmark:";
    let titleString = ""; 
    let urlString = ""; 
    let descriptionString = ""; 
    let rating = -1; 
    let ratingHtmlString = ""; 
    let buttonString = `<button type="submit" class="create-button">Create</button>`; 
    let formString = '<form class="add-form" role="form">'; 

    // conditional for editing
    if(store.edit) {
        headerString = "Edit Current Bookmark:"; 
        titleString = `value="${bookmark.title}"`; 
        urlString = `value="${bookmark.url}"`; 
        
        rating = bookmark.rating; 
        buttonString = `<button type="submit" class="js-edit-button">Edit</button>`; 
        formString = '<form class="edit-form" role="form">'; 

        // conditional for description
        if(bookmark.desc === null) {
            descriptionString = "";
        } else {
            descriptionString = bookmark.desc;
        }
    } 

    // loop for rating
    
    for(let i = 1; i <= 5; i++) {
        let checked = "";
        // condtional for rating being checked
        if(i === Number(rating) && store.edit) {
            console.log(`checked condition met at ${i}`);
            checked = "checked";
        }

        ratingHtmlString += `<input type="radio" name="rating" class="js-add-rating" id="rating${i}" value="${i}" ${checked}>
        <label class="star" for="rating${i}"> <p>${i}</p> </label>`
    }

    // structure
    let createStructure = `
    <div class="main-container">
        ${formString}
            <section class="add-upper-container" role="URL entry">
                    <label for="add-input">${headerString}</label>
                    <input type="text" name="url" class="js-add-input" placeholder="https://www.example.com" ${urlString} required>
            </section>
            <section class="add-lower-container" role="lower controls">
                <div class="add-inner-top" role="title entry">
                    <input type="text" name="title" class="js-add-inner-title" placeholder="Title goes here" ${titleString} required>
                </div>
                <div class="add-inner-bottom">
                    <div class="add-inner-rating" role="rating entry">
                        ${ratingHtmlString} 
                    </div>
                    <textarea role="description entry" name="desc" class="js-add-inner-description" placeholder="Add a description" required>${descriptionString}</textarea>
                </div>
            </section>
            <section class="add-button-container">
                <button class="cancel-button">Cancel</button>
                ${buttonString}
            </section>
            <section class="js-error-message hidden" role="errorhandler">ERROR: ${store.errorMessage} </section>
        </form>
    </div>
    `;

    return createStructure;
}


function generatePageString(data) {
    console.log(`Ran generatePageString`);

    let pageString = "";
    let bookmark = store.findById(store.tempId); 

    // condtional for create or edit bookmark or go to main page
    if(store.adding) {
        pageString = generateCreateOrEditBookmark(bookmark);
    } else {
        pageString = generateMainPage(data);
    }

    return pageString;
}

function renderPage() {
    console.log("Rendering page");

   
    const pageString = generatePageString(store.bookmarks);


    // main HTML
    $('main').html(pageString);

    // condtional for error
    if(store.error === 1) {
        $('.js-error-message').removeClass('hidden');
    } else if(store.error === 0) {
        $('.js-error-message').addClass('hidden');
    }
}


function getInnerContainerId (target) {
    return $(target)
        .closest('.combo-container')
        .find('.info-container')
        .data('item-id');
}

// bookmark accordion
function handleBookmarkClicked () {
    $('main').on('click', '.bookmark-container', event => {
        const id = getInnerContainerId(event.currentTarget);
        console.log(`handleBookmarkClicked ran`);

        // Find ID, toggle accordion, and re-render page
        const item = store.findById(id);
        const itemObj = { expanded: !item.expanded };
        store.findAndUpdate(id, itemObj);
        renderPage();
    });
}

// Expand bookmark
function handleBookmarkKeyPress () {
    $('main').on('keypress', '.bookmark-container', event => {
        

        // // Find ID, toggle expanded property, and re-render page
       
        var keycode = (event.keyCode ? event.keyCode : event.which);
        const id = getInnerContainerId(event.currentTarget);
        console.log(`handleBookmarkKeyPress ran`);
        if(keycode == '13'){

    
            
            const item = store.findById(id);
            const itemObj = { expanded: !item.expanded };
            store.findAndUpdate(id, itemObj);
            renderPage();
        }
    });
}

// new bookmark button
function handleNewButtonClicked () {
    $('main').on('click', '.new-button', event => {
        console.log(`ran handleNewButtonClicked`);

        
        store.adding = true;
        store.edit = false;
        renderPage();
    });
}

// cancel button
function handleCancelButtonClicked() {
    $('main').on('click', '.cancel-button', event => {
        console.log(`ran handleNewButtonClicked`);

        // main page render default
        store.error = 0;
        store.adding = false;
        store.edit = false;
        renderPage();
    });
}

// create button
function handleCreateButtonClicked() {
    $('main').on('submit', '.add-form', event => {
        event.preventDefault();
        console.log(`ran handleCreateButtonClicked`);

        // rating, description, URL, title
        const itemRating = $('input[name="rating"]:checked').val();
        let itemDescription = $('.js-add-inner-description').val();
        const itemUrl = $('.js-add-input').val();
        const itemTitle = $('.js-add-inner-title').val();

        // conditional for API posts
        if(itemRating === undefined) {
            store.errorMessage = "Must select a rating.";
            store.error = 1;
            renderPage();
        } else {
            api.createItem(itemTitle, itemUrl, itemDescription, itemRating)
                .then((response) => {
                    

                    store.error = 0;
                    store.adding = false;
                    store.addBookmark(response);
                    renderPage();

                }).catch(err => {
                    console.log(err.message);
                    store.errorMessage = err.message;
                    store.error = 1;
                    renderPage();
                });
            }
        });

}
    
// delete button
function handleDeleteButtonClicked() {
    $('main').on('click', '.info-trash-button', event => {
        const id = getInnerContainerId(event.currentTarget);

        api.deleteItem(id) 
            .then(() => {
                
                store.error = 0;
                store.findAndDelete(id);
                renderPage();
            }).catch(err => {
                console.error(err.message);
                store.errorMessage = err.message;
                store.error = 1;
                renderPage();
            });
    });
}

// edit button 
function handleEditButtonClicked() {
    $('main').on('click', '.info-edit-button', event => {
        console.log(`ran handleEditButtonClicked`);

        
        store.edit = true;
        store.adding = true;
        const id = getInnerContainerId(event.currentTarget);
        store.tempId = id;
        renderPage();
    });
}

// edit button submit
function handleEditButtonSubmit() {
    $('main').on('submit', '.edit-form', event => {
        event.preventDefault();
        console.log(`Submission on Edit Button Ran`);
        
        // rating, description, URL, title
        const itemRating = $('input[name="rating"]:checked').val();
        const itemDescription = $('.js-add-inner-description').val();
        const itemUrl = $('.js-add-input').val();
        const itemTitle = $('.js-add-inner-title').val();
        const id = store.tempId;
        let regexp = /^https:\/\//;  

        // Add to object.
        const bookmarkObject = {
            'title': itemTitle,
            'url': itemUrl,
            'desc': itemDescription,
            'rating': itemRating
        };
        
        // update item.
        if(itemRating === undefined) {
            store.errorMessage = "Must select a rating.";
            store.error = 1;
            renderPage();
        } else if(!regexp.test(itemUrl)) {
            store.errorMessage = "URL Must begin with 'https://";
            store.error = 1;
            renderPage();
        } else {
            api.updateItem(id, bookmarkObject)
            .then((response) => {
                // find and update bookmark
                store.findAndUpdate(id, bookmarkObject);

                // reset to default and render
                store.error = 0;
                store.edit = false;
                store.tempId = 0;
                store.adding = false;
                renderPage();

            }).catch(err =>  {
                console.error(err.message);
                store.errorMessage = err.message;
                store.error = 1;
                renderPage();
            });
        }
    });
}

// filter 
function handleFilterSelection() {
    $('main').on('change', '.js-filter-menu', event => {
        // set filter
        const rating = $(".js-filter-menu option:selected").val();
        store.filter = Number(rating);
        renderPage();
    });
}

function bindEventListeners () {
    handleEditButtonSubmit();
    handleEditButtonClicked();
    handleFilterSelection();
    handleDeleteButtonClicked();
    handleCreateButtonClicked();
    handleCancelButtonClicked();
    handleNewButtonClicked();
    handleBookmarkKeyPress();
    handleBookmarkClicked();
}

export default {
    bindEventListeners,
    renderPage
}