export class Product {
  _id: string = '';
  productId: string = '';
  name: string = '';
  price: number = 0;
  model: string = '';
  madeBy: string = '';
  categoryId: string = '';
  stock: number = 0;
  image: string = '';
}

export class Customer {
  _id: string = '';
  customerId: string = '';
  name: string = '';
  username: string = '';
  password: string = '';
  email: string = '';
  studentId: string = '';
  profilePic: string = '';
}

export class Employee {
  _id: string = '';
  employeeId: string = '';
  name: string = '';
  username: string = '';
  role: string = '';
}

export class OrderItem {
  product: Product = new Product();
  quantity: number = 1;
}

export class Order {
  _id: string = '';
  orderId: string = '';
  customerId: string = '';
  date: string = '';
  status: string = '';
  total: number = 0;
}