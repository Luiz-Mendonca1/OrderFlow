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
import { ListProductCategoryController } from './controllers/product/ListProductCategoryController';
import { ListOrderController } from './controllers/order/ListOrderController';
import { CreateOrderController } from './controllers/order/CreateOrderController';
import { AddItemOrderController } from './controllers/order/AddItemOrderController';
import { addItemOrderSchema, createOrderSchema, detailOrderSchema, removeItemOrderSchema, sendOrderSchema } from './schemas/orderSchema';
import { RemoveItemOrderController } from './controllers/order/RemoveItemOrderController';
import { DetailOrderController } from './controllers/order/DetailOrderController';
import { SendOrderController } from './controllers/order/SendOrderController';

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

const listProductCategoryController = new ListProductCategoryController();
router.get('/product/category', isAuthenticated, (req, res) => listProductCategoryController.handle(req, res));

// rotas order
const listOrderController = new ListOrderController();
router.get('/order', isAuthenticated, (req, res) => listOrderController.handle(req, res));

const createOrderController = new CreateOrderController();
router.post('/order', isAuthenticated, validateSchema(createOrderSchema), (req, res) => createOrderController.handle(req, res));

const addItemOrderController = new AddItemOrderController() ;
router.post('/order/add', isAuthenticated, validateSchema(addItemOrderSchema), (req, res) => addItemOrderController.handle(req, res));

const removeItemOrderController = new RemoveItemOrderController();
router.delete('/order/remove', isAuthenticated, isAdmin, validateSchema(removeItemOrderSchema), (req, res) => removeItemOrderController.handle(req, res));

const detailOrderController = new DetailOrderController();
router.get('/order/detail', isAuthenticated, validateSchema(detailOrderSchema), (req, res) => detailOrderController.handle(req, res));

const sendOrderController = new SendOrderController();
router.put('/order/send', isAuthenticated, validateSchema(sendOrderSchema), (req, res) => sendOrderController.handle(req, res));

export default router;