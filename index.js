const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require("apollo-server-express")
const {
  ApolloServerPluginDrainHttpServer,
  UserInputError,
} = require("apollo-server-core")

const {
  GraphQLUpload,
  graphqlUploadExpress,
} = require("graphql-upload")

const fs = require("fs")

const dotenv = require("dotenv")
dotenv.config()

// Check that environment variables are set
const check = require("./server/utils/envValidation")
check()

const mongoose = require("mongoose")

const express = require("express")
const http = require("http")
const cors = require("cors")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to database"))
  .catch((e) => console.log(`Error connecting to database: ${e}`))

const commonTypeDefs = gql`
  type Query {
    me: Account
  }

  type Mutation {
    login(email: String!, password: String!): Token
  }

  type Paginated {
    docs: [Product]!
    totalDocs: Int!
    offset: Int!
    limit: Int!
    totalPages: Int!
    page: Int!
    pagingCounter: Int!
    hasPrevPage: Boolean!
    hasNextPage: Boolean!
    prevPage: Int!
    nextPage: Int!
  }

  enum Language {
    fi
    en
  }

  enum Currency {
    EUR
  }

  type Token {
    token: String!
  }

  type Options {
    label: LanguageString!
    options: [LanguageString!]!
  }

  type Option {
    label: LanguageString!
    option: LanguageString!
  }

  type LanguageString {
    en: String!
    fi: String!
  }

  type CurrencyFloat {
    EUR: Float!
  }
`

const commonInputDefs = gql`
  input OptionsInput {
    label: LanguageStringInput!
    options: [LanguageStringInput!]!
  }

  input OptionInput {
    label: LanguageStringInput!
    option: LanguageStringInput!
  }

  input LanguageStringInput {
    en: String!
    fi: String!
  }

  input CurrencyFloatInput {
    EUR: Float!
  }
`

const {
  Category,
  categoryTypeDefs,
} = require("./server/schemas/Category.js")
const { File, fileTypeDefs } = require("./server/schemas/File.js")
const {
  productResolvers,
  productTypeDefs,
  productInputDefs,
} = require("./server/schemas/Product.js")
const {
  Order,
  orderTypeDefs,
  orderInputDefs,
} = require("./server/schemas/Order.js")

const {
  Account,
  userTypeDefs,
  userInputDefs,
} = require("./server/schemas/Account.js")

const {
  hashPassword,
  createToken,
  streamToBase64,
} = require("./server/utils/serverUtils.js")

const {
  requireLogin,
  requireAdmin,
} = require("./server/utils/authentication.js")

const resolvers = {
  Query: {
    ...productResolvers.Query,

    getCategories: async () => {
      const categories = await Category.find({})
      return categories
    },

    getFileById: async (root, args) => {
      const file = await File.findById(args.id)
      return file
    },

    me: (root, args, context) => {
      return context.currentAccount
    },
  },

  Mutation: {
    login: async (root, args) => {
      const user = await Account.findOne({ email: args.email })

      if (!user) {
        throw new UserInputError("Invalid credentials")
      }

      const validPassword = await bcrypt.compare(
        args.password,
        user.password
      )

      if (!validPassword) {
        throw new UserInputError("Invalid credentials")
      }

      return createToken(user._id)
    },

    createAccount: async (root, args) => {
      const passwordHash = await hashPassword(args.password)

      const user = new Account({
        username: args.username,
        password: passwordHash,
        email: args.email,
        accountType: "Customer",
        orders: [],
        cart: [],
        verified: false,
      })

      try {
        const result = await user.save()
        return createToken(result._id)
      } catch (e) {
        throw new UserInputError(
          "Account with given email already exists"
        )
      }
    },

    editAccount: async (root, args, context) => {
      requireLogin(context)

      const user = await Account.findByIdAndUpdate(
        context.currentAccount._id,
        {
          ...(args.email && { email: args.email }),
          ...(args.password && {
            password: await hashPassword(args.password),
          }),
          ...(args.cart && {
            cart: args.cart,
          }),
        },
        { new: true }
      )

      return user
    },

    ...productResolvers.Mutation,

    createCategory: async (root, args, context) => {
      requireAdmin(context)

      const category = new Category({
        name: args.name,
        label: args.label,
        icon: args.icon,
      })

      const response = category.save()

      return response
    },

    editCategory: async (root, args, context) => {
      requireAdmin(context)

      const category = await Category.findByIdAndUpdate(
        args._id,
        {
          ...(args.name && { name: args.name }),
          ...(args.label && { label: args.label }),
          ...(args.icon && { icon: args.icon }),
        },
        { new: true }
      )

      return category
    },

    deleteCategory: async (root, args, context) => {
      requireAdmin(context)

      await Category.findByIdAndDelete(args._id)

      return true
    },

    createOrder: async (root, args, context) => {
      requireLogin(context)

      const order = new Order({
        products: args.products,
        datetime: new Date(),
        deliveryAddress: args.deliveryAddress,
        billingAddress: args.billingAddress,
        paymentDetails: args.paymentDetails,
        status: "Pending",
        extrainfo: args.extrainfo,
      })

      const result = await order.save()

      await Account.findByIdAndUpdate(context.currentAccount._id, {
        $push: { orders: result._id },
      })

      return result
    },

    fileUpload: async (root, { files }, context) => {
      requireAdmin(context)

      let results = []
      for (let i = 0; i < files.length; i++) {
        const { createReadStream, filename, mimetype, encoding } =
          await files[i]

        // Accept images only
        if (mimetype.split("/")[0] !== "image") {
          return false
        }

        // Invoking the `createReadStream` will return a Readable Stream.
        // See https://nodejs.org/api/stream.html#stream_readable_streams

        const stream = createReadStream()
        const streamData = await streamToBase64(stream)

        const fileId = new mongoose.Types.ObjectId()

        // If location has folders that don't exist, the image is not saved
        const location = `./public/files/images/${fileId}-${filename}`

        const mongooseFile = new File({
          _id: fileId,
          filename,
          mimetype,
          encoding,
          location,
          // Image backup disabled for now
          //data: streamData,
        })

        const response = await mongooseFile.save()
        results.push(response)

        // Then save image to public/files/... folder
        // where it can be served from
        const buffer = Buffer.from(streamData, "base64")
        fs.writeFile(location, buffer, () => {
          console.log(`File ${filename} uploaded to server`)
        })
      }

      return results
    },
  },

  Upload: GraphQLUpload,
}

const startApolloServer = async () => {
  const app = express()
  app.use(express.static("build"))
  app.use(cors())
  app.use(
    graphqlUploadExpress({ maxFileSize: 16000000, maxFiles: 10 })
  )

  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs: [
      commonTypeDefs,
      commonInputDefs,
      categoryTypeDefs,
      fileTypeDefs,
      productTypeDefs,
      productInputDefs,
      orderTypeDefs,
      orderInputDefs,
      userTypeDefs,
      userInputDefs,
    ],
    resolvers,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith("bearer ")) {
        try {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          )

          const currentAccount = await Account.findById(
            decodedToken._id
          )
          return { currentAccount }
        } catch (error) {
          throw new AuthenticationError("Invalid token")
        }
      }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()
  server.applyMiddleware({ app })

  const port = process.env.BACKEND_PORT || 4000
  await new Promise((resolve) => httpServer.listen({ port }, resolve))

  //eslint-disable-next-line
  console.log(
    `Server ready at http://localhost:${port}${server.graphqlPath}`
  )
}

startApolloServer()
