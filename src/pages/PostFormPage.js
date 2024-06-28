import React, { useState } from 'react';

const PostFormPage = ({ onSave, onCancel, initialData, error }) => {
    const [title, setTitle] = useState(initialData ? initialData.title : '');
    const [image, setImage] = useState(initialData ? initialData.image : '');
    const [description, setDescription] = useState(initialData ? initialData.description : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ title, image, description });
    };

    return (
        <div>
            <form className="createForm" onSubmit={handleSubmit}>
                <h3>{initialData ? 'Edit Post' : 'Create New Post'}</h3>

                <label>Title:</label>
                <input
                    className='loginInput'
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <label>Image URL:</label>
                <input
                    className='loginInput'
                    type="text"
                    value={image}
                    placeholder="Insert image url"
                    onChange={(e) => setImage(e.target.value)}
                />

                <label>Description:</label>
                <input
                    className='loginInput'
                    value={description}
                    placeholder="Enter description"
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                {error && <p style={{ color: 'indianred' }}>{error}</p>}
                <button id='loginBtn' type="submit">{initialData ? 'Save Changes' : 'Create Post'}</button>
                <button id='cancelBtn' type="button" onClick={onCancel}>X</button>
            </form>
        </div>
    );
};

export default PostFormPage;
