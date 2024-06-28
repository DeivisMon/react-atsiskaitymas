import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SinglePostBig from '../components/SinglePostBig';
import PostFormPage from './PostFormPage';
import http from '../plugins/http';
import { handleEditPost, handleDeletePost } from '../plugins/postEdit';

const SinglePostPage = ({ loggedInUser, favorites = [], handleUpdatePost, addFavorite, removeFavorite, setPosts }) => {
    const [post, setPost] = useState(null);
    const [isCreating, setIsCreating] = useState(false); //
    const [editingPost, setEditingPost] = useState(null);
    const params = useParams();
    const nav = useNavigate();

    useEffect(() => {
        http.get(`/getsinglepost/${params.username}/${params.id}`)
            .then(res => {
                setPost(res.data);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
                setPost(null);
            });
    }, [params.username, params.id]);

    const handleSavePost = async (postData) => {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const { secretKey } = user;
        try {
            if (editingPost) {
                await http.post('/updatepost', {
                    ...postData,
                    id: editingPost.id,
                    secretKey
                });
                setPost({ ...post, ...postData });
                handleUpdatePost({ ...post, ...postData });

                setEditingPost(null);
                setIsCreating(false);
            }
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingPost(null);
    };

    const navigateBack = () => {
        nav('/posts/');
    };

    return (
        <>
            {editingPost ? (
                <PostFormPage
                    initialData={editingPost}
                    onSave={handleSavePost}
                    onCancel={handleCancel}
                />
            ) : (
                <>
                    <h2>{post ? post.title : 'Loading...'}</h2>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {post ? (
                            <div>
                                <SinglePostBig
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
                                <div className='createPost' onClick={navigateBack}>Back</div>
                            </div>
                        ) : (
                            <p>Loading ...</p>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default SinglePostPage;
