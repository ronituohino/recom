import { useRef, useState } from "react"
import {
  Badge,
  IconButton,
  Menu,
  Button,
  Divider,
  Box,
  Typography,
  Icon,
} from "@mui/material"

import { useShoppingCart } from "../../../hooks/useShoppingCart"

import ShoppingCartProduct from "./ShoppingCartProduct"

import { formatPrice } from "../../../utils/formatting.js"
import { useLanguage } from "../../../hooks/useLanguage.js"
import { useRouting } from "../../../hooks/useRouting.js"

const ShoppingCart = () => {
  const { language } = useLanguage()
  const { openLink, checkoutLink, inCheckout } = useRouting()
  const [anchorEl, setAnchorEl] = useState(null)

  const { data, totalAmountOfProducts, totalPriceOfProducts } =
    useShoppingCart()
  const totalAmount = totalAmountOfProducts()
  const totalPrice = totalPriceOfProducts()

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const childRef = useRef()
  const closeMenu = () => {
    setAnchorEl(null)
    if (childRef.current) {
      childRef.current.onClose()
    }
  }

  const notificationsLabel = (itemCount) => {
    if (itemCount === 0) {
      return "no items in shopping cart"
    } else if (itemCount > 99) {
      return "more than 99 items in shopping cart"
    } else if (itemCount === 1) {
      return "1 item in shopping cart"
    } else {
      return `${itemCount} items in shopping cart`
    }
  }

  const disableCartButton = inCheckout()

  return (
    <>
      <IconButton
        disabled={disableCartButton}
        color="inherit"
        onClick={openMenu}
        aria-label={notificationsLabel(totalAmount)}
      >
        <Badge badgeContent={totalAmount} color="secondary">
          <Icon>shopping_cart</Icon>
        </Badge>
      </IconButton>

      <Menu
        sx={{
          marginTop: 2,
        }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <Box sx={{ width: 420 }}>
          {totalAmount === 0 && <p>empty!</p>}
          {totalAmount > 0 &&
            data.cartProducts.map((obj) => (
              <ShoppingCartProduct
                key={obj.product.hash}
                cartObject={obj}
                ref={childRef}
              />
            ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 1,
          }}
        >
          <Typography
            sx={{
              marginLeft: 1,
              marginBottom: 1,
              fontWeight: "bold",
            }}
          >
            {`Total: ${formatPrice(totalPrice, language, "EUR")}`}
          </Typography>
        </Box>
        <Divider />
        <Button
          color="primary"
          onClick={() => {
            openLink(checkoutLink())
            closeMenu()
          }}
        >
          Checkout
        </Button>
      </Menu>
    </>
  )
}

export default ShoppingCart
