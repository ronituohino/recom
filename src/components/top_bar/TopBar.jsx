import { useState } from "react"

import {
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Box,
} from "@mui/material"

import PersonIcon from "@mui/icons-material/Person"

import CategoryBar from "./CategoryBar"
import SearchBar from "./SearchBar"

import { Link, useHistory } from "react-router-dom"
import { useLanguage } from "../../hooks/useLanguage"

import logo from "../../images/logo.png"
import ShoppingCart from "./ShoppingCart"
import Language from "./Language"

const TopBar = () => {
  const { language } = useLanguage()
  const history = useHistory()

  const [searchDisabled, setSearchDisabled] = useState(true)

  return (
    <>
      <Container>
        <AppBar position="static" sx={{ borderRadius: 4 }}>
          <Toolbar>
            <Link to="/">
              <img
                style={{
                  height: 40,
                  width: 80,
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                  margin: 4,
                }}
                src={logo}
              />
            </Link>

            <SearchBar setSearchDisabled={setSearchDisabled} />

            <Box sx={{ flexGrow: 1 }} />

            <CategoryBar searchDisabled={searchDisabled} />

            <ShoppingCart />

            <IconButton
              color="inherit"
              sx={{ margin: 0.5 }}
              onClick={() => history.push(`/${language}/account`)}
            >
              <PersonIcon />
            </IconButton>

            <Language />
          </Toolbar>
        </AppBar>
      </Container>
    </>
  )
}

export default TopBar
