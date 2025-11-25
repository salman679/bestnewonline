import React, { useState, useEffect, useRef, useContext } from 'react'
import { FaSearch, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts, clearSearch } from '../../features/products/searchSlice'
import { useNavigate } from 'react-router-dom'
import { IndexContext } from '../../context'

function MenuSearchbar({ toggleMenu }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const dropdownRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { searchProducts, isLoading, isError, error } = useSelector((state) => state.search)
  const { setProductId } = useContext(IndexContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        dispatch(getProducts(searchTerm))
        setShowDropdown(true)
        setSelectedIndex(-1)
      } else {
        dispatch(clearSearch())
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, dispatch])

  const handleKeyDown = (e) => {
    if (!showDropdown || !searchProducts?.length) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < searchProducts.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchProducts.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleProductClick(searchProducts[selectedIndex])
        } else if (searchProducts.length > 0) {
          // If no item is selected but results exist, select the first one
          handleProductClick(searchProducts[0])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
      default:
        break
    }
  }

  const handleProductClick = (product) => {
    setProductId(product._id)
    setSearchTerm(product.title)
    setShowDropdown(false)
    setSelectedIndex(-1)
    navigate(`/products/${product.slug}`)
    toggleMenu()
  }

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      if (searchProducts?.length > 0) {
        // If results exist, navigate to the first product
        handleProductClick(searchProducts[0])
      } else {
        // If no results, navigate to search page
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
        setShowDropdown(false)
      }
    }
  }

  return (
    <div className="relative px-3 mt-1" ref={dropdownRef}>
      <div className="flex items-center border-b border-gray-300 dark:border-gray-600 py-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search Any Product Name..."
          className="w-full bg-transparent text-gray-700 dark:text-white focus:outline-none px-2"
        />
        <button
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          onClick={handleSearchClick}
        >
          <FaSearch className="text-gray-500 text-xl" />
        </button>
      </div>

      {showDropdown && searchProducts && searchProducts.length > 0 && (
        <div className="absolute z-[10000] top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-[300px]  overflow-y-auto animate-fadeIn ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
            {searchProducts.map((product, index) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex items-center p-3 cursor-pointer rounded-lg transition-all duration-200 ${index === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/50'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <div className="w-12 h-12 relative flex-shrink-0">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {product.name}
                    {product.category && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        {product.category}
                      </span>
                    )}
                  </p>
                  <p className="textColor font-medium">৳{product.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Use arrow keys to navigate</span>
              <span>Press Enter to select</span>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-center animate-fadeIn">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 dark:text-gray-400">Searching products...</p>
          </div>
        </div>
      )}

      {isError && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-center animate-fadeIn">
          <p className="textColor">{error || 'Error searching products'}</p>
        </div>
      )}
    </div>
  )
}

export default MenuSearchbar
