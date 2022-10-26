import express from './node_modules/express/index.js';
import bodyParser from 'body-parser';
import tourRouter from './route/tourRouter.js'
import userRouter from './route/userRouter.js';
import reviewRouter from './route/reviewRouter.js';
import viewsRouter from './route/viewsRouter.js';
import bookingRouter from './route/bookingRouter.js';
import dotenv from './node_modules/dotenv/lib/main.js';
import mongoose from './node_modules/mongoose/index.js';
import Er from './errorHandling.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from "cookie-parser"
import helmet from "helmet"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// dotenv.config function looks for .env file specified in the path... 
// then appends the content of it to process.env.
dotenv.config({
    path: "./config.env"
});

// Connecting VS code to mangoDB database
// Both live and love server done.

// const mongodb = process.env.MONGODB.replace("<password>", process.env.DATABASE_PASSWORD);
const mongodb = process.env.MONGODB_LOCAL;
mongoose.connect(mongodb).then(() => console.log("DB Connection Successful"));

// Creating the server
const app = new express();

// Setting up pug templating engine
// Setting the directory where app will look for pug files
app.set("view engine", "pug");
app.set("views", `${__dirname}/public/views/`);

// Middelware added
// Static middleware sets up directory to look for static files.
// cookieParser will parse the cookie from the browser into 'request.cookie' .
// bodyParser will 
// urlencoded will parse the formdata to request.body
app.use (helmet ());
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Different Router will trigger 
app.use("/", viewsRouter);
app.use("/booking",bookingRouter);
app.use("/api/tours", tourRouter);
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRouter);


app.use((request, response, next) => {
    let error;
    if (!request.originalUrl.startsWith("/api")) error = new Er.APIError(`404 Page not found!!`, 404);
    else error = new Er.APIError(`BAD REQUEST ${request.originalUrl} doesnt exist`);
    next(error);
});

app.use((error, request, response, next) => {
    const statusCode = error.statusCode ?? 400;
    const statusM = error.status ?? "error";

    if (!request.originalUrl.startsWith("/api")) {
        return response.status(statusCode).render("error", {
            message: error.message
        });
    };

    response.status(statusCode).json({
        status: statusM,
        message: error.message
    });
});

// Starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("SERVER RUNNING");
    console.log(process.env.NODE_ENV);
});




































// console.log (crypto.createHash ("sha256").update ("asvc").digest ("hex"));
// console.log (crypto.createHash ("sha256").update ("asvc").digest ("hex"));

// console.log (await bcrypt.hash ("abc",12));
// console.log (await bcrypt.hash ("abc",12));

// app.get ('/',(request,res) => {
//     console.log (request.url);
//     res.writeHead (200,{
//         "Content-Type" : "text/html"
//     });
//     res.end ("WELCOME TO EXPRESS");
// })

// app.get("/api/tours", (request, response) => {
//     response.writeHead(200, {
//         "Content-Type": "application/json"
//     });

//     const dataSend = {
//         status: "success",
//         result: tourSimpleData.length,
//         data: tourSimpleData
//     };
//     response.end(JSON.stringify(dataSend));
// });

// app.get("/api/tours/:id", (request, response) => {
//     const { id } = request.params;
//     const requestedData = tourSimpleData.find(el => el.id === +id);

//     if (!requestedData) {
//         response.status(404).json({
//             status: "failed",
//             message: "Data not found"
//         });
//         return;
//     }
//     response.status(200).json({
//         status: "success",
//         data: requestedData
//     });

// });

// app.post("/api/tours", (request, response) => {
//     console.log(request.body);
//     if (!Object.keys(request.body).length) {
//         response.end("BODY NOT FOUND");
//         return;
//     };

//     const newData = cloneDeep(request.body);
//     const lastId = tourSimpleData.at(-1).id;

//     newData.id = lastId + 1;
//     tourSimpleData.push(newData);

//     fs.writeFile("./dev-data/data/tours-simple.json", JSON.stringify(tourSimpleData), () => {
//         console.log("FILE UPDATED");
//     });

//     response.end("DONE");
// });

// app.patch("/api/tours/:id", (request, response) => {
//     const { id } = request.params;
//     const updateData = tourSimpleData.find((el) => el.id === +id);
//     if (!updateData) {
//         response.status(404).json({
//             status: "failed"
//         });
//         return;
//     }
//     console.log(request.body.duration)
//     Object.keys(request.body).forEach((el) => {
//         if (Object.keys(updateData).includes(el)) {
//             console.log(el);
//             console.log(request.body.el)
//             updateData[el] = request.body[el];
//         }
//     })

//     fs.writeFile("./dev-data/data/tours-simple.json", JSON.stringify(tourSimpleData), () => {
//         console.log("FILE UPDATED");
//     });

//     response.status(200).json({
//         status: "success",
//         data: {
//             updated: updateData
//         }
//     });
// });

// app.delete("/api/tours/:id", (request, response) => {
//     const { id } = request.params;
//     const deleteData = tourSimpleData.findIndex((el) => el.id === +id);

//     if (deleteData === -1) {
//         response.status(404).json({
//             success: "failed",
//             message: "Invalid ID"
//         });
//         return;
//     }

//     tourSimpleData.splice(deleteData, 1);
//     fs.writeFile("./dev-data/data/tours-simple.json", JSON.stringify(tourSimpleData), () => {
//         console.log("FILE UPDATED");
//     });cls

//     response.status(204).json({
//         status: "success",
//         data: null
//     })
// });
