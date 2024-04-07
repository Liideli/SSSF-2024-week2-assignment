import {GraphQLError} from 'graphql';
import {User} from '../../types/DBTypes';
import userModel from '../models/userModel';

export default {
  Query: {
    users: async (): Promise<User[]> => {
      return await userModel.find();
    },
    user: async (_parent: undefined, args: {id: string}): Promise<User> => {
      const user = await userModel.findById(args.id);
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return user;
    },
  },
};
