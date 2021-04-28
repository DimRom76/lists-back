const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const listItemSchema = new Schema(
  {
    item: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'items',
    },
    list: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'lists',
    },
  },
  { versionKey: false, timestamps: true },
);

listItemSchema.plugin(mongoosePaginate);

const listItem = mongoose.model('listItems', listItemSchema);
module.exports = listItem;
