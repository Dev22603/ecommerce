// /queries/product.queries.js
const INSERT_PRODUCT = `
  INSERT INTO Products (
    product_name,
    sales_price,
    mrp,
    images,
    category_id,
    stock
  )
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
`;

const CHECK_CATEGORY_EXISTS = `
  SELECT EXISTS (
  SELECT 1 FROM Categories WHERE id = $1
  );
`;

const SEARCH_PRODUCTS_BY_NAME = `
  SELECT * FROM Products
  WHERE product_name ILIKE $1
  LIMIT $2 OFFSET $3;
`;

const COUNT_PRODUCTS_BY_NAME = `
  SELECT COUNT(*) FROM Products
  WHERE product_name ILIKE $1;
`;

const GET_PRODUCT_STOCK = `
  SELECT stock FROM Products
  WHERE id = $1;
`;

export {
	CHECK_CATEGORY_EXISTS,
	INSERT_PRODUCT,
	COUNT_PRODUCTS_BY_NAME,
	SEARCH_PRODUCTS_BY_NAME,
	GET_PRODUCT_STOCK,
};
