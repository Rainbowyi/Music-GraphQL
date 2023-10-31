// Import necessary modules and models

//This Scripts are help to set musicEntryResolver, which contains resolvers for the MusicEntryType, Query, and Mutation types
//The purpose of this script is to define the musicEntryResolver object, which contains resolvers for the MusicEntryType, Query, and Mutation types
//The functions in the musicEntryResolver object are used to retrieve, create, update, and delete Music entries from the database
//The purpose of the "isAuthenticated" function is to check if the user is authenticated
//The parent,args,context parameters are used to access the parent object, query arguments, and context object respectively
const { MusicEntry, validateMusicEntry } = require('../../models/musicEntry');
const { GraphQLError } = require('graphql');

// Define the MusicEntryResolver object, which contains resolvers for the MusicEntryType, Query, and Mutation types
const musicEntryResolver = {
  Query: {
    musicEntry: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Find the Music entry to delete by its ID
        let musicEntry = await MusicEntry.findById(args.id);
        if (!musicEntry) {
          // If the Music entry doesn't exist, throw an Error
          throw new Error('Music entry not found');
        }
        // Check if the user is authorized to delete the Music entry
        isAuthorized(musicEntry, context);

        return musicEntry;
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'GET_MUSIC_ENTRY_ERROR',
          },
        });
      }
    },
    musicEntries: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Find all Music entries
        return await MusicEntry.find({ user: context.user._id });
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'GET_MUSIC_ENTRIES_ERROR',
          },
        });
      }
    },
    searchMusicEntries: async (parent, args) => {
      try {
        // Find all Music entries that match the title provided in the query arguments
        return await MusicEntry.find({
          title: new RegExp('^' + args.title + '$', 'i'),
        });
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'SEARCH_MUSIC_ENTRIES_ERROR',
          },
        });
      }
    },
  },
  // Resolvers for the "addMusicEntry", "editMusicEntry", and "deleteMusicEntry" mutations
  Mutation: {
    createMusicEntry: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Validate the input data using the validateMusicEntry function
        const { error } = validateMusicEntry(args.input);
        if (error) {
          // If the input data is invalid, throw an Error
          throw new Error('Invalid input data');
        }
        // Create a new Music entry using the input data
        const musicEntry = new MusicEntry({
          title: args.input.title,
          style: args.input.style,
          rate: args.input.rate,
          user: context.user._id,
        });
        // Save the new Music entry to the database
        await musicEntry.save();
        // Return the new Music entry
        return musicEntry;
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'CREATE_MUSIC_ENTRY_ERROR',
          },
        });
      }
    },
    updateMusicEntry: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Find the Music entry to update by its ID
        let musicEntry = await MusicEntry.findById(args.id);
        if (!musicEntry) {
          // If the Music entry doesn't exist, throw an Error
          throw new Error('Music entry not found 1');
        }
        // Check if the user is authorized to edit the Music entry
        isAuthorized(musicEntry, context);
        // Update the Music entry with the input data
        musicEntry.title = args.input.title;
        musicEntry.style = args.input.style;
        musicEntry.rate = args.input.rate;
        // Save the updated Music entry to the database
        return await musicEntry.save();
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'UPDATE_MUSIC_ENTRY_ERROR',
          },
        });
      }
    },
    deleteMusicEntry: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);

        // Find the Music entry to delete by its ID
        let musicEntry = await MusicEntry.findById(args.id);
        if (!musicEntry) {
          // If the Music entry doesn't exist, throw an Error
          throw new Error('music entry not found 2');
        }
        // Check if the user is authorized to delete the Music entry
        isAuthorized(musicEntry, context);
        // Delete the Music entry from the database
        await MusicEntry.deleteOne({ _id: args.id });
        // Return a success message and the deleted Music entry
        musicEntry.id = args.id;
        return musicEntry;
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'DELETE_MUSIC_ENTRY_ERROR',
          },
        });
      }
    },
  },
};

function isAuthenticated(context) {
  if (!context.user) {
    throw new AuthenticationError('User is not authenticated');
  }
}

function isAuthorized(musicEntry, context) {
  if (musicEntry.user.toString() !== context.user._id) {
    throw new ApolloError(
      'User is not authorized to edit this music entry',
      'FORBIDDEN',
      {
        httpStatusCode: 403,
      }
    );
  }
}
// Export the musicEntryResolver object
module.exports = musicEntryResolver;
