import {useNavigate} from "react-router-dom";
const SinglePostBig = ({ post, onDelete, onEdit, canEdit, isFavorite, onToggleFavorite }) => {
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
        <div className='postCardBig'>
            <div className='postCardBigInsideLeft'>
                <img src={post.image} alt="" />
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
            <div className='postCardBigInsideRight'>
                <div onClick={navigateUserPosts}>Username: <h4>{post.username}</h4></div>
                <div onClick={navigatePost}>Title: <h4>{post.title}</h4></div>
                <p>{post.description}</p>
                <p style={{ borderTop: "2px solid darkgray" }}>{formattedDate}</p>
            </div>

        </div>
    );
};

export default SinglePostBig;
