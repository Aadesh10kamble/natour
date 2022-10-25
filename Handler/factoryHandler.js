const helper = require("../helper.js");
const Er = require ("../errorHandling.js");

const deleteOne = function (Model) {
    return async (request,response,next) => {
        try {
            await Model.findByIdAndDelete  (request.params.tourId);
            response.status(204).json({
                status: "success",
                data: null
            });
        } catch (error) {
            next (error);
        }
    }
};

const findAll = function (Model) {

    return async function (request, response,next) {
        try {
            const apifeature = new helper.APIFeatures (Model,request.query);
            const apif = await (apifeature.filter ().sort ().fields ().pagination ());
    
            const allDoc = await apif.query;
            
            response.status (200).json ({
                status : "success",
                result : {
                    total : allDoc.length,
                    data :  allDoc,
                }
            });
    
        } catch (error) {   
            error.statusCode = 404;
            error.status = "failed";
            next (error);
        }
    };
};

const getRequestedDoc = function (Model) {
    return async (request,response,next) => {
        try {
            const { tourId } = request.params; 
            const requestedData = await Model.findById(tourId).populate ("reviews bookedTours");
            if (!requestedData) throw new Er.APIError (`data for id "${tourId}" don't exists`,404);
            // tourModel.findOne ({_id : tourId})
            // const reviews = await reviewModel.find ({tour : tourId});
            // requestedData.reviews = reviews;
            response.status(200).json({
                status: "success",
                data: requestedData,
            });
            
        } catch (error) {
            next (error);
        }
    }
};

const patchDoc = function (Model) {
    return async (request,response,next) => {
        try {
        const { tourId } = request.params;
        const updateData = await Model.findByIdAndUpdate (tourId,request.body,{
            new : true,
            runValidators : true
        });
        
        response.status(200).json({
            status: "success",
            data: {
                updated: updateData
            }
        });
        } catch (error) {
            next (error);
        }
    }
};

const postDoc = function (Model) {
    return async (request,response,next) => {
        try {
            const newTour = await Model.create(request.body);
            response.status(201).json({
                status: "success",
                data: {
                    newTour
                }
            });
        } catch (error) {
            error.statusCode = 400;
            error.status = "failed";
            next (error);
        }
    }
};

exports.findAll = findAll;
exports.deleteOne = deleteOne;
exports.getRequestedDoc = getRequestedDoc;
exports.patchDoc = patchDoc;
exports.postDoc = postDoc;