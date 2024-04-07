// TODO: create the following functions:
// - userGet - get user by id
// - userListGet - get all users
// - userPost - create new user. Remember to hash password
// - userPutCurrent - update current user
// - userDeleteCurrent - delete current user
// - checkToken - check if current user token is valid: return data from res.locals.user as UserOutput. No need for database query

/*
import {Request, Response, NextFunction} from 'express';
import {LoginUser, User, UserOutput} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcrypt';

const userGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<User>,
  next: NextFunction
) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select('-password -__v -role');
    if (!user) {
      throw new CustomError('No users found', 404);
    }
    res.json(user);
    console.log(user);
  } catch (error) {
    next(error);
  }
};

const userListGet = async (
  req: Request,
  res: Response<User[]>,
  next: NextFunction
) => {
  try {
    const users = await userModel.find().select('-password -__v -role');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const userPost = async (
  req: Request<{}, {}, Omit<User, 'user_id'>>,
  res: Response<
    MessageResponse & {data: Omit<UserOutput, 'password' | 'role'>}
  >,
  next: NextFunction
) => {
  try {
    req.body.role = 'user';
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const user = await userModel.create(req.body);
    const {password, role, ...userWithoutPasswordAndRole} = user;
    const response = {
      message: 'User added',
      data: userWithoutPasswordAndRole as Omit<UserOutput, 'password' | 'role'>,
    };
    res.json(response);
    console.log('resp', response);
  } catch (error) {
    next(error);
  }
};

const userPutCurrent = async (
  req: Request<{}, {}, Omit<User, 'user_id'>>,
  res: Response<MessageResponse & {data: User}, {user: LoginUser}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      throw new CustomError('Not authorized', 401);
    }
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const user = await userModel
      .findByIdAndUpdate(res.locals.user._id, req.body, {
        new: true,
      })
      .select('-password -__v -role');
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    const response = {
      message: 'User updated',
      data: user,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const userDeleteCurrent = async (
  req: Request<{}, {}, {}>,
  res: Response<MessageResponse & {data: UserOutput}, {user: UserOutput}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      throw new CustomError('Not authorized', 401);
    }
    const user = await userModel
      .findByIdAndDelete(res.locals.user._id)
      .select('-password -__v -role');
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    res.json({message: 'User deleted', data: user});
  } catch (error) {
    next(error);
  }
};

const checkToken = async (
  req: Request,
  res: Response<Partial<User>, {user: LoginUser}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      throw new CustomError('Not authorized', 401);
    }
    const user: Partial<User> = {...res.locals.user};
    delete user.role;

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export {
  userListGet,
  userGet,
  userPost,
  userPutCurrent,
  userDeleteCurrent,
  checkToken,
};
*/
