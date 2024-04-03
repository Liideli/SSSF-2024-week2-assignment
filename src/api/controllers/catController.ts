// TODO: create following functions:
// - catGetByUser - get all cats by current user id
// - catGetByBoundingBox - get all cats by bounding box coordinates (getJSON)
// - catPutAdmin - only admin can change cat owner
// - catDeleteAdmin - only admin can delete cat
// - catDelete - only owner can delete cat
// - catPut - only owner can update cat
// - catGet - get cat by id
// - catListGet - get all cats
// - catPost - create new cat

import {Request, Response, NextFunction} from 'express';
import {Cat, CatTest, LoginUser, UserOutput} from '../../types/DBTypes';
import catModel from '../models/catModel';
import {MessageResponse} from '../../types/MessageTypes';
import CustomError from '../../classes/CustomError';
import {validationResult} from 'express-validator';

const catGetByUser = async (
  req: Request,
  res: Response<Cat[], {user: UserOutput}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      throw new CustomError('Not authorized', 401);
    }
    const cats = await catModel
      .find({owner: res.locals.user._id})
      .select('-__v')
      .populate('owner', '-__v -password -role');
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

/*const catGetByBoundingBox = async (
  req: Request,
  res: Response<Cat[]>,
  next: NextFunction
) => {
  try {
    const topRight = JSON.parse(req.query.topRight as string);
    const bottomLeft = JSON.parse(req.query.bottomLeft as string);
    const cats = await catModel
      .find({
        location: {
          $geoWithin: {
            $box: [bottomLeft, topRight],
          },
        },
      })
      .select('-__v');
    res.json(cats);
  } catch (error) {
    next(error);
  }
};*/

const catGetByBoundingBox = async (
  req: Request<{}, {}, {}, {topRight: string; bottomLeft: string}>,
  res: Response<Cat[]>,
  next: NextFunction
) => {
  try {
    // query example: /species/area?topRight=40.73061,-73.935242&bottomLeft=40.71427,-74.00597
    // longitude first, then latitude (opposite of google maps)

    const {topRight, bottomLeft} = req.query;
    const rightCorner = topRight.split(',');
    const leftCorner = bottomLeft.split(',');

    const species = await catModel.find({
      location: {
        $geoWithin: {
          $box: [leftCorner, rightCorner],
        },
      },
    });

    res.json(species);
  } catch (error) {
    next(error);
  }
};

const catPutAdmin = async (
  req: Request<{id: string}, {}, Partial<Cat>>,
  res: Response<MessageResponse & {data: Cat}, {user: LoginUser}>,
  next: NextFunction
) => {
  try {
    if (res.locals.user.role !== 'admin') {
      throw new CustomError('Not authorized', 401);
    }
    const cat = await catModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!cat) {
      throw new CustomError('Cat not found', 404);
    }
    const response = {
      message: 'Cat updated',
      data: cat,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const catDeleteAdmin = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<MessageResponse & {data: Cat}, {user: LoginUser}>,
  next: NextFunction
) => {
  try {
    if (res.locals.user.role !== 'admin') {
      throw new CustomError('Not authorized', 401);
    }
    const cat = await catModel.findByIdAndDelete(req.params.id);

    if (!cat) {
      throw new CustomError('Cat not found', 404);
    }
    const response = {
      message: 'Cat deleted',
      data: cat,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const catDelete = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<MessageResponse & {data: CatTest}, {user: LoginUser}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      throw new CustomError('Not authorized', 401);
    }
    const params = {
      _id: req.params.id,
      owner: res.locals.user._id,
    };
    const cat = await catModel.findOneAndDelete(params);

    if (!cat) {
      throw new CustomError('Cat not found', 404);
    }
    const response = {
      message: 'Cat deleted',
      data: cat as CatTest,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const catPut = async (
  req: Request<{id: string}, {}, Partial<Cat>>,
  res: Response<MessageResponse & {data: Cat}, {user: LoginUser}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      throw new CustomError('Not authorized', 401);
    }
    const params = {
      _id: req.params.id,
      owner: res.locals.user._id,
    };
    const cat = await catModel.findOneAndUpdate(params, req.body, {
      new: true,
    });
    if (!cat) {
      throw new CustomError('Cat not found', 404);
    }
    const response = {
      message: 'Cat updated',
      data: cat,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const catGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<Cat, {user: UserOutput}>,
  next: NextFunction
) => {
  try {
    const cat = await catModel
      .findById(req.params.id)
      .select('-__v')
      .populate('owner', '-__v -password -role');
    if (!cat) {
      throw new Error('No cats found');
    }
    res.json(cat);
  } catch (error) {
    next(error);
  }
};

const catListGet = async (
  req: Request,
  res: Response<Cat[]>,
  next: NextFunction
) => {
  try {
    const cats = await catModel
      .find()
      .select('-__v')
      .populate('owner', '-__v -password -role');
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const catPost = async (
  req: Request<{}, {}, Partial<Cat>>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }

  const filename = req.file?.filename;
  const owner = res.locals.user._id;
  const coords = res.locals.coords;

  if (typeof filename === 'string') {
    const newCat = {
      cat_name: req.body.cat_name,
      weight: Number(req.body.weight),
      owner: owner,
      filename,
      birthdate: req.body.birthdate,
      location: coords,
    };

    try {
      const result = await catModel.create(newCat);
      if (!result) {
        throw new CustomError('Error creating a cat', 500);
      }
      const response = {
        message: 'Cat added',
        data: result,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
};

export {
  catGetByUser,
  catGetByBoundingBox,
  catPutAdmin,
  catDeleteAdmin,
  catDelete,
  catPut,
  catGet,
  catListGet,
  catPost,
};
