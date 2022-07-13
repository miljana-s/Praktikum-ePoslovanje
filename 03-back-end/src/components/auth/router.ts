import { Application } from 'express';
import IApplicationResourcesInterface from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import AuthController from './controller';

export default class AuthRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResourcesInterface) {
        const authController: AuthController = new AuthController(resources);

        application.post("/auth/administrator/login", authController.administratorLogin.bind(authController));
        application.post("/auth/administrator/refresh", authController.administratorRefresh.bind(authController));
 
        application.get(
            "/auth/administrator/ok",
            AuthMiddleware.getVerifier("administrator"),
            authController.sendOk.bind(authController)
        );
    }
}