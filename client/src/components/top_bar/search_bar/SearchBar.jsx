import { useState } from "react"
import { TextField, Typography, Popover, List } from "@mui/material"

import SearchResult from "./SearchResult"

import { useDebounce } from "use-debounce"
import { useEffect } from "react"
import { useLazyQuery } from "@apollo/client"
import { GET_PRODUCTS } from "../../../graphql/queries"
import { useLanguage } from "../../../hooks/useLanguage"

// Renders a search icon, which opens a search bar
// Dialog?
const SearchBar = ({ placeholder, sx }) => {
  const { language } = useLanguage()
  const [anchorEl, setAnchorEl] = useState(null)
  const [searchWord, setSearchWord] = useState("")
  const [debouncedSearchWord] = useDebounce(searchWord, 300)

  const [searchProducts, { data }] = useLazyQuery(GET_PRODUCTS)

  useEffect(() => {
    if (debouncedSearchWord.length > 0) {
      searchProducts({
        variables: {
          page: 0,
          size: 5,
          search: {
            searchWord: debouncedSearchWord,
            searchLanguage: language,
          },
        },
      })
    }
  }, [debouncedSearchWord, searchProducts, language])

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <TextField
        size="small"
        color="secondary"
        placeholder={placeholder}
        value={searchWord}
        onChange={(e) => {
          setSearchWord(e.target.value)
        }}
        onFocus={(e) => {
          openMenu(e)
        }}
        onBlur={() => {
          closeMenu()
        }}
        sx={sx}
      ></TextField>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        keepMounted
        disableAutoFocus={true}
        disableEnforceFocus={true}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={Boolean(anchorEl)}
      >
        {searchWord.length === 0 && (
          <Typography
            color="grey.700"
            sx={{ p: 2, textAlign: "center" }}
          >
            Type something to search products!
          </Typography>
        )}
        {data && data.getProducts && searchWord.length > 0 && (
          <>
            {data.getProducts.docs.length === 0 ? (
              <Typography
                color="grey.700"
                sx={{ p: 2, textAlign: "center" }}
              >
                No products found!
              </Typography>
            ) : (
              <>
                {data.getProducts.docs.map((p) => (
                  <SearchResult product={p} language={language} />
                ))}
              </>
            )}
          </>
        )}
      </Popover>
    </>
  )
}

export default SearchBar
