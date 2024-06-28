import React from 'react';

const PostFilter = ({ filterUsername, filterStartDate, filterEndDate, filterTitle, onFilterChange }) => {
    return (
        <div className='filters'>
            <div className="word-input">
                <label>Username:</label>
                <input
                    type="text"
                    placeholder="Filter by Username"
                    value={filterUsername}
                    onChange={(e) => onFilterChange({filterUsername: e.target.value})}
                />
            </div>
            <div className="word-input">
                <label>Title:</label>
                <input
                    type="text"
                    placeholder="Search in Title"
                    value={filterTitle}
                    onChange={(e) => onFilterChange({filterTitle: e.target.value})}
                />
            </div>

            <div className="date-input">
                <label>From Date:</label>
                <input
                    type="date"
                    placeholder="From Date"
                    value={filterStartDate}
                    onChange={(e) => onFilterChange({filterStartDate: e.target.value})}
                />
            </div>
            <div className="date-input">
                <label>To Date:</label>
                <input
                    type="date"
                    placeholder="To Date"
                    value={filterEndDate}
                    onChange={(e) => onFilterChange({filterEndDate: e.target.value})}
                />
            </div>
        </div>
    );
};

export default PostFilter;
