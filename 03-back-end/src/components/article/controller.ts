import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';
import { IAddArticleValidator, IAddArticle, IUploadedPhoto } from "./dto/IAddArticle";
import Config from "../../config/dev";
import { v4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import sizeOf from "image-size";
import path = require("path");
import sharp = require("sharp");
import { IEditAritcleValidator, IEditArticle } from "./dto/IEditArticle";

class ArticleController extends BaseController {

    public async getAllMaterials(req: Request, res: Response) {

        const item = await this.services.articleService.getAllMaterials();

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    public async getAllSizes(req: Request, res: Response) {

        const item = await this.services.articleService.getAllSizes();

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    public async getAllColors(req: Request, res: Response) {

        const item = await this.services.articleService.getAllColors();

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    public async getById(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            res.sendStatus(400);
            return;
        }

        const item = await this.services.articleService.getById(
            id,
            {
                loadCategory: true,
                loadPrices: true,
                loadPhotos: true,
                loadColors: true,
                loadSizes: true,
                loadColorSizes: true,
                loadMaterial: true,
            }
        );

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    private isPhotoValid(file: UploadedFile): { isOk: boolean; message?: string } {
        try{
            const size = sizeOf(file.tempFilePath);

            const limits = Config.fileUpload.photos.limits;

            if(size.width < limits.minWidth){
                return {
                    isOk: false,
                    message: `The image must have a widt of at least ${limits.minWidth}px.`,
                }
            }

            if(size.height < limits.minHeight) {
                return {
                    isOk: false,
                    message: `The image must have a height of at least ${limits.minHeight}px`,
                }
            }

            if(size.width > limits.maxWidth) {
                return {
                    isOk: false,
                    message: `The image must have a width of at most ${limits.maxWidth}px`,
                }
            }

            if(size.height > limits.maxHeight) {
                return {
                    isOk: false,
                    message: `The image must have a height of at most ${limits.maxHeight}px`,
                }
            }

            return {
                isOk: true,
            };
        } catch(e){
            return{
                isOk: false,
                message: 'Bad file format.',
            };
        }
    }

    private async resizeUploadPhoto(imagePath: string) {
        const pathParts = path.parse(imagePath);

        const directory = pathParts.dir;
        const fileName = pathParts.name;
        const extension = pathParts.ext;

        for(const resizeSpecification of Config.fileUpload.photos.resizes) {
            const resizedImagePath = directory + "/" + 
                                     fileName + 
                                     resizeSpecification.sufix +
                                     extension;

            await sharp(imagePath)  
                .resize({
                    width: resizeSpecification.width,
                    height: resizeSpecification.height,
                    fit: resizeSpecification.fit,
                    background: { r: 255, g: 255, b: 255, alpha: 1.0 },
                    withoutEnlargement: true,
                })
                .toFile(resizedImagePath);
        }
    }

    public async uploadFiles(req: Request, res: Response): Promise<IUploadedPhoto[]> {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send("You must upload at lease one and a maximum of " + Config.fileUpload.maxFiles + " photos.");
            return [];
        }

        const fileKeys: string[] = Object.keys(req.files);

        const uploadedPhotos: IUploadedPhoto[] = [];

        for (const fileKey of fileKeys) {
            const file = req.files[fileKey] as any;

            const result = this.isPhotoValid(file);

            if(result.isOk === false){
                res.status(400).send(`Error with image ${fileKey}: "${result.message}"`);
                return [];
            }

            const randomString = v4();
            const originalName = file?.name;
            const now = new Date();

            const imagePath = Config.fileUpload.uploadDestinationDirectory +
                              (Config.fileUpload.uploadDestinationDirectory.endsWith("/") ? "" : "/") +
                              now.getFullYear() + "/" +
                              ((now.getMonth() + 1) + "").padStart(2, "0") + "/" +
                              randomString + "-" + originalName;

            await file.mv(imagePath);
            await this.resizeUploadPhoto(imagePath);

            uploadedPhotos.push({
                imagePath: imagePath,
            });
        }
        return uploadedPhotos;
    }

    public async add(req: Request, res: Response) {
        const uploadPhotos = await this.uploadFiles(req, res);

        if(uploadPhotos.length == 0){
            return;
        }

        const data = JSON.parse(req.body?.data);

        if(!IAddArticleValidator(data)) {
            res.status(400).send(IAddArticleValidator.errors);
            return;
        }

        const result = await this.services.articleService.add(data as IAddArticle, uploadPhotos );

        res.send(result);
    }

    public async edit(req: Request, res: Response) {
        const id: number =  +(req.params?.id);

        if(id <= 0) {
            return res.sendStatus(400);
        }

        if(!IEditAritcleValidator(req.body)) {
            return res.status(400).send(IAddArticleValidator.errors);
        }

        const result = await this.services.articleService.edit(id, req.body as IEditArticle);

        if(result === null) {
            return res.sendStatus(404);
        }
        res.send(result);
    }

    public async delete(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if( id <= 0){
            return res.sendStatus(400);
        }
        const item = await this.services.articleService.getById(id);

        if(item === null){
            res.sendStatus(404);
            return;
        }
        res.send(await this.services.articleService.delete(id));
    }

    public async deleteArticlePhoto(req: Request, res: Response) {
        const articleId: number = +(req.params?.aid);
        const photoId: number = +(req.params?.pid);

        if(articleId <= 0 || photoId <= 0) return res.sendStatus(400);

        const result = await this.services.articleService.deleteArticlePhoto(articleId, photoId);

        if(result === null) return res.sendStatus(404);

        res.send(result);
    }

    public async addArticlePhotos(req: Request, res: Response) {
        const articleId: number = +(req.params?.id);

        if(articleId <= 0) return res.sendStatus(400);

        const item = await this.services.articleService.getById(articleId);

        if(item === null) return res.sendStatus(404);

        const uploadedPhotos = await this.uploadFiles(req, res);

        if(uploadedPhotos.length === 0){
            return;
        }
        res.send(await this.services.articleService.addArticlePhotos(articleId, uploadedPhotos));
    }

    public async getAllByCategoryId(req: Request, res: Response) {
        const id: number = +(req.params.id);
        if(id <= 0) return res.status(400).send("Invalid category ID value.");
        const items = await this.services.articleService.getAllByCategoryId(id);
        res.send(await this.services.articleService.getAllByCategoryId(id));
    }

    /* public async getAllArticlesBySizeId(req: Request, res: Response) {
        const id: number = +(req.params.sid);
        if(id <= 0) return res.status(400).send("Invalid size ID value.");
        const items = await this.services.articleService.getAllArticlesBySizeId(id);
        res.send(await this.services.articleService.getAllArticlesBySizeId(id));
    }  */

    
}

export default ArticleController;