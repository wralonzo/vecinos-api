import { Router } from "express";
import { createReply, deleteReply, getRepliesByForum, updateReply } from "src/controller";
import {
  updateForumReplyValidationRules,
  createForumReplyValidationRules,
  getRepliesByForumValidationRules,
  deleteForumReplyValidationRules,
} from "src/rules";
import { validateFields, validateJwt } from "src/middleware";
import { single } from "src/client";

export class ReplyRouter {
  static get routes(): Router {
    const router = Router();

    /**
     * @swagger
     * /api/reply/create:
     *   post:
     *     summary: Create reply
     *     tags: [Reply]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     requestBody:
     *       required: true
     *       content:
     *          multipart/form-data:
     *            schema:
     *              type: object
     *              required:
     *                - forumId
     *                - description
     *              properties:
     *               forumId:
     *                   type: number
     *                   description: Forum Id
     *                   example: 10024
     *               parentReplyId:
     *                   type: number
     *                   description: Forum Id
     *                   example: 7
     *               description:
     *                   type: string
     *                   description: Reply description
     *                   example: El día 19 de agosto de 2024 se hará el mantenimiento a la bomba de agua
     *               evidence:
     *                   type: string
     *                   description: File containing evidence for the reply
     *     responses:
     *       200:
     *         description: Reply created
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 200
     *               id: 71
     *       401:
     *        $ref: '#/components/responses/UnauthorizedException'
     *       422:
     *        $ref: '#/components/responses/FieldException'
     *       500:
     *        $ref: '#/components/responses/InternalException'
     */
    router.post(
      "/create",
      validateJwt,
      single,
      createForumReplyValidationRules(),
      validateFields,
      createReply,
    );

    /**
     * @swagger
     * /api/reply/findPaginated/{forumId}:
     *   get:
     *     summary: Get replies paginated by forum
     *     tags: [Reply]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     parameters:
     *       - in: path
     *         name: forumId
     *         required: true
     *         schema:
     *           type: number
     *         description: Forum ID
     *         example: 10024
     *       - in: query
     *         name: page
     *         required: false
     *         schema:
     *           type: number
     *         description: Page number
     *         example: 1
     *       - in: query
     *         name: pageSize
     *         required: false
     *         schema:
     *           type: number
     *         description: Records by page
     *         example: 10
     *     responses:
     *       200:
     *         description: Replies founded
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 200
     *               data: [...]
     *       401:
     *        $ref: '#/components/responses/UnauthorizedException'
     *       422:
     *        $ref: '#/components/responses/FieldException'
     *       500:
     *        $ref: '#/components/responses/InternalException'
     */
    router.get(
      "/findPaginated/:forumId",
      validateJwt,
      getRepliesByForumValidationRules(),
      validateFields,
      getRepliesByForum,
    );

    /**
     * @swagger
     * /api/reply/update:
     *   post:
     *     summary: Update reply
     *     tags: [Reply]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     requestBody:
     *       required: true
     *       content:
     *          multipart/form-data:
     *            schema:
     *              type: object
     *              required:
     *                - replyId
     *                - forumId
     *                - description
     *              properties:
     *               forumId:
     *                   type: number
     *                   description: Forum Id
     *                   example: 10024
     *               replyId:
     *                   type: number
     *                   description: Reply Id
     *                   example: 7
     *               description:
     *                   type: string
     *                   description: Reply description
     *                   example: El día 19 de agosto de 2024 se hará el mantenimiento a la bomba de agua
     *               evidence:
     *                   type: string
     *                   description: File containing evidence for the reply
     *     responses:
     *       200:
     *         description: Reply updated
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 200
     *       401:
     *        $ref: '#/components/responses/UnauthorizedException'
     *       422:
     *        $ref: '#/components/responses/FieldException'
     *       500:
     *        $ref: '#/components/responses/InternalException'
     */
    router.post(
      "/update",
      validateJwt,
      single,
      updateForumReplyValidationRules(),
      validateFields,
      updateReply,
    );

    /**
     * @swagger
     * /api/reply/delete:
     *   delete:
     *     summary: Delete reply
     *     tags: [Reply]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     requestBody:
     *       required: true
     *       content:
     *          application/json:
     *            schema:
     *              type: object
     *              required:
     *                - replyId
     *                - forumId
     *              properties:
     *               forumId:
     *                   type: string
     *                   description: Forum ID
     *                   example: 10024
     *               replyId:
     *                   type: string
     *                   description: Reply ID
     *                   example: 7
     *     responses:
     *       200:
     *         description: Reply deleted
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 200
     *       401:
     *        $ref: '#/components/responses/UnauthorizedException'
     *       422:
     *        $ref: '#/components/responses/FieldException'
     *       500:
     *        $ref: '#/components/responses/InternalException'
     */
    router.delete(
      "/delete",
      validateJwt,
      deleteForumReplyValidationRules(),
      validateFields,
      deleteReply,
    );

    return router;
  }
}
