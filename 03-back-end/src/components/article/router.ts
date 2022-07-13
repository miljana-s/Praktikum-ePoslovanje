import { Application } from 'express';
import IApplicationResourcesInterface from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import ArticleController from './controller';
export default class ArticleRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResourcesInterface) {
        const articleController = new ArticleController(resources);

        application.get('/article/:id', articleController.getById.bind(articleController));
        application.post(
            '/article',
            AuthMiddleware.getVerifier("administrator"),
             articleController.add.bind(articleController));

        application.put(
            '/article/:id',
            AuthMiddleware.getVerifier("administrator"),
             articleController.edit.bind(articleController));

        application.delete(
            '/article/:id',
            AuthMiddleware.getVerifier("administrator"),
             articleController.delete.bind(articleController));

        application.delete(
            '/article/:aid/photo/:pid',
            AuthMiddleware.getVerifier("administrator"),
             articleController.deleteArticlePhoto.bind(articleController));

        application.post(
            '/article/:id/photo',
            AuthMiddleware.getVerifier("administrator"),
             articleController.addArticlePhotos.bind(articleController));

        application.get('/category/:id/article', articleController.getAllByCategoryId.bind(articleController));

        application.get('/size', articleController.getAllSizes.bind(articleController));
        application.get('/color', articleController.getAllColors.bind(articleController));
        application.get('/material', articleController.getAllMaterials.bind(articleController));
    }
}