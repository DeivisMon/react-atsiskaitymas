import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Toolbar from "./components/Toolbar";
import PostsPage from "./pages/PostsPage";
import PostFormPage from "./pages/PostFormPage";
import UsernamePostsPage from "./pages/UsernamePostsPage";
import SinglePostPage from "./pages/SinglePostPage";
import FavoritesPage from "./pages/FavoritesPage";
import http from "./plugins/http";
import './style.css';

const App = () => {
    const [posts, setPosts] = useState([]);

    const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    return storedUser ? JSON.parse(storedUser) : null;
    });
    useEffect(() => {
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    }, [loggedInUser]);
    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await http.get('/getallposts');
                if (response.data) {
                    setPosts(response.data.reverse());
                } else {
                    console.error('Failed to fetch posts:', response);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    const handleUpdatePost = (updatedPost) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === updatedPost.id ? updatedPost : post
            )
        );
    };
    const handleDeletePost = async (postId) => {
        if (!loggedInUser) return;
        const { secretKey } = loggedInUser;
        try {
            const response = await http.post('/deletepost', { id: postId, secretKey });
            if (response.data && response.data.success) {
                console.log('Post deleted successfully');
                setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
            } else {
                console.error('Failed to delete post:', response.data ? response.data.message : response);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const [favorites, setFavorites] = useState(() => {
        const storedFavorites = localStorage.getItem('favorites');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites, setFavorites]);

    const addFavorite = (postId) => {
        setFavorites((prevFavorites) => {
            if (!prevFavorites.includes(postId)) {
                return [...prevFavorites, postId];
            }
            return prevFavorites;
        });
    };

    const removeFavorite = (postId) => {
        setFavorites((prevFavorites) => prevFavorites.filter(id => id !== postId));
    };

    return (
        <>
            <div>
                <Toolbar favoritesCount={favorites.length} onLogout={handleLogout} />
            </div>
            <div className='container'>
                <div className="wrapper">
                    <Routes>
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/posts" element={
                                <PostsPage
                                    favorites={favorites}
                                    addFavorite={addFavorite}
                                    removeFavorite={removeFavorite}
                                    loggedInUser={loggedInUser}
                                    handleDeletePost={handleDeletePost}
                                    posts={posts}
                                    setPosts={setPosts}
                                />
                            }
                        />
                        <Route path="/posts/:username" element={
                                <UsernamePostsPage
                                    favorites={favorites}
                                    addFavorite={addFavorite}
                                    removeFavorite={removeFavorite}
                                    loggedInUser={loggedInUser}
                                    handleDeletePost={handleDeletePost}
                                />
                            }
                        />
                        <Route path="/posts/:username/:id" element={
                                <SinglePostPage
                                    favorites={favorites}
                                    addFavorite={addFavorite}
                                    removeFavorite={removeFavorite}
                                    loggedInUser={loggedInUser}
                                    handleDeletePost={handleDeletePost}
                                    handleUpdatePost={handleUpdatePost}
                                    posts={posts}
                                    setPosts={setPosts}
                                />
                            }
                        />
                        <Route path="/createposts/" element={<PostFormPage />} />
                        <Route path="/favorites" element={
                                <FavoritesPage
                                    favorites={favorites}
                                    removeFavorite={removeFavorite}
                                    loggedInUser={loggedInUser}
                                />
                            }
                        />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default App;
