import multer from "multer";

export default {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de tamanho do arquivo em bytes (5MB)
    },
    fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

        if(allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos JPG, JPEG, PNG são permitidos'), false);
        }
    }
}