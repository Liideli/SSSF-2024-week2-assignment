import express, {Request} from 'express';
import {
  catDelete,
  catGet,
  catListGet,
  catPost,
  catPut,
  catGetByUser,
  catGetByBoundingBox,
  catPutAdmin,
  catDeleteAdmin,
} from '../controllers/catController';
import multer, {FileFilterCallback} from 'multer';
import {body, param, query} from 'express-validator';
import {
  authenticate,
  getCoordinates,
  makeThumbnail,
  validationErrors,
} from '../../middlewares';

const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({dest: './uploads/', fileFilter});
const router = express.Router();

router
  .route('/')
  .get(catListGet)
  .post(
    authenticate,
    upload.single('cat'),
    makeThumbnail,
    getCoordinates,
    body('cat_name').notEmpty().escape(),
    body('birthdate').isDate(),
    body('weight').isNumeric(),
    validationErrors,
    catPost
  );

router
  .route('/area')
  .get(
    query('topRight').notEmpty(),
    query('bottomLeft').notEmpty(),
    catGetByBoundingBox
  );

router.route('/user').get(authenticate, catGetByUser);

router
  .route('/admin/:id')
  .put(
    param('id').isMongoId().notEmpty(),
    authenticate,
    validationErrors,
    catPutAdmin
  )
  .delete(authenticate, catDeleteAdmin);

router
  .route('/:id')
  .get(
    param('id'),
    param('id').isMongoId().notEmpty(),
    validationErrors,
    catGet
  )
  .put(
    authenticate,
    param('id'),
    param('id').isMongoId().notEmpty(),
    body('cat_name').notEmpty().escape().optional(),
    body('birthdate').isDate().optional(),
    body('weight').isNumeric().optional(),
    validationErrors,
    catPut
  )
  .delete(
    authenticate,
    param('id'),
    param('id').isMongoId().notEmpty(),
    validationErrors,
    catDelete
  );

export default router;
