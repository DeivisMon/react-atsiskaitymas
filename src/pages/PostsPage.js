
import React, { useState, useEffect, useRef } from 'react';
import SinglePost from '../components/SinglePost';
import Pagination from '../components/Pagination';
import PostFormPage from './PostFormPage';
import PostFilter from '../components/PostFilter';
import http from '../plugins/http';
import { handleEditPost, handleDeletePost } from '../plugins/postEdit';

const PostsPage = ({ favorites = [], addFavorite, removeFavorite, loggedInUser,}) => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 25;
    const [isCreating, setIsCreating] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [postFormError, setPostFormError] = useState('');
    const [filter, setFilter] = useState(false);
    const [filterUsername, setFilterUsername] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterTitle, setFilterTitle] = useState('');

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
    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleFilterChange = (newFilters) => {
        if (newFilters.filterUsername !== undefined) {
            setFilterUsername(newFilters.filterUsername);
        }
        if (newFilters.filterStartDate !== undefined) {
            setFilterStartDate(newFilters.filterStartDate);
        }
        if (newFilters.filterEndDate !== undefined) {
            setFilterEndDate(newFilters.filterEndDate);
        }
        if (newFilters.filterTitle !== undefined) {
            setFilterTitle(newFilters.filterTitle);
        }
        setCurrentPage(1);
    };

    const filteredPosts = posts.filter(post => {
        if (!post || !post.timestamp) {
            return false;
        }
        const postDate = new Date(post.timestamp);
        let startDate = null;
        let endDate = null;

        if (filterStartDate) {
            startDate = new Date(filterStartDate);
        }
        if (filterEndDate) {
            endDate = new Date(filterEndDate);
            endDate.setDate(endDate.getDate() + 1);
        }

        return (
            (!filterUsername || post.username.toLowerCase().includes(filterUsername.toLowerCase())) &&
            (!startDate || postDate >= startDate) &&
            (!endDate || postDate < endDate) &&
            (!filterTitle || post.title.toLowerCase().includes(filterTitle.toLowerCase()))
        );
    });

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const handleSavePost = async (postData) => {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const { secretKey } = user;
        console.log("Saving post data:", postData);
        try {
            if (editingPost) {
                await updatePost(postData, secretKey);
            } else {
                await createPost(postData, secretKey);
            }
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    const updatePost = async (postData, secretKey) => {
        try {
            const response = await http.post('/updatepost', {
                ...postData,
                id: editingPost.id,
                secretKey
            });
            if (response.data && response.data.success) {
                setPosts(posts.map(post => post.id === editingPost.id ? { ...post, ...postData } : post));
                setEditingPost(null);
            } else {
                console.error('Failed to update post:', response.data ? response.data.message : response);
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const createPost = async (postData, secretKey) => {
        try {
            const response = await http.post('/createpost', {
                ...postData,
                secretKey
            });
            if (response.data && response.data.success) {
                const newPost = response.data.post;
                setPosts([newPost, ...posts]);
                setIsCreating(false);

                setTimeout(() => {
                    window.location.reload();
                }, 50);
            } else {
                console.error('Failed to create post:', response.data ? response.data.message : response);
                if (response.data && response.data.message) {
                    setPostFormError(response.data.message);
                    setTimeout(() => {
                        setPostFormError('');
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };
    const handleCancel = () => {
        setIsCreating(false);
        setEditingPost(null);
    };
    const clearFilters = () => {
        setFilterUsername('');
        setFilterStartDate('');
        setFilterEndDate('');
        setFilterTitle('');
    };
    const toggleFilter = () => {
        setFilter(prevState => !prevState);
        clearFilters();
    };

    return (
        <>
            <h2>Posts</h2>
            {loggedInUser && (
                <div className='createPost' onClick={() => setIsCreating(true)}>Create New Post</div>
            )}
            {isCreating && !editingPost && (
                <PostFormPage
                    initialData={null}
                    onSave={handleSavePost}
                    onCancel={handleCancel}
                    error={postFormError}
                />
            )}
            {editingPost && (
                <PostFormPage
                    initialData={editingPost}
                    onSave={handleSavePost}
                    onCancel={handleCancel}
                    error={postFormError}
                />
            )}
            {!filter && loggedInUser && (
                <div className='filter-toggle' onClick={toggleFilter}>Show Filter</div>
            )}
            {filter && loggedInUser && (
                <div className='filter-toggle' onClick={toggleFilter}>Hide Filter</div>
            )}
            {filter && (
                <PostFilter
                    filterUsername={filterUsername}
                    filterStartDate={filterStartDate}
                    filterEndDate={filterEndDate}
                    filterTitle={filterTitle}
                    onFilterChange={handleFilterChange}
                />
            )}
            <div className='wrapperGrid'>
                {currentPosts.map(post => (
                    post && (
                        <SinglePost
                            key={post.id}
                            post={post}
                            isFavorite={favorites.includes(post.id)}
                            onToggleFavorite={() => {
                                if (favorites.includes(post.id)) {
                                    removeFavorite(post.id);
                                } else {
                                    addFavorite(post.id);
                                }
                            }}
                            onDelete={() => handleDeletePost(post.id, loggedInUser, setPosts)}
                            canDelete={loggedInUser && loggedInUser.name === post.username}
                            onEdit={() => handleEditPost(post, setEditingPost, setIsCreating)}
                            canEdit={loggedInUser && loggedInUser.name === post.username}
                        />
                    )
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPosts={filteredPosts.length}
                postsPerPage={postsPerPage}
                onPageChange={handlePageChange}
            />
        </>
    );
};

export default PostsPage;
