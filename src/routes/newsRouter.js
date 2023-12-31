import express from 'express';
import {
  createNews,
  deleteSingleNews,
  showNews,
  showSingleNews,
  updateSingleNews,
} from '../controller/newsController.js';
import { loginUserOnlyRoute } from '../middleware/loginUserOnly.middleware.js';

/**
 * URL("/news")
 * Router for news routes.
 */
const router = express.Router();

/**
 * GET /
 * Handles the POST request for user signup.
 */
router.get('/', showNews);

/**
 * POST /
 * Handles the POST request to create news.
 */

router.post('/', loginUserOnlyRoute, createNews);

/**
 * GET /:id
 * Handles the GET request to retrieve a single news item by ID.
 */
router.get('/:id', showSingleNews);

/**
 * PUT /:id
 * Handles the PUT request to update a single news item by ID.
 */
router.put('/:id', loginUserOnlyRoute, updateSingleNews);

/**
 * DELETE /:id
 * Handles the DELETE request to delete a single news item by ID.
 */
router.delete('/:id', loginUserOnlyRoute, deleteSingleNews);

export default router;
