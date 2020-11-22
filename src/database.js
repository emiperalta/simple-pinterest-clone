const mongoose = require('mongoose');
require('dotenv').config();

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

(async () => {
    await mongoose.connect(process.env.DB_CONNECTION, mongooseOptions, () =>
        console.log('Database is connected')
    );
})();
