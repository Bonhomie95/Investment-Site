const mongoose = require('mongoose');

mongoose.connect(process.env.dbcon, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
