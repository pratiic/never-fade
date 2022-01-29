import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

import "./index.css";

import { hideDropdown } from "./redux/dropdown/dropdown.actions";

import Sidebar from "./components/sidebar/sidebar";
import Header from "./components/header/header";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Memories from "./pages/memories/memories";
import Loading from "./pages/loading/loading";
import Modal from "./components/modal/modal";
const SharedMemories = lazy(() =>
    import("./pages/shared-memories/shared-memories")
);
const MemoryDetails = lazy(() =>
    import("./pages/memory-details/memory-details")
);
const ShareMemory = lazy(() => import("./pages/share-memory/share-memory"));
const ContentControl = lazy(() =>
    import("./pages/content-control/content-control")
);
const MemorySpaces = lazy(() => import("./pages/memory-spaces/memory-spaces"));
const SpaceDetails = lazy(() => import("./pages/space-details/space-details"));
const ContentSearch = lazy(() =>
    import("./pages/content-search/content-search")
);
const AddMembers = lazy(() => import("./pages/add-members/add-members"));
const UserProfile = lazy(() => import("./pages/user-profile/user-profile"));

const App = ({ userInfo, showDropdown }) => {
    const dispatch = useDispatch();

    const handleAppClick = () => {
        if (showDropdown) {
            dispatch(hideDropdown());
        }
    };

    return (
        <div className="h-screen app" onClick={handleAppClick}>
            <BrowserRouter>
                <div className="grid grid-rows-2 overflow-scroll h-full">
                    <Header />
                    <Modal />
                    <div className={`grid ${userInfo && "grid-cols-2"}`}>
                        {userInfo && <Sidebar />}
                        <div className="px-7 py-2 overflow-scroll">
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/register"
                                    element={<Register />}
                                />
                                <Route path="/" element={<Memories />} />
                            </Routes>
                            <Suspense fallback={<Loading />}>
                                <Routes>
                                    <Route path="/memories">
                                        <Route
                                            path="create"
                                            element={
                                                <ContentControl type="memory" />
                                            }
                                        />
                                        <Route
                                            path="shared"
                                            element={<SharedMemories />}
                                        />
                                        <Route
                                            path="share/:id"
                                            element={<ShareMemory />}
                                        />
                                        <Route
                                            path=":id"
                                            element={<MemoryDetails />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={
                                                <ContentControl
                                                    type="memory"
                                                    editMode={true}
                                                />
                                            }
                                        />
                                    </Route>
                                    <Route
                                        path="/profile/me"
                                        element={<UserProfile />}
                                    />
                                    <Route
                                        path="/search"
                                        element={<ContentSearch />}
                                    />
                                    <Route path="/memory-spaces">
                                        <Route
                                            path=""
                                            element={<MemorySpaces />}
                                        />
                                        <Route
                                            path=":id"
                                            element={<SpaceDetails />}
                                        />
                                        <Route
                                            path="create"
                                            element={
                                                <ContentControl type="memory space" />
                                            }
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={
                                                <ContentControl
                                                    type="memory space"
                                                    editMode={true}
                                                />
                                            }
                                        />
                                        <Route
                                            path="add-members/:id"
                                            element={<AddMembers />}
                                        />
                                    </Route>
                                </Routes>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
        showDropdown: state.dropdown.showDropdown,
    };
};

export default connect(mapStateToProps)(App);
