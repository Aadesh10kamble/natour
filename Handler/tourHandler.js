const tourModel = require("../models/tour.js")
const factoryHandler = require ("./factoryHandler.js");
const multer = require ("multer");
const sharp = require ("sharp");
const Er = require ("../errorHandling.js")


const getAllTours = factoryHandler.findAll (tourModel);
const getRequestedTour = factoryHandler.getRequestedDoc (tourModel);
const deleteTour = factoryHandler.deleteOne (tourModel); 
const patchTour = factoryHandler.patchDoc (tourModel);
const postTour = factoryHandler.postDoc (tourModel);

const topCheap = function (request,response,next) {
    request.query.limit = 5;
    request.query.sort = 'price';
    next ();
}

const getTourStats = async function (request,response,next) {
    try {
        const stats = await tourModel.aggregate ([
            {
                $match : {}
            },
            {
                $group : {
                    _id : 1,
                    avgRating : {$avg : "$ratingsAverage"},
                    avgPrice : {$avg : "$price"}
                }
            }
        ]);
        response.status (200).json ({
            status : "success",
            data : stats
        })
    } catch (error) {
        response.status (404).json ({
            status : "success",
            message : error.message
        })
    }
}; 

const storage = multer.memoryStorage ();
const filter = function (request,file,cb) {
    // console.log (file);
    if (file.mimetype.startsWith ("image")) cb (null,true);
    else cb (new Er.APIError ("Not a image",400),false);
};

const photo = multer ({
    storage : storage,
    fileFilter : filter
});

const collectPhoto = photo.fields ([
    {name : "tourImages" ,maxCount : 3},
    {name : "tourCover" ,maxCount : 1}]
);

const uploadPhoto = async function  (request,response,next) {
    if (!request.files) return next ();
    const tourid = request.params.tourId;

    if (request.files.tourCover) {
        request.body.imageCover = `tour-cover-${tourid}-${Date.now ()}.jpeg`;
        await sharp (request.files.tourCover[0].buffer).resize (2000,1333)
                                        .toFormat ("jpeg")
                                        .toFile (`public/img/tours/${request.body.imageCover}`);
    };

    if (request.files.tourImages) {
    request.body.images = [];
    const tourImages = request.files.tourImages.map (async (file,index) => {
        const filename = `${tourid}-${index + 1}.jpeg`;
        request.body.images.push (filename);
        await sharp (file.buffer).resize (2000,1333)
                            .toFormat ("jpeg")
                            .toFile (`public/img/tours/${filename}`);
        }
    );
        await Promise.all (tourImages); 
}
    next ();
};


exports.uploadPhoto = uploadPhoto;
exports.collectPhoto = collectPhoto;
exports.getTourStats= getTourStats;
exports.topCheap = topCheap;
exports.getAllTours = getAllTours;
exports.getRequestedTour = getRequestedTour;
exports.patchTour = patchTour;
exports.postTour = postTour;
exports.deleteTour = deleteTour;







// const getAllTours = async function (request, response,next) {
//     try {
        
//         const apifeature = new helper.APIFeatures (tourModel,request.query);
//         const apif = await (apifeature.filter ().sort ().fields ().pagination ());

//         const allTours = await apif.query;
        
//         response.status (200).json ({
//             status : "success",
//             result : {
//                 total : allTours.length,
//                 data :  allTours,
//             }
//         });

//     } catch (error) {   
//         error.statusCode = 404;
//         error.status = "failed";
//         next (error);
//     }
// };



// const deleteTour = async function (request, response,next) {
//     try {
//         await tourModel.findByIdAndDelete (request.params.tourId);
//         response.status(204).json({
//             status: "success",
//             data: null
//         });
//     } catch (error) {
//         error.statusCode = 404;
//         error.status = "failed";
//         next (error);
//     } 
// };


// const checkID = function (request, response, next, value) {
//     try {
        
//     }
//     console.log("-----")
//     if (+value < 0 || +value > tourSimpleData.length - 1) {
//         response.status(404).json({
//             status: "failed",
//             message: "DATA NOT FOUND"
//         });
//         return;
//     }
//     next();
// }

// const getRequestedTour = async function (request, response, next) {
//     try {
//         const { tourId } = request.params;
//         if (!request.Ids.includes (tourId)) throw new Er.APIError (`data for id "${tourId}" don't exists`,404);
//         const requestedData = await tourModel.findById(tourId).populate ("reviews");
//         // tourModel.findOne ({_id : tourId})
//         // const reviews = await reviewModel.find ({tour : tourId});
//         // requestedData.reviews = reviews;
//         response.status(200).json({
//             status: "success",
//             data: requestedData,
//         });
        
//     } catch (error) {
//         next (error);
//     }
// };

// const allToursId = async function (request,response,next) {
//     const allTours = await tourModel.find ({});
//     request.Ids = allTours.map (el => String (el._id));
//     next ();
// };

// const patchTour = async function (request, response) {
//     try {
//         const { id } = request.params;
//         const updateData = await tourModel.findByIdAndUpdate (id,request.body,{
//             new : true,
//             runValidators : true
//         });
        
//         response.status(200).json({
//             status: "success",
//             data: {
//                 updated: updateData
//             }
//         });
//     } catch (error) {
//         error.statusCode = 404;
//         error.status = "failed";
//         next (error);
//     }    
// };