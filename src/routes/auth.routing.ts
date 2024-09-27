import { Router } from "express";
import { findUser, refreshToken, registerUser, signIn, updateUser } from "src/controller";
import { validateFields } from "src/middleware";
import {
  refreshTokenValidationRules,
  registerUserValidationRules,
  signInValidationRules,
} from "src/rules";

export class AuthRouter {
  static get routes(): Router {
    const router = Router();

    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Sign in
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *          application/json:
     *            schema:
     *              type: object
     *              required:
     *                - email
     *                - displayName
     *                - password
     *              properties:
     *               email:
     *                   type: string
     *                   description: User email
     *                   example: john.smith@example.com
     *               displayName:
     *                   type: string
     *                   description: User display name
     *                   example: Jhon Smith
     *               password:
     *                   type: string
     *                   description: User password
     *                   example: j0hn,2024!
     *     responses:
     *       200:
     *         description: Neighborhood created
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 200
     *       400:
     *         description: Email already exists
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 400
     *               message: Email already exists
     *       422:
     *        $ref: '#/components/responses/FieldException'
     *       500:
     *        $ref: '#/components/responses/InternalException'
     */
    router.post("/register", registerUserValidationRules(), validateFields, registerUser);

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Log in
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *          application/json:
     *            schema:
     *              type: object
     *              required:
     *                - email
     *                - password
     *              properties:
     *               email:
     *                   type: string
     *                   description: User email
     *                   example: john.smith@example.com
     *               password:
     *                   type: string
     *                   description: User password
     *                   example: j0hn,2024!
     *     responses:
     *       200:
     *         description: Neighborhood logged
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 200
     *               refresh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTcyNDAzMzU2NiwiZXhwIjoxNzI0NjM4MzY2fQ.zZDgDK3YPIEwmyHJ3_phgBzTzZECeiIpuRWQDJSxpUs
     *               authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTcyNDAzMzU2NiwiZXhwIjoxNzI0MDQ3OTY2fQ.rWmjTX5h35yQuZ6SC03aETligAsxT941ZebslvYA69M
     *       400:
     *         description: Email or password are wrong
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 400
     *               message: Email or password are wrong
     *       403:
     *         description: Neighborhood is blocked
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 403
     *               message: Neighborhood is blocked
     *       404:
     *         description: Neighborhood not found
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 404
     *               message: Neighborhood not found
     *       422:
     *        $ref: '#/components/responses/FieldException'
     *       500:
     *        $ref: '#/components/responses/InternalException'
     */
    router.post("/login", signInValidationRules(), validateFields, signIn);

    /**
     * @swagger
     * /api/auth/refresh:
     *   get:
     *     summary: Create new authorization token based in a refresh token
     *     tags: [Auth]
     *     security:
     *      - RefreshCookieSchema: []
     *     responses:
     *       200:
     *         description: Authorization token generated
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 200
     *               authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTcyNDAzMzYyNiwiZXhwIjoxNzI0MDQ4MDI2fQ.GXvhRDjqpxb-KKVuqENqT-iUAy91gaClBktHcEHRPjo
     *       400:
     *         description: Refresh token not valid
     *         content:
     *           application/json:
     *             example:
     *               statusCode: 400
     *               message: Refresh token not valid
     *       422:
     *        $ref: '#/components/responses/FieldException'
     *       500:
     *        $ref: '#/components/responses/InternalException'
     */
    router.get("/refresh", refreshTokenValidationRules(), validateFields, refreshToken);

    router.post("/update", updateUser);
    router.get("/find/:id", findUser);

    return router;
  }
}
