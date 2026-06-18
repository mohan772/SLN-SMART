const supabase = require('../config/supabase');

const normalizeQueryField = (key) => {
  const map = {
    featured: 'is_featured',
    isFeatured: 'is_featured',
    trending: 'trending',
    seasonal: 'seasonal',
    isOrganic: 'is_organic',
    organic: 'is_organic',
    category: 'category_id',
    categoryId: 'category_id',
    categorySlug: 'category_slug',
    slug: 'category_slug',
    visibility: 'visibility',
    isDeleted: 'is_deleted',
    deleted: 'is_deleted',
  };
  return map[key] || key;
};

const normalizeQueryValue = (key, val) => {
  const booleanFields = ['is_featured', 'trending', 'seasonal', 'is_organic', 'visibility', 'is_deleted'];
  if (booleanFields.includes(key) && typeof val === 'string') {
    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;
  }
  return val;
};

const normalizeSortField = (field) => {
  const map = {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    categorySlug: 'category_slug',
    isFeatured: 'is_featured',
    isOrganic: 'is_organic',
  };
  return map[field] || field;
};

const parseSortOption = (sort) => {
  if (!sort) {
    return { field: 'created_at', ascending: false };
  }

  if (sort.startsWith('-')) {
    return { field: normalizeSortField(sort.slice(1)), ascending: false };
  }

  const [field, order] = sort.split(':');
  return {
    field: normalizeSortField(field || 'created_at'),
    ascending: order !== 'desc',
  };
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { select, sort, page, limit, search, ...filters } = req.query;

    let query = supabase
      .from('products')
      .select('*, category:category_id(*)', { count: 'exact' });

    // Hide soft deleted
    query = query.eq('is_deleted', false);

    // Apply filters
    Object.keys(filters).forEach((key) => {
      const val = filters[key];
      const normalizedKey = normalizeQueryField(key);
      const normalizedVal = normalizeQueryValue(normalizedKey, val);

      if (typeof normalizedVal === 'object' && normalizedVal !== null) {
        if (normalizedVal.gt) query = query.gt(normalizedKey, normalizedVal.gt);
        if (normalizedVal.gte) query = query.gte(normalizedKey, normalizedVal.gte);
        if (normalizedVal.lt) query = query.lt(normalizedKey, normalizedVal.lt);
        if (normalizedVal.lte) query = query.lte(normalizedKey, normalizedVal.lte);
        if (normalizedVal.in) query = query.in(normalizedKey, normalizedVal.in.split(','));
      } else {
        query = query.eq(normalizedKey, normalizedVal);
      }
    });

    // Search
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Sort
    const sortOption = parseSortOption(sort);
    query = query.order(sortOption.field, { ascending: sortOption.ascending });

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    query = query.range(from, to);

    const { data: products, error, count: total } = await query;

    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }

    console.log(`Fetched ${products.length} records (Total: ${total})`);

    // Pagination result
    const pagination = {};
    if (to < total - 1) {
      pagination.next = { page: pageNum + 1, limit: limitNum };
    }
    if (from > 0) {
      pagination.prev = { page: pageNum - 1, limit: limitNum };
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
    const { data: product, error } = await supabase
      .from('products')
      .select('*, category:category_id(*)')
      .eq('id', req.params.id)
      .single();

    if (error || !product) {
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

    const { data: products, error } = await supabase
      .from('products')
      .select('*, category:category_id(*)')
      .eq('is_deleted', false)
      .or(`name.ilike.%${q}%,category_slug.ilike.%${q}%`)
      .limit(20);

    if (error) throw error;

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

    // Convert keys to snake_case to match SQL schema
    const mappedData = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      discount_price: productData.discountPrice,
      unit: productData.unit,
      images: productData.images,
      category_id: productData.category,
      category_slug: productData.categorySlug,
      stock: productData.stock,
      rating: productData.rating,
      num_reviews: productData.numReviews,
      is_featured: String(productData.isFeatured) === 'true',
      is_organic: String(productData.isOrganic) === 'true',
      nutritional_info: typeof productData.nutritionalInfo === 'string' ? JSON.parse(productData.nutritionalInfo) : productData.nutritionalInfo,
      farmer_details: typeof productData.farmerDetails === 'string' ? JSON.parse(productData.farmerDetails) : productData.farmerDetails,
      trending: String(productData.trending) === 'true',
      seasonal: String(productData.seasonal) === 'true',
      demand_level: productData.demandLevel,
      visibility: String(productData.visibility) === 'true',
      supplier: typeof productData.supplier === 'string' ? JSON.parse(productData.supplier) : productData.supplier,
    };

    const { data: product, error } = await supabase
      .from('products')
      .insert(mappedData)
      .select()
      .single();

    if (error) throw error;

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
    let productData = { ...req.body };
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.file) {
      productData.images = [`/uploads/${req.file.filename}`];
    }

    const mappedData = {};
    if (productData.name) mappedData.name = productData.name;
    if (productData.description) mappedData.description = productData.description;
    if (productData.price) mappedData.price = productData.price;
    if (productData.discountPrice) mappedData.discount_price = productData.discountPrice;
    if (productData.unit) mappedData.unit = productData.unit;
    if (productData.images) mappedData.images = productData.images;
    if (productData.category) mappedData.category_id = productData.category;
    if (productData.categorySlug) mappedData.category_slug = productData.categorySlug;
    if (productData.stock) mappedData.stock = productData.stock;
    if (productData.rating) mappedData.rating = productData.rating;
    if (productData.numReviews) mappedData.num_reviews = productData.numReviews;
    if (productData.isFeatured !== undefined) mappedData.is_featured = String(productData.isFeatured) === 'true';
    if (productData.isOrganic !== undefined) mappedData.is_organic = String(productData.isOrganic) === 'true';
    if (productData.trending !== undefined) mappedData.trending = String(productData.trending) === 'true';
    if (productData.seasonal !== undefined) mappedData.seasonal = String(productData.seasonal) === 'true';
    if (productData.demandLevel) mappedData.demand_level = productData.demandLevel;
    if (productData.visibility !== undefined) mappedData.visibility = String(productData.visibility) === 'true';
    if (productData.isDeleted !== undefined) mappedData.is_deleted = String(productData.isDeleted) === 'true';

    if (productData.nutritionalInfo) {
       mappedData.nutritional_info = typeof productData.nutritionalInfo === 'string' ? JSON.parse(productData.nutritionalInfo) : productData.nutritionalInfo;
    }
    if (productData.farmerDetails) {
       mappedData.farmer_details = typeof productData.farmerDetails === 'string' ? JSON.parse(productData.farmerDetails) : productData.farmerDetails;
    }
    if (productData.supplier) {
       mappedData.supplier = typeof productData.supplier === 'string' ? JSON.parse(productData.supplier) : productData.supplier;
    }

    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(mappedData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
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
    // Soft delete
    const { error } = await supabase
      .from('products')
      .update({ is_deleted: true })
      .eq('id', req.params.id);

    if (error) throw error;

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
    const { select, sort, page, limit, ...filters } = req.query;

    let query = supabase
      .from('products')
      .select('*, category:category_id(*)', { count: 'exact' });

    query = query.eq('is_deleted', false).eq('category_slug', slug);

    // Apply filters
    Object.keys(filters).forEach((key) => {
      const val = filters[key];
      const normalizedKey = normalizeQueryField(key);
      const normalizedVal = normalizeQueryValue(normalizedKey, val);
      if (typeof normalizedVal === 'object' && normalizedVal !== null) {
        if (normalizedVal.gt) query = query.gt(normalizedKey, normalizedVal.gt);
        if (normalizedVal.gte) query = query.gte(normalizedKey, normalizedVal.gte);
        if (normalizedVal.lt) query = query.lt(normalizedKey, normalizedVal.lt);
        if (normalizedVal.lte) query = query.lte(normalizedKey, normalizedVal.lte);
      } else {
        query = query.eq(normalizedKey, normalizedVal);
      }
    });

    // Sort
    const sortOption = parseSortOption(sort);
    query = query.order(sortOption.field, { ascending: sortOption.ascending });

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    query = query.range(from, to);

    const { data: products, error, count: total } = await query;

    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }

    console.log(`Fetched ${products.length} records (Total: ${total})`);
    
    const pagination = {};
    if (to < total - 1) {
      pagination.next = { page: pageNum + 1, limit: limitNum };
    }
    if (from > 0) {
      pagination.prev = { page: pageNum - 1, limit: limitNum };
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

