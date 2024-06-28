import http from './http';

export const handleEditPost = (post, setEditingPost, setIsCreating) => {
    setEditingPost(post);
    setIsCreating(false);
};

export const handleDeletePost = async (postId, loggedInUser, setPosts) => {
    if (!loggedInUser) return;
    const { secretKey } = loggedInUser;
    try {
        const response = await http.post('/deletepost', { id: postId, secretKey });
        if (response.data && response.data.success) {
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        } else {
            console.error('Failed to delete post:', response.data ? response.data.message : response);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
};
