const INSERT_ORDER = `  
    INSERT INTO Orders (user_id, total_amount) VALUES ($1, $2) RETURNING id;
`;

export { INSERT_ORDER };
