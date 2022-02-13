import { gql } from "@apollo/client"

export const ACCOUNT = gql`
  query Account {
    me {
      _id
      username
      password
      email
      accountType
      orders
      verified
    }
  }
`
export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      _id
      name
      label
      icon
    }
  }
`
export const GET_PRODUCTS = gql`
  query GetProducts($page: Int!, $size: Int!, $category: ID) {
    getProducts(page: $page, size: $size, category: $category) {
      docs {
        _id
        name {
          en
          fi
        }
        price {
          EUR
        }
        category {
          name
        }
        images {
          location
        }
      }
      totalPages
    }
  }
`