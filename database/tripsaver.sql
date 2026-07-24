-- 1. Drop the table if it already exists so we can start fresh
DROP TABLE IF EXISTS users;

-- 2. Create the proper, secure table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    
    -- Restricts data: role MUST be either 'shopper' or 'owner'
    role VARCHAR(50) NOT NULL CHECK (role IN ('shopper', 'owner')),
    
    name VARCHAR(100) NOT NULL,
    
    -- UNIQUE ensures no two people can register with the same phone number
    mobile VARCHAR(20) UNIQUE NOT NULL, 
    
    password VARCHAR(255) NOT NULL,
    
    -- These are optional (nullable) because shoppers won't have them
    shop_name VARCHAR(150),
    shop_address TEXT,
    
    -- Automatically records the exact date and time the user registered
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users 
ADD COLUMN reset_otp VARCHAR(6),
ADD COLUMN otp_expiry TIMESTAMP;



-- 1. Create Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Offers Table
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    offer_title VARCHAR(255) NOT NULL,
    target_product VARCHAR(255),
    discount VARCHAR(50) NOT NULL,
    valid_until DATE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Ads Table
CREATE TABLE ads (
    id SERIAL PRIMARY KEY,
    ad_title VARCHAR(255) NOT NULL,
    placement VARCHAR(100) NOT NULL,
    target_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE products ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE offers   ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE ads      ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE offers 
ALTER COLUMN discount TYPE DECIMAL(5,2) USING discount::DECIMAL(5,2);

SELECT * FROM products;
SELECT * FROM offers;
SELECT * FROM ads;


