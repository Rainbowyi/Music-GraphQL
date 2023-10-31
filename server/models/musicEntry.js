const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const musicEntrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    style: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 5000,
    },
    rate: {
      type: Number,
      min: 0,
      max: 4,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const MusicEntry = mongoose.model('MusicEntry', musicEntrySchema);

// Define a function that validates music entry input using Joi
function validateMusicEntry(musicEntry) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    style: Joi.string().min(3).max(5000).required(),
    rate: Joi.number().integer().min(0).max(5).required(),
    user: Joi.objectId().required(),
  });
  return schema.validate(musicEntry);
}

module.exports.MusicEntry = MusicEntry;
module.exports.validateMusicEntry = validateMusicEntry;
