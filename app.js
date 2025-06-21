const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());


app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next(); 
});


let products = [
    {
        id: '1',
        name: 'Laptop Pro',
        description: 'High-performance laptop for professionals',
        price: 1200,
        category: 'Electronics',
        inStock: true
    },
    {
        id: '2',
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with long battery life',
        price: 25,
        category: 'Accessories',
        inStock: true
    },
    {
        id: '3',
        name: 'Mechanical Keyboard',
        description: 'Durable mechanical keyboard with RGB backlighting',
        price: 90,
        category: 'Accessories',
        inStock: false
    },
    {
        id: '4',
        name: 'Smartphone X',
        description: 'Latest generation smartphone with advanced camera',
        price: 999,
        category: 'Electronics',
        inStock: true
    },
    {
        id: '5',
        name: 'Desk Lamp',
        description: 'Adjustable LED desk lamp with multiple brightness settings',
        price: 45,
        category: 'Home & Office',
        inStock: true
    },
    {
        id: '6',
        name: 'External SSD',
        description: 'Fast and portable solid-state drive for data storage',
        price: 150,
        category: 'Storage',
        inStock: true
    }
];


class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404; 
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400; 
    }
}


const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};


const API_KEY = 'supersecretapikey';

const authenticateAPIKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; 

    if (!apiKey) {
        throw new ValidationError('Authentication required: X-API-Key header is missing');
    }

    
    if (apiKey !== API_KEY) {
        throw new ValidationError('Authentication failed: Invalid API Key');
    }

    next(); 
};
const validateProductCreation = (req, res, next) => {
    const { name, description, price, category, inStock } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new ValidationError('Product name is required and must be a non-empty string.');
    }
    if (price === undefined || typeof price !== 'number' || price <= 0) {
        
        throw new ValidationError('Product price is required and must be a positive number.');
    }
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
        throw new ValidationError('Product category is required and must be a non-empty string.');
    }
    
    if (description !== undefined && typeof description !== 'string') {
        throw new ValidationError('Product description must be a string.');
    }
    if (inStock !== undefined && typeof inStock !== 'boolean') {
        throw new ValidationError('Product inStock must be a boolean.');
    }

    next();
};

const validateProductUpdate = (req, res, next) => {
    const { name, description, price, category, inStock } = req.body;
    let hasValidField = false; 

    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
            throw new ValidationError('Product name must be a non-empty string if provided.');
        }
        hasValidField = true;
    }
    if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
            throw new ValidationError('Product price must be a positive number if provided.');
        }
        hasValidField = true;
    }
    if (category !== undefined) {
        if (typeof category !== 'string' || category.trim().length === 0) {
            throw new ValidationError('Product category must be a non-empty string if provided.');
        }
        hasValidField = true;
    }
    if (description !== undefined) {
        if (typeof description !== 'string') {
            throw new ValidationError('Product description must be a string if provided.');
        }
        hasValidField = true;
    }
    if (inStock !== undefined) {
        if (typeof inStock !== 'boolean') {
            throw new ValidationError('Product inStock must be a boolean if provided.');
        }
        hasValidField = true;
    }

    
    if (!hasValidField && Object.keys(req.body).length > 0) {
        throw new ValidationError('No valid fields provided for update.');
    }
   
    if (Object.keys(req.body).length === 0) {
        throw new ValidationError('Request body cannot be empty for update.');
    }

    next(); 
};


app.get('/api/products', asyncHandler((req, res) => {
    const { category, page, limit } = req.query;
    let filteredProducts = [...products]; // Create a mutable copy of products for filtering

    console.log(`GET /api/products - Query params: category=${category}, page=${page}, limit=${limit}`);

    if (category) {
        filteredProducts = filteredProducts.filter(p =>
            p.category.toLowerCase().includes(category.toLowerCase())
        );
    }

    // Pagination logic
    const pageNum = parseInt(page, 10) || 1; 
    const limitNum = parseInt(limit, 10) || 10; 

    
    if (pageNum <= 0) {
        throw new ValidationError('Page number must be a positive integer.');
    }
    if (limitNum <= 0) {
        throw new ValidationError('Limit must be a positive integer.');
    }

    const startIndex = (pageNum - 1) * limitNum; 
    const endIndex = startIndex + limitNum;     

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex); 

    const totalProducts = filteredProducts.length; 
    const totalPages = Math.ceil(totalProducts / limitNum); 

    res.status(200).json({
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages,
        totalProducts: totalProducts,
        products: paginatedProducts 
    });
}));


