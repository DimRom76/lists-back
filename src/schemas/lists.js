const { array } = require('joi');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const listsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for lists']
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user'
    },
    items: [
      {
        item: { type: mongoose.SchemaTypes.ObjectId, ref: 'items' },
        isCompletedItem: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  { versionKey: false, timestamps: true }
);

listsSchema.plugin(mongoosePaginate);

const Lists = mongoose.model('lists', listsSchema);
module.exports = Lists;
