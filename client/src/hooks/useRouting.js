import { useNavigate, useLocation } from "react-router-dom"
import { useLanguage } from "./useLanguage"

export const useRouting = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const location = useLocation()

  const openLink = (link) => {
    navigate(link)
  }

  const back = () => {
    navigate(-1)
  }

  const inCheckout = () => {
    return location.pathname.includes("checkout")
  }

  const homeLink = () => {
    return `/${language}/home`
  }

  const accountLink = () => {
    return `/${language}/account`
  }

  const categoryLink = (category) => {
    return `/${language}/product/${category}`
  }

  const productLink = (category, productId) => {
    return `/${language}/product/${category.toLowerCase()}/${productId}`
  }

  const checkoutLink = () => {
    return `/${language}/checkout/`
  }

  const loginLink = () => {
    return `/${language}/account/login`
  }

  const registerLink = () => {
    return `/${language}/account/register`
  }

  return {
    openLink,
    back,
    inCheckout,

    homeLink,
    accountLink,
    categoryLink,
    productLink,
    checkoutLink,
    loginLink,
    registerLink,
  }
}