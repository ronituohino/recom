import { cartItemsVar } from "../cache"

export const addItemToCart = (item) => {
  const matchIndex = cartItemsVar().findIndex(
    (i) => i.item.id === item.id
  )

  if (matchIndex === -1) {
    cartItemsVar([...cartItemsVar(), { item, amount: 1 }])
  } else {
    increaseAmount(item, matchIndex)
  }
}

export const setAmount = (item, amount, matchIndex = -1) => {
  if (amount === 0) {
    removeItemFromCart(item)
    return
  }

  if (matchIndex === -1) {
    matchIndex = cartItemsVar().findIndex(
      (i) => i.item.id === item.id
    )
  }

  let newArr = cartItemsVar()
  newArr[matchIndex] = { item, amount }

  // Reference needs to changed for Apollo to call updates
  cartItemsVar([...newArr])
}

export const increaseAmount = (item, matchIndex = -1) => {
  if (matchIndex === -1) {
    matchIndex = cartItemsVar().findIndex(
      (i) => i.item.id === item.id
    )
  }

  let newArr = cartItemsVar()
  const prevItem = newArr[matchIndex]

  newArr[matchIndex] = { item, amount: prevItem.amount + 1 }

  // Reference needs to changed for Apollo to call updates
  cartItemsVar([...newArr])
}

export const decreaseAmount = (item, matchIndex = -1) => {
  if (item.amount === 1) {
    removeItemFromCart(item)
    return
  }

  if (matchIndex === -1) {
    matchIndex = cartItemsVar().findIndex(
      (i) => i.item.id === item.id
    )
  }

  let newArr = cartItemsVar()
  const prevItem = newArr[matchIndex]

  newArr[matchIndex] = { item, amount: prevItem.amount - 1 }

  // Reference needs to changed for Apollo to call updates
  cartItemsVar([...newArr])
}

export const removeItemFromCart = (item, matchIndex = -1) => {
  if (matchIndex === -1) {
    matchIndex = cartItemsVar().findIndex(
      (i) => i.item.id === item.id
    )
  }

  let newArr = cartItemsVar()
  delete newArr[matchIndex]

  // Reference needs to changed for Apollo to call updates
  cartItemsVar([...newArr])
}

export const totalAmountOfItems = () => {
  let sum = 0
  cartItemsVar().forEach((e) => (sum += e.amount))
  return sum
}
