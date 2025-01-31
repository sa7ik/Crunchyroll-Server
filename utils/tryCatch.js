const tryCatch=(func)=>async(req,res,next)=>{
    try {
       await func(req,res,next)
    } catch (error) {
        console.log("error",error);
        
        next(error)
    }
    }
    
    module.exports={tryCatch} 