import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJwt.middlewares.js";
import {addConversations, findConversations} from "../controllers/Conversation.controllers.js"

const router = Router()

router.route('/addConversation').post(addConversations);
router.route('/searchConversations').get(findConversations);

export default router