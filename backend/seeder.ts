import dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

await connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);

        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log(colors.green.inverse('Data Imported!'));
        process.exit();
    } catch (error: any) {
        console.error(colors.red.inverse(`${error}`));
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log(colors.green.inverse('Data Destroyed!'));
        process.exit();
    } catch (error) {
        console.error(colors.red.inverse(`${error}`));
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}