import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import SinglePost from "../components/SinglePost";
import http from "../plugins/http";

const UsernamePostsPage = ({ favorites = [], addFavorite, removeFavorite}) => {
    const [posts, setPosts] = useState([]);
    const params = useParams();
    const nav = useNavigate();

    useEffect(() => {
        http.get('/getuserposts/' + params.username)
            .then(res => {
                console.log(res);
                setPosts(res.data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setPosts([]);
            });
    }, [params.username]);
    const navigateBack = () => {
        nav('/posts/');
    };

    return (
        <>
            <h2>Posts by {params.username}</h2>
            <div className='wrapperGrid'>
                {posts.map(post => (
                    <div key={post.id}>
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
                        />
                    </div>
                ))}
                <div className='createPost' onClick={navigateBack}>Back</div>
            </div>
        </>
    );
}
export default UsernamePostsPage;
