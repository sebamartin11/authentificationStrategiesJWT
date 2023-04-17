const mongoose = require("mongoose");
const { options } = require("../config/options");

//connect with the database

mongoose.set("strictQuery", false);

mongoose.connect(options.mongoDb.url, (err) => {
  if (err) return console.log(`Database connection error: ${err}`);
  console.log("Database connection successful");
});

// // DB Connections and Listen
// mongoose.set('strictQuery', false);
// mongoose.connect(options.mongoDb.url)
//   .then(() => {
//     const server = app.listen(PORT, () => {
//       console.log(`Server is up and running on port ${server.address().port}`);
//     });
//     server.on('error', (error) => {
//       console.log('Error starting Server');
//       console.error(error);
//     });
//   });