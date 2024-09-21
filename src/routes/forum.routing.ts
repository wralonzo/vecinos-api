import { Router } from "express";
import { array } from "src/client";
import { createForum, deleteForum, getForums, updateForum } from "src/controller";
import { validateFields, validateJwt } from "src/middleware";
import {
  createForumValidationRules,
  deleteForumValidationRules,
  findForumsValidationRules,
  updateForumValidationRules,
} from "src/rules";

export class ForumRouter {
  static get routes(): Router {
    const router = Router();

    /**
     * @swagger
     * /api/forum/create:
     *   post:
     *     summary: Initialize forum
     *     tags: [Forum]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     requestBody:
     *       required: true
     *       content:
     *          multipart/form-data:
     *            schema:
     *              type: object
     *              required:
     *                - title
     *                - description
     *              properties:
     *               title:
     *                   type: string
     *                   description: Forum title
     *                   example: Mantenimiento en bomba de agua
     *               description:
     *                   type: string
     *                   description: Forum description
     *                   example: El día 19 de agosto de 2024 se hará el mantenimiento a la bomba de agua
     *               evidence:
     *                   type: string
     *                   description: File containing evidence for the reply
     *     responses:
     *       200:
     *         description: Forum created
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 200
     *               id: 10024
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
      array,
      createForumValidationRules(),
      validateFields,
      createForum,
    );

    /**
     * @swagger
     * /api/forum/update:
     *   post:
     *     summary: Edit forum
     *     tags: [Forum]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     requestBody:
     *       required: true
     *       content:
     *          multipart/form-data:
     *            schema:
     *              type: object
     *              required:
     *                - id
     *                - title
     *                - description
     *              properties:
     *               id:
     *                   type: string
     *                   description: Forum ID
     *                   example: 10024
     *               title:
     *                   type: string
     *                   description: Forum title
     *                   example: Mantenimiento en bomba de agua
     *               description:
     *                   type: string
     *                   description: Forum description
     *                   example: El día 19 de agosto de 2024 se hará el mantenimiento a la bomba de agua'
     *               evidence:
     *                   type: string
     *                   description: File containing evidence for the reply
     *     responses:
     *       200:
     *         description: Forum updated
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
      array,
      updateForumValidationRules(),
      validateFields,
      updateForum,
    );

    /**
     * @swagger
     * /api/forum/delete:
     *   delete:
     *     summary: Delete forum
     *     tags: [Forum]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     requestBody:
     *       required: true
     *       content:
     *          application/json:
     *            schema:
     *              type: object
     *              required:
     *                - id
     *              properties:
     *               id:
     *                   type: string
     *                   description: Forum ID
     *                   example: 10024
     *     responses:
     *       200:
     *         description: Forum deleted
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
      deleteForumValidationRules(),
      validateFields,
      deleteForum,
    );

    /**
     * @swagger
     * /api/forum/findPaginated:
     *   get:
     *     summary: Get forums paginated
     *     tags: [Forum]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     parameters:
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
     *         description: Forums found
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
      "/findPaginated",
      validateJwt,
      findForumsValidationRules(),
      validateFields,
      getForums,
    );

    return router;
  }
}
