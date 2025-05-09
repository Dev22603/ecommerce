// /queries/product.queries.js
export const INSERT_PRODUCT = `
  INSERT INTO Products (
    product_name,
    ws_code,
    sales_price,
    mrp,
    package_size,
    images,
    tags,
    category_id,
    stock
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *;
`;

export const CHECK_CATEGORY_EXISTS = `
  SELECT EXISTS (
  SELECT 1 FROM Categories WHERE id = $1
  );
`;
