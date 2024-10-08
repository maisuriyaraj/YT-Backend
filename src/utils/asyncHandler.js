const asyncHandlerTryCatch = (func) => async(req,res,next) => {
    try {
        await func(req,res,next)
    } catch (error) {
        res.status(error.code).json({
            status:false,
            message:error.message
        })
    }
}

const asyncHandlerPromises = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err));
    }
}

export {asyncHandlerTryCatch,asyncHandlerPromises};