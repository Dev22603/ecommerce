CREATE INDEX "products_category_id_idx" ON "products"("category_id");
CREATE INDEX "addresses_user_id_idx" ON "addresses"("user_id");
CREATE INDEX "orders_user_id_idx" ON "orders"("user_id");
CREATE INDEX "orders_address_id_idx" ON "orders"("address_id");
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");
CREATE INDEX "order_items_product_id_idx" ON "order_items"("product_id");
CREATE INDEX "carts_user_id_idx" ON "carts"("user_id");
CREATE INDEX "carts_product_id_idx" ON "carts"("product_id");
