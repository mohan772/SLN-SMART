const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    const parsedQuery = JSON.parse(queryStr);
    parsedQuery.isDeleted = { $ne: true }; // Hide soft deleted
    
    // Cast price to numbers
    if (parsedQuery.price) {
      if (parsedQuery.price.$gte) parsedQuery.price.$gte = Number(parsedQuery.price.$gte);
      if (parsedQuery.price.$lte) parsedQuery.price.$lte = Number(parsedQuery.price.$lte);
      if (parsedQuery.price.$gt) parsedQuery.price.$gt = Number(parsedQuery.price.$gt);
      if (parsedQuery.price.$lt) parsedQuery.price.$lt = Number(parsedQuery.price.$lt);
    }

    // Finding resource
    query = Product.find(parsedQuery).populate('category');

    // Search
    if (req.query.search) {
      const search = req.query.search;
      query = query.find({ name: { $regex: search, $options: 'i' } });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const products = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search products
// @route   GET /api/products/search?q=
// @access  Public
exports.searchProducts = async (req, res, next) => {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Combine text search and regex for better partial matching
    const products = await Product.find({
      isDeleted: { $ne: true },
      $or: [
        { $text: { $search: q } },
        { name: { $regex: q, $options: 'i' } },
        { categorySlug: { $regex: q, $options: 'i' } }
      ]
    })
    .populate('category')
    .limit(20);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    let productData = { ...req.body };
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.file) {
      productData.images = [`/uploads/${req.file.filename}`];
    }

    // Parse boolean strings from form data
    if (typeof productData.trending === 'string') productData.trending = productData.trending === 'true';
    if (typeof productData.seasonal === 'string') productData.seasonal = productData.seasonal === 'true';
    if (typeof productData.isOrganic === 'string') productData.isOrganic = productData.isOrganic === 'true';
    if (typeof productData.visibility === 'string') productData.visibility = productData.visibility === 'true';

    // Parse nested objects
    if (typeof productData.nutritionalInfo === 'string') {
      try { productData.nutritionalInfo = JSON.parse(productData.nutritionalInfo); } catch(e) {}
    }
    if (typeof productData.supplier === 'string') {
      try { productData.supplier = JSON.parse(productData.supplier); } catch(e) {}
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let productData = { ...req.body };
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.file) {
      productData.images = [`/uploads/${req.file.filename}`];
    }

    if (typeof productData.trending === 'string') productData.trending = productData.trending === 'true';
    if (typeof productData.seasonal === 'string') productData.seasonal = productData.seasonal === 'true';
    if (typeof productData.isOrganic === 'string') productData.isOrganic = productData.isOrganic === 'true';
    if (typeof productData.visibility === 'string') productData.visibility = productData.visibility === 'true';
    if (productData.isDeleted === 'false') productData.isDeleted = false;
    if (productData.isDeleted === 'true') productData.isDeleted = true;

    if (typeof productData.nutritionalInfo === 'string') {
      try { productData.nutritionalInfo = JSON.parse(productData.nutritionalInfo); } catch(e) {}
    }
    if (typeof productData.supplier === 'string') {
      try { productData.supplier = JSON.parse(productData.supplier); } catch(e) {}
    }

    product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Soft delete
    product.isDeleted = true;
    await product.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get products by category slug
// @route   GET /api/products/category/:slug
// @access  Public
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    // Copy req.query for filters
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach((param) => delete reqQuery[param]);
    
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);
    parsedQuery.isDeleted = { $ne: true };
    
    // Cast price to numbers
    if (parsedQuery.price) {
      if (parsedQuery.price.$gte) parsedQuery.price.$gte = Number(parsedQuery.price.$gte);
      if (parsedQuery.price.$lte) parsedQuery.price.$lte = Number(parsedQuery.price.$lte);
      if (parsedQuery.price.$gt) parsedQuery.price.$gt = Number(parsedQuery.price.$gt);
      if (parsedQuery.price.$lt) parsedQuery.price.$lt = Number(parsedQuery.price.$lt);
    }
    
    // Add categorySlug to query
    parsedQuery.categorySlug = slug;

    let query = Product.find(parsedQuery).populate('category');

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const total = await Product.countDocuments(parsedQuery);
    query = query.skip(startIndex).limit(limit);

    const products = await query;
    
    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

