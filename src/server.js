require('dotenv').config();
const express = require('express'); //commonjs
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const { getHomepage } = require('./controllers/homeController');
const cors = require("cors");
const path = require('path');
const app = express();
const port = process.env.PORT || 8888;


//config req.body
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data
app.use(cors());
app.use('/product', express.static(path.join(__dirname, 'product')));
app.use('/routes', express.static(path.join(__dirname, 'routes')));

//config template engine
configViewEngine(app);

//khai báo route
app.use('/v1/api/', apiRoutes);
app.use('/', getHomepage);


(async () => {
    try {
        //using mongoose
        await connection();

        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`)
        })
    } catch (error) {
        console.log(">>> Error connect to DB: ", error)
    }
})()
