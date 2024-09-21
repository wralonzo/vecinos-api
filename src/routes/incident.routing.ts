import { Router } from "express";
import {
  createIncidentValidationRules,
  findIncidentsPaginatedValidationRules,
  updateIncidentValidationRules,
} from "src/rules";
import { validateFields, validateJwt } from "src/middleware";
import { createIncident, findIncidentsPaginated, updateIncident } from "src/controller";

export class IncidentRouter {
  static get routes(): Router {
    const router = Router();

    /**
     * @swagger
     * /api/incident/create:
     *   post:
     *     summary: Create incident
     *     tags: [Incident]
     *     security:
     *      - AuthorizationBearerSchema: []
     *     requestBody:
     *       required: true
     *       content:
     *          application/json:
     *            schema:
     *              type: object
     *              required:
     *                - description
     *              properties:
     *               description:
     *                   type: string
     *                   description: Incident description
     *                   example: No hay servicio de agua potable desde hace tres dias
     *     responses:
     *       200:
     *         description: Incident created
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 200
     *               id: 24
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
      createIncidentValidationRules(),
      validateFields,
      createIncident,
    );

    /**
     * @swagger
     * /api/incident/update:
     *   put:
     *     summary: Update incident
     *     tags: [Incident]
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
     *                - status
     *              properties:
     *               id:
     *                   type: number
     *                   description: Incident ID
     *                   example: 24
     *               status:
     *                   type: number
     *                   description: Incident state
     *                   example: 2
     *               description:
     *                   type: string
     *                   description: Incident description
     *                   example: No hay servicio de agua potable desde hace tres dias.
     *     responses:
     *       200:
     *         description: Incident updated
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
      updateIncidentValidationRules(),
      validateFields,
      updateIncident,
    );

    /**
     * @swagger
     * /api/incident/findPaginated:
     *   get:
     *     summary: Get incidents paginated
     *     tags: [Incident]
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
     *       - in: query
     *         name: author
     *         required: false
     *         schema:
     *           type: number
     *         description: Author ID
     *         example: 7
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
      "/findPaginated",
      validateJwt,
      findIncidentsPaginatedValidationRules(),
      validateFields,
      findIncidentsPaginated,
    );

    return router;
  }
}
