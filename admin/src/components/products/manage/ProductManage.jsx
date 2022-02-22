import { useState } from "react"

import { Box, Button } from "@mui/material"
import SearchBar from "./SearchBar"
import ModifyProductDialog from "./ModifyProductDialog"
import CategorySubtitle from "../../general/CategorySubtitle"
import ProductList from "./ProductList"

const ProductManage = () => {
  //const [page, setPage] = useState(0)
  // eslint-disable-next-line
  const [size, setSize] = useState(6)

  const [modifyDialogOpen, setModifyDialogOpen] = useState(false)

  return (
    <>
      <CategorySubtitle text="Manage" />
      <ModifyProductDialog
        open={modifyDialogOpen}
        handleClose={() => setModifyDialogOpen(false)}
      />

      <Box
        sx={{
          padding: 2,
          display: "flex",
          gap: "10px",
        }}
      >
        <SearchBar placeholder="Filter" />
        <Button
          variant="contained"
          onClick={() => setModifyDialogOpen(true)}
        >
          Add item
        </Button>
      </Box>

      <Box>
        <ProductList />
      </Box>
    </>
  )
}

export default ProductManage
