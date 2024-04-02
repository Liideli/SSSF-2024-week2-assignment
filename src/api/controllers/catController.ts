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
import {Cat} from '../../types/DBTypes';
import catModel from '../models/catModel';
import {MessageResponse} from '../../types/MessageTypes';
import CustomError from '../../classes/CustomError';

const catGetByUser = async (
  req: Request,
  res: Response<Cat[]>,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new CustomError('User not found', 404);
    }
    const cats = await catModel
      .find({user_id: res.locals.user._id})
      .select('-__v');
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
  req: Request<{id: string}, {}, Omit<Cat, 'cat_id'>>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {
  try {
    const cat = await catModel
      .findByIdAndUpdate(req.params.id, req.body, {new: true})
      .select('-__v');
    if (!cat) {
      throw new CustomError('No cat found', 404);
    }
    res.json({message: 'Cat updated', data: cat});
  } catch (error) {
    next(error);
  }
};

const catDeleteAdmin = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const cat = await catModel.findByIdAndDelete(req.params.id);
    if (!cat) {
      throw new CustomError('No cat found', 404);
    }
    res.json({message: 'Cat deleted'});
  } catch (error) {
    next(error);
  }
};

const catDelete = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {
  try {
    const species = await catModel.findByIdAndDelete(req.params.id);
    if (!species) {
      throw new CustomError('No species found', 404);
    }
    const response = {
      message: 'Species deleted',
      data: species,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};
const catPut = async (
  req: Request<{id: string}, {}, Omit<Cat, 'cat_id'>>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {
  try {
    const species = await catModel
      .findByIdAndUpdate(req.params.id, req.body, {new: true})
      .select('-__v');
    if (!species) {
      throw new CustomError('No species found', 404);
    }
    const response = {
      message: 'Species updated',
      data: species,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const catGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<Cat>,
  next: NextFunction
) => {
  try {
    const species = await catModel.findById(req.params.id);
    if (!species) {
      throw new CustomError('No species found', 404);
    }
    res.json(species);
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
    const cats = await catModel.find();
    res.json(cats);
    console.log(cats);
  } catch (error) {
    next(error);
  }
};

const catPost = async (
  req: Request<{}, {}, Omit<Cat, 'species_id'>>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {
  try {
    const species = await catModel.create(req.body);
    const response = {
      message: 'Species added',
      data: species,
    };
    res.json(response);
  } catch (error) {
    next(error);
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
