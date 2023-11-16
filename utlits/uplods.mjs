import multer from "multer";



/**
 * Multer Settings:
 */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const route = req.originalUrl;

        if (route.includes("/article/create") || route.includes("/article/update"))
           cb(null, "uploads/articles")

        else if (route.includes("/auth/signup") || route.includes("/user/update/acount"))
          cb(null, "uploads/userAvatar");
        
    },

    filename: (req, file, cb) => {

        cb(null, `${Date.now()}_${file.originalname}`);
    }
});


const fileFilter = (req, file, cb) => {

     try {
        
        if (file.mimetype.startsWith("image/"))
        {
            if (file.originalname.match(/\.(png|jpeg|jpg)$/))
              cb(null, true);
            else
             cb(new Error("Only JPEG, JPG, and PNG files are allowed"), false);
        }
        else
          cb(new Error("File type not Supported "), false)
     } catch (error) {
        cb(error.message)
     }
}

const uplode = multer({
    storage: storage,
    fileFilter:fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

export {uplode};

