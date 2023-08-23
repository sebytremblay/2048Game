const express = require('express');
const router = express.Router();
const GameState = require('../models/gameStateModel');
const { v4: uuidv4 } = require('uuid');

// Endpoint to create a new game
router.post('/', async (req, res) => {
    try {
        // Ensure the initial game state is provided
        if (!req.body.currentState) {
            return res.status(400).send({ error: 'Initial game state is required' });
        }

        // Create a new game instance
        const game = new GameState({
            gameId: uuidv4(),
            currentGameState: req.body.currentState,
            statesHistory: []  // Empty history for new games
        });

        // Save the game to the database
        await game.save();

        // Return the game ID to the client
        res.status(201).json({ gameId: game.gameId });

    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to update the state of an existing game
router.patch('/:gameId/state', async (req, res) => {
    try {
        // Fetch the game by its ID
        const game = await GameState.findOne({ gameId: req.params.gameId });

        // If the game does not exist, return a 404 error
        if (!game) {
            return res.status(404).send({ error: 'Game not found' });
        }

        // Ensure that a new game state is provided
        const newState = req.body.currentState;
        if (!newState) {
            return res.status(400).send({ error: 'Game state update is required' });
        }

        // Update the game's history and state
        if (game.currentGameState) {
            game.statesHistory.push(game.currentGameState);
        }
        game.currentGameState = newState;
        game.updatedAt = Date.now();

        // Save the updated game to the database
        await game.save();

        // Return the updated game to the client
        res.send(game);

    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to delete an existing game
router.delete('/:gameId', async (req, res) => {
    try {
        // Fetch and delete the game by its ID
        const game = await GameState.findOneAndDelete({ gameId: req.params.gameId });

        // If the game does not exist, return a 404 error
        if (!game) {
            return res.status(404).send({ error: 'Game not found' });
        }

        // Return a success message
        res.status(200).send({ success: 'Game deleted' });

    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to fetch the current state of a game
router.get('/:gameId/state', async (req, res) => {
    try {
        // Fetch the game by its ID
        const game = await GameState.findOne({ gameId: req.params.gameId });

        // If the game or its state does not exist, return a 404 error
        if (!game || !game.currentGameState) {
            return res.status(404).send({ error: 'Game state not found' });
        }

        // Update the game's current state and history
        const returnState = game.currentGameState;
        game.currentGameState = game.statesHistory.pop();
        game.updatedAt = Date.now();

        // Save the game state update to the database
        await game.save();

        // Return the current game state to the client
        res.json(returnState);

    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to fetch the game history
router.get('/:gameId/statehistory', async (req, res) => {
    try {
        // Fetch the game by its ID
        const game = await GameState.findOne({ gameId: req.params.gameId });

        // If the game or its state does not exist, return a 404 error
        if (!game || !game.currentGameState) {
            return res.status(404).send({ error: 'Game state not found' });
        }

        // Return the current game state to the client
        res.json(game.statesHistory);

    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;