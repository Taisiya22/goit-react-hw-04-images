
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImSearch } from 'react-icons/im';
import css from './Searchbar.module.css';
import { useState } from 'react';

export const Searchbar = ({onSubmit }) => { 
  const [searchQuery, setSearchQuery] = useState("");

  const onHandlerName = e => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  const handleSubmit = e => {
    e.preventDefault();

     if (!searchQuery.trim()) {
       toast.error('PLease, fill search field.');
      return;
     }
     onSubmit(searchQuery);
    setSearchQuery('');
   }
  return (
       <header className={css.searchbar}>
         <form onSubmit={handleSubmit} className={css.searchForm}>
          <button type="submit" className={css.searchFormBtn}>
            <ImSearch style={{ marginRight: 8 }} />
          </button>
         <input
            onChange={onHandlerName}
            value={searchQuery}
            className={css.searchFormIinput}
            type="text"
            autoComplete="off"
             autoFocus
            placeholder="Search images and photos"
          />
      </form>
    </header>
    );
}

Searchbar.propTypes = {
  searchQuery: PropTypes.string,
}


