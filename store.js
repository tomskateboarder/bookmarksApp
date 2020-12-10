// empty bookmarks array 
const bookmarks = []; 
//  page state
const adding = false; 
// error page state 
const error = 0; 
// global error message 
const errorMessage = ""; 
// filter value
const filter = -1; 
// edit page state
const edit = false; 
// stored ID for page state change
const tempId = 0; 

// find bookmark in bookmarks array by ID
function findById(id) {
    return this.bookmarks.find(currentItem => currentItem.id === id);
};

// add bookmark to store
function addBookmark (item) {
    
    let expandedObject = {
        expanded: false
    }; 

    Object.assign(item, expandedObject);
    this.bookmarks.push(item);
}

// find and update bookmark by ID and data passed through
function findAndUpdate (id, newData) {
    let newItem = this.findById(id);

    Object.assign(newItem, newData);
}

// find and delete bookmark by ID
function findAndDelete (id) {
    this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
};

export default {
    bookmarks,
    adding,
    error,
    errorMessage,
    filter,
    edit,
    tempId,
    addBookmark,
    findById,
    findAndUpdate,
    findAndDelete
}