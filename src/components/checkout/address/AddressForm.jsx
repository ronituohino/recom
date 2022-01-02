import { useFormik } from "formik"
import * as yup from "yup"

import { Box, Button } from "@mui/material"
import { useEffect } from "react"

import AddressFields from "./AddressFields"

const AddressForm = ({ submit, address, sx }) => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zipCode: "",
      country: "FI",
      company: "",
    },
    validationSchema: yup.object({
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      address: yup.string().required("Address is required"),
      city: yup.string().required("City is required"),
      zipCode: yup
        .string()
        .matches(/^[0-9]+$/, "Must be digits only")
        .min(5, "Must be 5 digits")
        .max(5, "Must be 5 digits")
        .required("Postal code is required"),
      country: yup.string().required("Country is required"),
      company: yup.string(),
    }),
    onSubmit: (values) => {
      submit(values)
    },
  })

  useEffect(() => {
    if (address) {
      if (Object.keys(address).length > 1) {
        formik.setValues(address)
      }
    }
  }, [address])

  return (
    <Box sx={{ ...sx }}>
      <form onSubmit={formik.handleSubmit}>
        <AddressFields formik={formik} />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
        >
          Save
        </Button>
      </form>
    </Box>
  )
}

export default AddressForm