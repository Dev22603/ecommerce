const INSERT_ORDER = `  
    INSERT INTO Orders (user_id, total_amount, address_id) VALUES ($1, $2, $3) RETURNING id;
`;

export { INSERT_ORDER };
