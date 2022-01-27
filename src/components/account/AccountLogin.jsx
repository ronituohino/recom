import { useFormik } from "formik"
import * as yup from "yup"

import {
  Container,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
  Icon,
} from "@mui/material"

import { useState } from "react"
import { useRouting } from "../../hooks/useRouting"
import { useAccount } from "../../hooks/useAccount"

import FormikField from "../general/formik/FormikField"
import { Link } from "react-router-dom"

import LoadingButton from "../general/LoadingButton"
import { useSnackbar } from "notistack"

const AccountLogin = () => {
  const { openLink, homeLink, registerLink } = useRouting()
  const { enqueueSnackbar } = useSnackbar()

  const { logIn, loginData } = useAccount(() => {
    enqueueSnackbar("Logged in!", {
      variant: "success",
    })
    openLink(homeLink())
  })

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Email is required"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      logIn(values.email, values.password)
    },
  })

  const [values, setValues] = useState({
    showPassword: false,
  })

  const togglePasswordVisibility = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  return (
    <Container maxWidth={"xs"}>
      <Paper elevation={4} sx={{ padding: 2 }}>
        <FormikField
          field="email"
          label="Email"
          formik={formik}
          sx={{ marginBottom: 2 }}
        />

        <FormikField
          field="password"
          label="Password"
          type={values.showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility}>
                  {values.showPassword ? (
                    <Icon>visibility_off</Icon>
                  ) : (
                    <Icon>visibility</Icon>
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          formik={formik}
          sx={{ marginBottom: 2 }}
        />

        <LoadingButton
          loading={loginData ? loginData.loading : false}
          disabled={
            !formik.isValid || formik.values === formik.initialValues
          }
          color="primary"
          variant="contained"
          fullWidth
          onClick={formik.handleSubmit}
          text="Log in"
        />

        <Link to={registerLink()} style={{ textDecoration: "none" }}>
          <Typography
            color="primary"
            sx={{ textAlign: "center", mt: 1 }}
          >
            New here?
          </Typography>
        </Link>
      </Paper>
    </Container>
  )
}

export default AccountLogin
