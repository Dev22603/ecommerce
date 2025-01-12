CREATE TABLE Categories (
id Serial Primary key,
category_name varchar(255) not null

);

CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    ws_code INTEGER CHECK (ws_code >= 0),
    sales_price Integer Check (sales_price >0),
    mrp Integer Check (sales_price >0),
    package_size Integer Check (sales_price >0),
    images TEXT[],
    tags TEXT[],
    category_id INTEGER REFERENCES categories(id)
);

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,                    -- Auto-incremented user ID
    email VARCHAR(255) NOT NULL UNIQUE,        -- Email, must be unique and not null
    password VARCHAR(255) NOT NULL,            -- Password, not null
    role VARCHAR(10) CHECK (role IN ('admin', 'customer')) NOT NULL -- Role, must be 'Admin' or 'Customer'
);

CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,                    -- Auto-incremented order ID
    user_id INTEGER NOT NULL,                  -- User ID (foreign key reference to Users table)
    status VARCHAR(50) NOT NULL,               -- Status of the order (e.g., 'Pending', 'Completed', etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Order creation timestamp, default to the current timestamp
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE -- Foreign key reference to Users table
);

CREATE TABLE Order_Items (
    id SERIAL PRIMARY KEY,            -- Auto-incremented order item ID
    order_id INTEGER NOT NULL,        -- Order ID (foreign key reference to Orders table)
    product_id INTEGER NOT NULL,      -- Product ID (foreign key reference to Products table)
    quantity INTEGER NOT NULL CHECK (quantity > 0), -- Quantity of the product in the order, must be greater than 0
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE, -- Foreign key to Orders table
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE -- Foreign key to Products table
);

commit;
