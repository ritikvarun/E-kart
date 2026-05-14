import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Product from "./models/products.js";
import Category from "./models/category.js";
import { productData, categoriesData } from "./seedData.js";

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Category.deleteMany({});
    const categoryDoc = await Category.insertMany(categoriesData);
    const categoryMap = categoryDoc.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});
    const productWithCategoryIds=productData.map((product)=>(
        {
            ...product,
            category:categoryMap[product.category]
        }
    ));
    await Product.insertMany(productWithCategoryIds);
    console.log("Categories inserted successfully");
    console.log("Database seeded successfully");
  } catch (error) {
    console.log("Error Seeding Database", error);
  }finally{
   mongoose.connection.close();
  }
}

seedDatabase();
