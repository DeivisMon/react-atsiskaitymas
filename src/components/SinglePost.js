import React from 'react';
import { useNavigate } from 'react-router-dom';

const SinglePost = ({ post, onDelete, onEdit, canEdit, isFavorite, onToggleFavorite }) => {
    const nav = useNavigate();

    const navigatePost = () => {
        nav(`/posts/${post.username}/${post.id}`);
    };

    const navigateUserPosts = () => {
        nav(`/posts/${post.username}`);
    };

    const formattedDate = new Intl.DateTimeFormat('lt-LT', {
        dateStyle: 'full',
        timeStyle: 'long',
    }).format(post.timestamp);


    return (
        <div className='postCard'>
            <h4 onClick={navigatePost}>{post.title}</h4>
            <img src={post.image} alt="" />
            <div onClick={navigateUserPosts}>Username: <h4>{post.username}</h4> </div>
            {/*<p style={{maxHeight:"200px", overflow:"hidden"}}>{post.description}</p>*/}
            <p style={{borderTop:"2px solid darkgray"}}>{formattedDate}</p>
            <div>
                <div onClick={onToggleFavorite}>
                    {isFavorite ? <button className='favoriteBtn'></button> : <button className='favoriteBtnNo'></button>}
                </div>
                {canEdit && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: '100px 100px',
                        gap: '10px',
                        paddingBottom: '5px'
                    }}>
                        <button className='logoutBtn' onClick={onEdit}>Edit</button>
                        <button className='logoutBtn' onClick={onDelete}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SinglePost;
