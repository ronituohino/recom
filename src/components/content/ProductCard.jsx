import { Box, Typography, Paper } from "@mui/material"

import { useLanguage } from "../../hooks/useLanguage"

import { formatPrice } from "../../utils/formatting"

import { useRouting } from "../../hooks/useRouting"
import { Link } from "react-router-dom"

const ProductCard = ({ product }) => {
  const { language } = useLanguage()
  const { itemLink } = useRouting()
  console.log(product)

  return (
    <Link
      to={itemLink(product.category, product._id)}
      style={{ textDecoration: "none" }}
    >
      <Paper elevation={4}>
        <img
          component="img"
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
          alt="name"
          style={{
            width: "200px",
            height: "200px",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        />

        <Box sx={{ padding: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {product.name[language]}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
            }}
          >
            {formatPrice(product.price.EUR, language, "EUR")}
          </Typography>
        </Box>
      </Paper>
    </Link>
  )
}

export default ProductCard