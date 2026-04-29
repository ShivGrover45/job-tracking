const app = require('./src/app');
const dotenv = require('dotenv');
const connectDb = require('./src/db/db');
dotenv.config();

// 1. Handles Promise rejections (like the 429/503 API errors)
process.on('unhandledRejection', (reason, promise) => {
    console.error('Handled Rejection:', reason.message || reason);
});

// 2. Handles the "Assertion failed" C++ crash on Windows
process.on('uncaughtException', (err) => {
    // If the error is the libuv/async.c bug, we just ignore it
    if (err.message && err.message.includes('UV_HANDLE_CLOSING')) {
        return; 
    }
    // If it's a real coding error, log it
    console.error('Caught Exception:', err);
});

const port = process.env.PORT || 3000;
connectDb()
app.listen(port, () => {
    console.log(`Server Started Successfully on port ${port}`);
});