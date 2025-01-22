import { DataTypes } from 'sequelize';

export default {
  async up(queryInterface) {
    await queryInterface.createTable('Products', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ws_code: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      sales_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mrp: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      package_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Products');
  },
};
