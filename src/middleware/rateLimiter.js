import ratelimit from "../config/upstash.js";

const rateLimiter = async (req,res,next) =>{
    try {
        // in real world will use user-id, ipadress etc.
        const {success} = await ratelimit.limit("my-rate-limit");

        if(!success){
            return res.status(429).json({
                message:"Too many request, please try later"
            });
        }
        next();

    } catch (error) {
        console.log("rate limit error",error);
        next(error);
    }
};

export default rateLimiter;