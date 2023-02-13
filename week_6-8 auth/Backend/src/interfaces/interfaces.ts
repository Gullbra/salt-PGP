
export interface IUserSQL {
  user_id: number //pk serial autoincrement
  email: string
  password: string
  role: string
  store_id: number  //foreign key
}
export interface IUserTS {
  userId: number
  email: string
  password: string
  role: string
  storeId: number
}

export interface IStoreSQL {
  store_id: number //pk serial
  name: string
}
export interface IStoreTS {
  storeid: number
  name: string
}

export interface IProductsSQL {
  product_id: number //pk serial
  title: string
  description: number
  image_url: string
  store_id: number //pk foreign key
  price: string
  quantity: number
  category: string
}
export interface IProductsTS {
  productId: number
  title: string
  description: number
  imageUrl: string
  storeId: number
  price: string
  quantity: number
  category: string
}