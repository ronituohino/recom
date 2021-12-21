import { useHistory } from "react-router-dom"
import { useLanguage } from "./useLanguage"

export const useRouting = () => {
  const history = useHistory()
  const { language } = useLanguage()

  const homeLink = () => {
    return `/${language}/home`
  }
  const openHome = () => {
    history.push(homeLink())
  }

  const categoryLink = (category) => {
    return `/${language}/product/${category}`
  }
  const openCategory = (category) => {
    history.push(categoryLink(category))
  }

  const itemLink = (category, itemId) => {
    return `/${language}/product/${category.toLowerCase()}/${itemId}`
  }
  const openItem = (category, itemId) => {
    history.push(itemLink(category, itemId))
  }

  const checkoutLink = () => {
    return `/${language}/account/checkout`
  }
  const openCheckout = () => {
    history.push(checkoutLink())
  }

  return {
    homeLink,
    openHome,

    categoryLink,
    openCategory,

    itemLink,
    openItem,

    checkoutLink,
    openCheckout,
  }
}
