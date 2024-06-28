import React, { useEffect, useState } from 'react';
import SinglePost from '../components/SinglePost';
import http from '../plugins/http';
import {useNavigate} from "react-router-dom";

const FavoritesPage = ({ favorites, removeFavorite }) => {
    const [posts, setPosts] = useState([]);
    const nav = useNavigate();
    const navigateBack = () => {
        nav(-1);
    };
    const fetchFavoritePosts = async () => {
        try {
            const response = await http.get('/getallposts');
            const favoritePosts = response.data.filter(post => favorites.includes(post.id));
            setPosts(favoritePosts);
        } catch (error) {
            console.error('Error fetching favorite posts:', error);
        }
    };
    useEffect(() => {
        fetchFavoritePosts();
    }, [favorites]);

    return (
        <div className='wrapperGrid'>
            <h2>Favorites</h2>
            {posts.length === 0 ? (
                <div style={{gridColumn:"3"}}>
                    <p >No favorite posts yet...</p>
                    <div className='createPost' onClick={navigateBack}>Back</div>
                </div>
            ) : (
                posts.map(post => (
                    <div key={post.id}>
                        <SinglePost
                        key={post.id}
                        post={post}
                        isFavorite={true}
                        onToggleFavorite={() => removeFavorite(post.id)}
                        />
                        <div className='createPost' onClick={navigateBack}>Back</div>
                    </div>


                )
            )
        )}
                    </div>
)
    ;
};

export default FavoritesPage;
