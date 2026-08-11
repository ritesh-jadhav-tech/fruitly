import { v2 as cloudinary } from "cloudinary"


async function uplode(filename,imagePath) {
    
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    })
    const option = {
        use_filename: true,
        unique_filename: false,
        overwrite: true
    };

    try{
        const result =await cloudinary.uploader.upload(imagePath,option);
        // console.log(result);
        return result;
    }catch(error){
        console.log(error)
    }
}

async function deleteFile(public_id){
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    })
    const option = {
        use_filename: true,
        unique_filename: false,
        overwrite: true
    };

    try{
        const result = await cloudinary.uploader.destroy(public_id,option);
        return result;
    }catch(error){
        console.log(error)
    }
}

export { uplode , deleteFile};