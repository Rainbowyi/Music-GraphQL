// Import the Mongoose library
//This Script is used to connect to the MongoDB database
//The purpose of global variables is to make them accessible from anywhere in the application
//The purpose of connect function is to establish a connection to a MongoDB database using Mongoose
//The parameters of the connect function are the connection string of the MongoDB database
const mongoose = require('mongoose');
// Define a helper function called "connect" that establishes a connection to a MongoDB database using Mongoose
// The function takes a "connectionString" parameter that specifies the URL of the MongoDB database to connect to
async function connect(connectionString) {
  try {
    // Use Mongoose to connect to the specified database URL with a connection pool size of 10 and automatic reconnection enabled
    const connectionResult = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // If the connection is successful, log a message to the console
    if (connectionResult) console.log('Connected to MongoDB');
  } catch (err) {
    // If the connection fails, log an error message to the console
    console.error('Connection failed', err);
  }
}
// Export the "connect" function so that it can be used by other modules to establish a connection to the same MongoDB database
module.exports.connect = connect;
