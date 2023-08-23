// server/models/stateModel.js
const mongoose = require('mongoose');

const tileMetaSchema = new mongoose.Schema({
    id: Number,
    position: [Number],
    value: Number,
    mergeWith: Number
});

const stateSchema = new mongoose.Schema({
    tiles: {
    type: Map,
    of: tileMetaSchema
    },
    inMotion: Boolean,
    hasChanged: Boolean,
    byIds: [Number]
});

var gameSchema = new mongoose.Schema({
    gameId: { type: String, required: true, unique: true },
    statesHistory: [stateSchema],
    currentGameState: stateSchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);
