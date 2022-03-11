import { combineReducers } from "redux";

import { currentUserReducer } from "./current-user/current-user.reducer";
import { memoriesReducer } from "./memories/memories.reducer";
import { filesReducer } from "./files/files.reducer";
import { sharedMemoriesReducer } from "./shared-memories/shared-memories.reducer";
import { usersReducer } from "./users/users.reducer";
import { memorySpacesReducer } from "./memory-spaces/memory-spaces.reducer";
import { searchReducer } from "./search/search.reducer";
import { dropdownReducer } from "./dropdown/dropdown.reducer";
import { modalReducer } from "./modal/modal.reducer";
import { sidebarReducer } from "./sidebar/sidebar.reducer";
import { accountReducer } from "./account/account.reducer";
import { galleryReducer } from "./gallery/gallery.reducer";

export default combineReducers({
    currentUser: currentUserReducer,
    memories: memoriesReducer,
    files: filesReducer,
    sharedMemories: sharedMemoriesReducer,
    users: usersReducer,
    memorySpaces: memorySpacesReducer,
    search: searchReducer,
    dropdown: dropdownReducer,
    modal: modalReducer,
    sidebar: sidebarReducer,
    account: accountReducer,
    gallery: galleryReducer,
});
