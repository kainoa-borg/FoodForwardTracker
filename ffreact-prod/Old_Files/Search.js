import React, { useState } from "react";

const Search = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = e => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleInputChange}
      />
      <ul>
        {filteredData.map(item => (
          <li key={item.id}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
