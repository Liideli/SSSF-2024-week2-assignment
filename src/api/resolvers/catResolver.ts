import {GraphQLError} from 'graphql';
import {Cat} from '../../types/DBTypes';
import catModel from '../models/catModel';

export default {
  Query: {
    cats: async (): Promise<Cat[]> => {
      return await catModel.find();
    },
    cat: async (_parent: undefined, args: {id: string}): Promise<Cat> => {
      const cat = await catModel.findById(args.id);
      if (!cat) {
        throw new GraphQLError('Cat not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return cat;
    },
  },
  Mutation: {
    addCat: async (
      _parent: undefined,
      args: {cat: Omit<Cat, '_id'>}
    ): Promise<{message: string; cat?: Cat}> => {
      const cat = await catModel.create(args.cat);
      if (cat) {
        return {message: 'Cat added', cat};
      } else {
        return {message: 'Cat not added'};
      }
    },
    modifyCat: async (
      _parent: undefined,
      args: {id: string; cat: Omit<Cat, '_id' | 'owner' | 'location' | 'id'>}
    ): Promise<{message: string; cat?: Cat}> => {
      const cat = await catModel.findByIdAndUpdate(args.id, args.cat, {
        new: true,
      });
      if (cat) {
        return {message: 'Cat updated', cat};
      } else {
        return {message: 'Cat not updated'};
      }
    },
    deleteCat: async (
      _parent: undefined,
      args: {id: string}
    ): Promise<{message: string; cat?: Cat}> => {
      const cat = await catModel.findByIdAndDelete(args.id);
      if (cat) {
        return {message: 'Cat deleted', cat};
      } else {
        return {message: 'Cat not deleted'};
      }
    },
  },
};
