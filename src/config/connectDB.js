
const mongoose = require('mongoose');

let DBName = process.env.DB_DATABASE || 'PetCareDB';
let DB_PASSWORD = process.env.DB_PASSWORD;
//const uri = `mongodb+srv://ladat:${DB_PASSWORD}@petcaredb.fgqr9.mongodb.net/?retryWrites=true&w=majority&appName=${DBName}`;
const uri = `${process.env.MONGODB_URL}`;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connectDB() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);


        // local connection 
        // await mongoose.connect('mongodb://127.0.0.1:27017/test');
        
        //await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
connectDB().catch(console.dir);

module.exports = connectDB;

