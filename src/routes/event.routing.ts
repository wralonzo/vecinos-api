import { Router } from "express";
import {
  createEventValidationRules,
  updateEventValidationRules,
  findEventByIdValidationRules,
  getEventsPaginatedValidationRules,
} from "src/rules";
import { validateFields, validateJwt } from "src/middleware";
import { createEvent, findEventById, findEventsPaginated, updateEvent } from "src/controller";

export class EventRouting {
  public static get routes(): Router {
    const router = Router();

    /**
     * @swagger
     * /api/event/create:
     *   post:
     *     summary: Initialize event
     *     tags: [Event]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     requestBody:
     *       required: true
     *       content:
     *          application/json:
     *            schema:
     *              type: object
     *              required:
     *                - title
     *                - description
     *                - eventAt
     *              properties:
     *               title:
     *                   type: string
     *                   description: Event title
     *                   example: Mantenimiento en bomba de agua
     *               description:
     *                   type: string
     *                   description: Event description
     *                   example: El día 19 de agosto de 2024 se hará el mantenimiento a la bomba de agua
     *               eventAt:
     *                   type: Date
     *                   description: Date on which the event will occur
     *                   example: 2024-09-08T14:07:21.000Z
     *     responses:
     *       200:
     *         description: Event created
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 200
     *               id: 98
     *       401:
     *        $ref: '#/components/responses/UnauthorizedException'
     *       422:
     *        $ref: '#/components/responses/FieldException'
     *       500:
     *        $ref: '#/components/responses/InternalException'
     */
    router.post("/create", validateJwt, createEventValidationRules(), validateFields, createEvent);

    /**
     * @swagger
     * /api/event/findPaginated:
     *   get:
     *     summary: Get events paginated
     *     tags: [Event]
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
     *         description: Events founded
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
      getEventsPaginatedValidationRules(),
      validateFields,
      findEventsPaginated,
    );

    /**
     * @swagger
     * /api/event/findById/{id}:
     *   get:
     *     summary: Get event by ID
     *     tags: [Event]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: number
     *         description: Event ID
     *         example: 10024
     *     responses:
     *       200:
     *         description: Event found
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
      "/findById/:id",
      validateJwt,
      findEventByIdValidationRules(),
      validateFields,
      findEventById,
    );

    /**
     * @swagger
     * /api/event/update:
     *   put:
     *     summary: Update event
     *     tags: [Event]
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
     *                   type: number
     *                   description: Event ID
     *                   example: 98
     *               status:
     *                   type: number
     *                   description: Status ID
     *                   example: 2
     *               title:
     *                   type: string
     *                   description: Event title
     *                   example: Mantenimiento en bomba de agua
     *               description:
     *                   type: string
     *                   description: Event description
     *                   example: El día 19 de agosto de 2024 se hará el mantenimiento a la bomba de agua
     *               eventAt:
     *                   type: Date
     *                   description: Date on which the event will occur
     *                   example: 2024-09-08T14:07:21.000Z
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
    router.put("/update", validateJwt, updateEventValidationRules(), validateFields, updateEvent);

    return router;
  }
}
