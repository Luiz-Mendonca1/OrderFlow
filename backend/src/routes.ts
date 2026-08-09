import {Router} from 'express';
import multer from 'multer';
import uploadConfig from './config/multer';
import {CreateUserController} from './controllers/user/CreateUserController';
import { authUserSchema, createUserSchema } from './schemas/userSchema';
import { validateSchema } from './middlewares/validateSchema';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { CreateCategoryController } from './controllers/category/CreateCategoryController';
import { isAdmin } from './middlewares/isAdmin';
import { createCategorySchema } from './schemas/categorySchema';
import { ListCategoryController } from './controllers/category/ListCategoryController';
import { CreateProductController } from './controllers/product/CreateProductController';
import { createProductSchema } from './schemas/productSchema';
import { ListProductController } from './controllers/product/ListProductController';
import { DeleteProductController } from './controllers/product/DeleteProductController';

const router = Router();
const upload = multer(uploadConfig);

// rotas user
const createUserController = new CreateUserController();
router.post('/users', validateSchema(createUserSchema), (req, res) => createUserController.handle(req, res));

const authUserController = new AuthUserController();
router.post('/session', validateSchema(authUserSchema), (req, res) => authUserController.handle(req, res));

const detailUserController = new DetailUserController();
router.get('/me', isAuthenticated, (req, res) => detailUserController.handle(req, res));

// rotas category
const createCategoryController = new CreateCategoryController();
router.post('/category', isAuthenticated, isAdmin, validateSchema(createCategorySchema), (req, res) => createCategoryController.handle(req, res));

const listCategoryController = new ListCategoryController();
router.get('/category', isAuthenticated, (req, res) => listCategoryController.handle(req, res));

// rotas product
const createProductController = new CreateProductController();
router.post('/product', isAuthenticated, isAdmin, upload.single('file'), validateSchema(createProductSchema), (req, res) => createProductController.handle(req, res));

const listProductController = new ListProductController();
router.get('/product', isAuthenticated, (req, res) => listProductController.handle(req, res));

const deleteProductController = new DeleteProductController();
router.delete('/product', isAuthenticated, isAdmin, (req, res) => deleteProductController.handle(req, res));

export default router;