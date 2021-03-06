import React, { lazy, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

import "./index.css";

import { hideDropdown } from "./redux/dropdown/dropdown.actions";
import { hideSidebar } from "./redux/sidebar/sidebar.actions";

import Sidebar from "./components/sidebar/sidebar";
import Header from "./components/header/header";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Memories from "./pages/memories/memories";
import Loading from "./pages/loading/loading";
import Modal from "./components/modal/modal";
import Welcome from "./pages/welcome/welcome";
import NotFound from "./pages/not-found/not-found";
import Gallery from "./components/gallery/gallery";
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
const SendCode = lazy(() => import("./pages/send-code/send-code"));
const ResetPassword = lazy(() =>
    import("./pages/reset-password/reset-password")
);

const App = ({ userInfo, showDropdown, showSidebar }) => {
    const dispatch = useDispatch();

    const handleAppClick = () => {
        if (showDropdown) {
            dispatch(hideDropdown());
        }

        if (showSidebar) {
            dispatch(hideSidebar());
        }
    };

    return (
        <div className="h-screen app" onClick={handleAppClick}>
            <HashRouter>
                <div className="overflow-scroll h-full">
                    <Header />
                    <Modal />
                    <Gallery />
                    <div className="850:grid 850:grid-cols-2 mt-3.5 h-[calc(100%-3.5rem)]">
                        {userInfo ? <Sidebar /> : <div></div>}
                        <div className="px-5 py-2 overflow-scroll 650:px-7 h-full">
                            <Suspense fallback={<Loading />}>
                                <Routes>
                                    <Route path="*" element={<NotFound />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route
                                        path="/register"
                                        element={<Register />}
                                    />
                                    <Route
                                        path="/memories"
                                        element={<Memories />}
                                    />
                                    <Route path="/" element={<Welcome />} />
                                    <Route path="/memories">
                                        <Route
                                            path="create"
                                            element={
                                                <ContentControl type="memory" />
                                            }
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
                                        path="/shared-memories"
                                        element={<SharedMemories />}
                                    />
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
                                    <Route
                                        path="/send-code"
                                        element={<SendCode />}
                                    />
                                    <Route
                                        path="/reset-password"
                                        element={<ResetPassword />}
                                    />
                                    <Route element={<NotFound />} />
                                </Routes>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </HashRouter>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
        showDropdown: state.dropdown.showDropdown,
        showSidebar: state.sidebar.show,
    };
};

export default connect(mapStateToProps)(App);
