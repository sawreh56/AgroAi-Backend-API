import multer from "multer";

const uploadImage=multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,"uploads/")
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+file.originalname)
        }
    })
}).single("image")

export default uploadImage;