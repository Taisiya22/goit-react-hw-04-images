import { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Searchbar } from './Searchbar/Searchbar';
import { imgApi } from './service/ApiService';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [alt, setAlt] = useState(null);
  const [, setError] = useState(null);
  // const [totalImage, setTotalImage] = useState(null);
  // let totalImage = null;
  const totalImageRef = useRef(null);
  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const getPictures = async () => {
      setIsLoading(true);
      try {
        const responce = await imgApi(searchQuery, page);
        totalImageRef.current = responce.totalHits;

        const totalpage = totalImageRef.current / 12;
        if (responce.hits.length === 0) {
          setImages([]);
          toast.warning(
            'No results were found for your search, please try something else.'
          );
          return;
        }
        if (page === 1 && totalImageRef.current !== 0) {
          toast.success(`Hooray! We found ${totalImageRef.current} images.`);
        }

        setImages(prevImages => [...prevImages, ...responce.hits]);
        if (page > totalpage) {
          toast.info(
            'Were sorry, but you ve reached the end of search results.'
          );
        }
      } catch (error) {
        setError(error);
        toast.error(`Whoops, something went wrong: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    getPictures();
  }, [searchQuery, page]);

  const loadMore = () => {
    setPage(prevpage => prevpage + 1, setIsLoading(true));
  };

  const openModal = (largeImageUrl, tags) => {
    setSelectedImage(largeImageUrl);
    setAlt(tags);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleFormSubmit = (searchQuery, selectedImage) => {
    setSearchQuery(searchQuery);
    setSelectedImage(selectedImage);

    if (searchQuery !== selectedImage) {
      setImages([]);
      setPage(1);
    }
  };

  return (
    <>
      <Searchbar
        onSubmit={handleFormSubmit}
        totalImage={totalImageRef.current}
      />
      {images.length > 0 && (
        <ImageGallery images={images} openModal={openModal} />
      )}
      {selectedImage && (
        <Modal onClose={closeModal} selectedImage={selectedImage} alt={alt} />
      )}
      {isLoading && <Loader />}
      {page < totalImageRef.current / 12 && <Button onClick={loadMore} />}
      <ToastContainer autoClose={3000} theme="colored" pauseOnHover />
    </>
  );
};
