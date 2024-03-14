const mongoose = require("mongoose");

const ApplicantSchema = new mongoose.Schema({ 
    /*transaction info will be here*/
});

const ApplicantModel = mongoose.model("applicants", ApplicantSchema);
module.exports = ApplicantModel;