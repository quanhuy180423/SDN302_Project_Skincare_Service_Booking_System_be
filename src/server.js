import express from 'express';
import bodyParser from 'body-parser';
import configViewEngine from './config/configViewEngine';
import initWebRount from './router/web';
import cors from 'cors';
import connectDB from './config/connectDB';
import cookieParser from 'cookie-parser';

const app = express();

connectDB();
const corsOptions = {
    origin: "http://localhost:5173", // Chỉ cho phép yêu cầu từ URL được xác định trong REACT_URL
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE', // Các phương thức yêu cầu muốn cho phép
    allowedHeaders: 'X-Requested-With, content-type, Authorization', // Các header  muốn cho phép
    credentials: true // Cho phép gửi cookie cùng với yêu cầu
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

// Initialize cookie parser

app.use(cookieParser());

// Configure view engine

configViewEngine(app);

// Initialize web routes

initWebRount(app);

// Kiểm tra và xử lý PORT một cách an toàn
const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return 8555; // default port
    }

    if (port >= 0 && port < 65536) {
        return port;
    }

    return 8555; // default port if invalid
};

const PORT = normalizePort(process.env.PORT);


// auto connect another port if the port is in use

// Xử lý server listen với error handling tốt hơn
const startServer = () => {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is in use. Trying port ${PORT + 1}`);
            const newPort = normalizePort(PORT + 1);
            app.listen(newPort, () => {
                console.log(`Server running on port ${newPort}`);
            });
        } else {
            console.error('Server error:', error);
        }
    });
};

startServer();

export default app;