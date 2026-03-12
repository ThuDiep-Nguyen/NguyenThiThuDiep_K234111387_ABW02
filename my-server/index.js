const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/MICKEYStore').then(() => console.log('✅ MongoDB connected!'));

mongoose.pluralize(null);

// ===================== SCHEMAS =====================

const CategorySchema = new mongoose.Schema({
  categoryId: String, name: String, description: String
});

const ProductSchema = new mongoose.Schema({
  productId: String, name: String, price: Number,
  model: String, madeBy: String, categoryId: String,
  stock: Number, image: String
});

const EmployeeSchema = new mongoose.Schema({
  employeeId: String, name: String, username: String,
  password: String, role: String, email: String
});

const CustomerSchema = new mongoose.Schema({
  customerId: String, name: String, username: String,
  password: String, email: String, studentId: String, profilePic: String
});

const OrderSchema = new mongoose.Schema({
  orderId: String, customerId: String,
  date: String, status: String, total: Number
});

const OrderDetailSchema = new mongoose.Schema({
  orderId: String, productId: String, quantity: Number, price: Number
});

// ===================== MODELS =====================
// Thêm tham số thứ 3 để ép Mongoose trỏ đúng tên collection có sẵn trong MongoDB Compass
const Category   = mongoose.model('Category',    CategorySchema, 'Category');
const Product    = mongoose.model('Product',     ProductSchema, 'Product');
const Employee   = mongoose.model('Employee',    EmployeeSchema, 'Employee');
const Customer   = mongoose.model('Customer',    CustomerSchema, 'Customer');
const Order      = mongoose.model('Order',       OrderSchema, 'Order');
const OrderDetail= mongoose.model('OrderDetail', OrderDetailSchema, 'OrderDetails');

// ===================== HELPER CRUD =====================
function makeCRUD(app, path, Model) {
  // Q2 - POST (Create)
  app.post(`/api/${path}`, async (req, res) => {
    try {
      const doc = new Model(req.body);
      await doc.save();
      res.json({ message: 'Thêm thành công!', data: doc });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Q3 - GET (Read All)
  app.get(`/api/${path}`, async (req, res) => {
    const data = await Model.find();
    res.json(data);
  });

  // GET by ID
  app.get(`/api/${path}/:id`, async (req, res) => {
    const data = await Model.findById(req.params.id);
    res.json(data);
  });

  // Q4 - PUT (Update)
  app.put(`/api/${path}/:id`, async (req, res) => {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Cập nhật thành công!', data });
  });

  // Q5 - DELETE
  app.delete(`/api/${path}/:id`, async (req, res) => {
    await Model.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa thành công!' });
  });
}

// Tạo CRUD cho tất cả collections
makeCRUD(app, 'categories',  Category);
makeCRUD(app, 'products',    Product);
makeCRUD(app, 'employees',   Employee);
makeCRUD(app, 'customers',   Customer);
makeCRUD(app, 'orders',      Order);
makeCRUD(app, 'orderdetails', OrderDetail);

// ===================== SPECIAL APIs =====================

// Tìm kiếm sản phẩm theo giá, model, madeBy
app.get('/api/search/products', async (req, res) => {
  const { minPrice, maxPrice, model, madeBy } = req.query;
  let filter = {};
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined && minPrice !== '') {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      filter.price.$lte = Number(maxPrice);
    }
    // Nếu chỉ tạo filter.price = {} mà không thiết lập điều kiện nào thì xóa để không gây lỗi db
    if (Object.keys(filter.price).length === 0) {
      delete filter.price;
    }
  }

  if (model) filter.model = { $regex: model, $options: 'i' };
  if (madeBy) filter.madeBy = { $regex: madeBy, $options: 'i' };
  const data = await Product.find(filter).sort({ price: 1 });
  res.json(data);
});

// Login Customer hoặc Employee
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  let user = await Customer.findOne({ username, password });
  if (user) return res.json({ success: true, role: 'customer', user });
  user = await Employee.findOne({ username, password });
  if (user) return res.json({ success: true, role: 'employee', user });
  res.json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' });
});

// Thống kê doanh thu theo Category và Thời gian
app.get('/api/revenue', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'paid' });
    const orderIds = orders.map(o => o.orderId);
    
    const orderDetails = await OrderDetail.find({ orderId: { $in: orderIds } });
    const products = await Product.find();
    const categories = await Category.find();

    const categoryMap = {};
    categories.forEach(c => categoryMap[c.categoryId] = c.name || c.CategoryName);

    const productCatMap = {};
    products.forEach(p => productCatMap[p.productId] = p.categoryId);

    const byYearMonth = {};
    const byCategory = {};

    orderDetails.forEach(od => {
      const order = orders.find(o => o.orderId === od.orderId);
      if (!order) return;

      const dateStr = order.date; 
      const yearMonth = dateStr.substring(0, 7); 
      
      const catId = productCatMap[od.productId];
      const catName = categoryMap[catId] || 'Khác';
      
      const amount = od.quantity * od.price;

      byYearMonth[yearMonth] = (byYearMonth[yearMonth] || 0) + amount;
      byCategory[catName] = (byCategory[catName] || 0) + amount;
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    res.json({ totalRevenue, byYearMonth, byCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));