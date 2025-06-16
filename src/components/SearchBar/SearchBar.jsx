import { useState } from 'react';
import styles from './SearchBar.module.scss';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSearch}>
      <div className={styles.inputWrap}>
        <FaSearch className={styles.icon} />
        <input 
          type="text" 
          placeholder="Tìm" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
      </div>
      <button type="submit">Tìm</button>
    </form>
  );
}

export default SearchBar;