app.get('/api/products/:id', asyncHandler((req, res) => {
    const productId = req.params.id;
    console.log(`GET /api/products/${productId} - Getting product by ID`);
    const product = products.find(p => p.id === productId); 

    if (!product) {
        throw new NotFoundError('Product not found');
    }
    res.status(200).json(product); 
}));

app.post('/api/products', authenticateAPIKey, validateProductCreation, asyncHandler((req, res) => {
    const newProduct = req.body;
    console.log('POST /api/products - Creating a new product:', newProduct);

    const maxId = products.length > 0 ? Math.max(...products.map(p => parseInt(p.id, 10))) : 0;
    newProduct.id = (maxId + 1).toString();

    
    newProduct.inStock = newProduct.inStock !== undefined ? newProduct.inStock : true;

    products.push(newProduct); 
    res.status(201).json(newProduct); 
}));


app.put('/api/products/:id', authenticateAPIKey, validateProductUpdate, asyncHandler((req, res) => {
    const productId = req.params.id;
    const updatedProductData = req.body;
    console.log(`PUT /api/products/${productId} - Updating product with ID:`, updatedProductData);

    const productIndex = products.findIndex(p => p.id === productId); 

    
    if (productIndex === -1) {
        throw new NotFoundError('Product not found');
    }

   
    products[productIndex] = { ...products[productIndex], ...updatedProductData, id: productId };
    res.status(200).json(products[productIndex]); 
}));


app.delete('/api/products/:id', authenticateAPIKey, asyncHandler((req, res) => {
    const productId = req.params.id;
    console.log(`DELETE /api/products/${productId} - Deleting product with ID`);

    const initialLength = products.length; 
    products = products.filter(p => p.id !== productId); 

  
    if (products.length === initialLength) {
        throw new NotFoundError('Product not found');
    }
    res.status(204).send(); 
}));


app.get('/api/products/search', asyncHandler((req, res) => {
    const { q } = req.query; 
    console.log(`GET /api/products/search - Search query: ${q}`);

    
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
        throw new ValidationError('Search query (q) is required and must be a non-empty string.');
    }

    const searchTerm = q.toLowerCase();
    const searchResults = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||       
        p.description.toLowerCase().includes(searchTerm)   
    );

    res.status(200).json(searchResults);
}));


app.get('/api/products/stats', asyncHandler((req, res) => {
    console.log('GET /api/products/stats - Generating product statistics');

    const stats = {};
   
    products.forEach(product => {
        const category = product.category || 'Uncategorized'; 
        stats[category] = (stats[category] || 0) + 1;
    });

    res.status(200).json(stats); 
}));


app.get('/', (req, res) => {
    res.send('Welcome to the Product API!');
});


app.use((err, req, res, next) => {
    console.error(`ERROR: ${err.message}`); 

    if (err instanceof NotFoundError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: 'Internal Server Error' });
});


app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
    console.log('\n--- API Endpoints Available ---');
    console.log(`- GET    http://localhost:${port}/api/products?category=[category]&page=[page]&limit=[limit]`);
    console.log(`- GET    http://localhost:${port}/api/products/:id`);
    console.log(`- POST   http://localhost:${port}/api/products (Requires 'X-API-Key' header)`);
    console.log(`- PUT    http://localhost:${port}/api/products/:id (Requires 'X-API-Key' header)`);
    console.log(`- DELETE http://localhost:${port}/api/products/:id (Requires 'X-API-Key' header)`);
    console.log(`- GET    http://localhost:${port}/api/products/search?q=[query]`);
    console.log(`- GET    http://localhost:${port}/api/products/stats`);
    console.log(`\nTo test authenticated routes, use 'X-API-Key: ${API_KEY}' in request headers.`);
});
