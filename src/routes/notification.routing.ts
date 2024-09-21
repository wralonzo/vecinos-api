import { Router } from "express";
import { validateFields, validateJwt } from "src/middleware";
import { createNotification, findNotificationsByUser, updateNotification } from "src/controller";
import { createNotificationValidationRules, updateNotificationValidationRules } from "src/rules";

export class NotificationRouter {
  public static get routes(): Router {
    const router = Router();

    /**
     * @swagger
     * /api/notification/create:
     *   post:
     *     summary: Insert notification
     *     tags: [Notification]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     requestBody:
     *       required: true
     *       content:
     *          application/json:
     *            schema:
     *              type: object
     *              required:
     *                - user
     *                - message
     *              properties:
     *               user:
     *                   type: number
     *                   description: User to insert notification
     *                   example: 2
     *               message:
     *                   type: string
     *                   description: Notification message
     *                   example: Se ha creado un nuevo foro.
     *     responses:
     *       200:
     *         description: Notification inserted
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 200
     *               id: 3
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
      createNotificationValidationRules(),
      validateFields,
      createNotification,
    );

    /**
     * @swagger
     * /api/notification/update:
     *   put:
     *     summary: Update notification
     *     tags: [Notification]
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
     *                   description: Notification ID to be updated
     *                   example: 2
     *               viewed:
     *                   type: boolean
     *                   description: Send this flag if notification was viewed
     *                   example: true
     *               deleted:
     *                   type: boolean
     *                   description: Send this flag if notification was deleted
     *                   example: false
     *     responses:
     *       200:
     *         description: Notification inserted
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
    router.put(
      "/update",
      validateJwt,
      updateNotificationValidationRules(),
      validateFields,
      updateNotification,
    );

    /**
     * @swagger
     * /api/notification/findByUser:
     *   get:
     *     summary: Get notifications by user
     *     tags: [Notification]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     responses:
     *       200:
     *         description: Notifications found
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
    router.get("/findByUser", validateJwt, validateFields, findNotificationsByUser);

    return router;
  }
}
