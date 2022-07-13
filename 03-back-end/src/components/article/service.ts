import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptionsInterface from "../../common/IModelAdapterOptions.interface";
import CategoryModel from "../category/model";
import { IAddArticle, IUploadedPhoto } from "./dto/IAddArticle";
import { IEditArticle } from "./dto/IEditArticle";
import ArticleModel, { ArticleColor, ArticlePhoto, ArticlePrice, ArticleSize, ColorSize, Material } from "./model";
import * as fs from 'fs';
import Config from '../../config/dev';
import path = require('path');


class ArticleModelAdapterOptions implements IModelAdapterOptionsInterface {
    loadCategory: boolean = false;
    loadPrices: boolean = false;
    loadPhotos: boolean = false;
    loadColors: boolean = false;
    loadSizes: boolean = false;
    loadColorSizes: boolean = false;
    loadMaterial: boolean = false;
}

class ArticleService extends BaseService<ArticleModel> {

    protected async adaptModel(
        data: any,
        options: Partial<ArticleModelAdapterOptions>
    ): Promise<ArticleModel> {
        const item: ArticleModel = new ArticleModel();

        item.articleId       = +(data?.article_id);
        item.title           = data?.title;
        item.description     = data?.description;
        item.isActive        = +(data?.is_active) === 1;
        item.isPromoted      = +(data?.is_promoted) === 1;
        item.createdAt       = new Date(data?.created_at);
        item.categoryId      = +(data?.category_id);

        item.currentPrice    = await this.getLatestPriceByArticleId(item.articleId);


        if (options.loadCategory) {
            item.category = await this.services.categoryService.getById(item.categoryId) as CategoryModel;
        }

        if (options.loadPrices) {
            item.prices = await this.getAllPricesByArticleId(item.articleId);
        }

        if (options.loadPhotos) {
            item.photos = await this.getAllPhotosByArticleId(item.articleId);
        }

        if (options.loadColors) {
            item.colors = await this.getAllColorsByArticleId(item.articleId);
        }

        if (options.loadSizes) {
            item.sizes = await this.getAllSizesByArticleId(item.articleId);
        }  

        if (options.loadColorSizes) {
            item.colorSizes = await this.getAllColorSizesByArticleId(item.articleId);
        }  

        if (options.loadMaterial) {
            item.material = await this.getAllMaterialsByArticleId(item.articleId);
        }
    
        return item;
    }


    public async getAllMaterials(): Promise<Material[]> {
        const sql = 
        `SELECT
            material_id,
            name
        FROM 
            material;`;
        const [ rows ] = await this.db.execute(sql);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: Material[] = [];

        for (const row of rows as any) {
            items.push({
                materialId: +(row?.material_id),
                name: row?.name,
            });
        }

        return items;
    }
    

    public async getAllSizes(): Promise<ArticleSize[]> {
        const sql = 
        `SELECT
            size_id,
            name
        FROM 
            size;`;
        const [ rows ] = await this.db.execute(sql);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: ArticleSize[] = [];

        for (const row of rows as any) {
            items.push({
                sizeId: +(row?.size_id),
                name: row?.name,
            });
        }

        return items;
    }

    public async getAllColors(): Promise<ArticleColor[]> {
        const sql = 
        `SELECT
            color_id,
            name
        FROM 
            color;`;
        const [ rows ] = await this.db.execute(sql);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: ArticleColor[] = [];

        for (const row of rows as any) {
            items.push({
                colorId: +(row?.color_id),
                name: row?.name,
            });
        }

        return items;
    }

    private async getAllColorsByArticleId(articleId: number): Promise<ArticleColor[]> {
        const sql = 
        `SELECT
            article_colors.color_id,
            color.name 
        FROM 
            article_colors 
        INNER JOIN color ON color.color_id = article_colors.color_id 
        WHERE 
        article_colors.article_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ articleId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: ArticleColor[] = [];

        for (const row of rows as any) {
            items.push({
                colorId: +(row?.color_id),
                name: row?.name,
            });
        }

        return items;
    }

    private async getAllMaterialsByArticleId(articleId: number): Promise<Material[]> {
        const sql = 
        `SELECT 
            article_material.material_id,
            material.name
             
        FROM 
        article_material 
        INNER JOIN material ON material.material_id = article_material.material_id
        WHERE 
        article_material.article_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ articleId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: Material[] = [];

        for (const row of rows as any) {
            items.push({
                materialId: +(row?.material_id),
                name: row?.name,
            });
        }

        return items;
    }

    private async getAllSizesByArticleId(articleId: number): Promise<ArticleSize[]> {
        const sql = 
        `SELECT 
            article_sizes.size_id,
            size.name
             
        FROM 
            article_sizes 
        INNER JOIN size ON size.size_id = article_sizes.size_id
        WHERE 
        article_sizes.article_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ articleId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: ArticleSize[] = [];

        for (const row of rows as any) {
            items.push({
                sizeId: +(row?.size_id),
                name: row?.name,
            });
        }

        return items;
    }

    private async getAllColorSizesByArticleId(articleId: number): Promise<ColorSize[]> {
        const sql = 
        `SELECT
            color.name as color_name,
            color_sizes.color_id as color_id,
            color_sizes.size_id as size_id,
            color_sizes.quantity as quantity,
            size.name as size_name
            
        FROM 
            color
        INNER JOIN color_sizes ON color_sizes.color_id = color.color_id 
        INNER JOIN size ON size.size_id = color_sizes.size_id 
        WHERE 
        color_sizes.article_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ articleId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: ColorSize[] = [];

        for (const row of rows as any) {
            items.push({
                colorName: row?.color_name,
                colorId: +(row?.color_id),
                sizeId: +(row?.size_id),
                sizeName: row?.size_name,
                quantity: +(row?.quantity),
                
            });
        }

        return items;
    }

    private async getAllPricesByArticleId(articleId: number): Promise<ArticlePrice[]> {
        const sql = `
            SELECT
                article_price_id,
                created_at,
                price
            FROM
                article_price
            WHERE
                article_id = ?
            ORDER BY
                created_at ASC;`;
        const [ rows ] = await this.db.execute(sql, [ articleId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        return rows.map(row => {
            return {
                priceId: +(row?.article_price_id),
                createdAt: new Date(row?.created_at),
                price: +(row?.price),
            }
        });

    }

    private async getAllPhotosByArticleId(articleId: number): Promise<ArticlePhoto[]> {
        const sql = `SELECT photo_id, image_path FROM photo WHERE article_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ articleId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        return rows.map(row => {
            return {
                photoId: +(row?.photo_id),
                imagePath: row?.image_path,
            }
        });
    }

    private async getLatestPriceByArticleId(articleId: number): Promise<number> {
        const sql = `SELECT price FROM article_price WHERE article_id = ? ORDER BY created_at DESC LIMIT 1;`;
        const [ rows ] = await this.db.execute(sql, [ articleId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return 0;
        }

        const data: any = rows[0];

        return +(data?.price);
    }

    public async getById(
        articleId: number,
        options: Partial<ArticleModelAdapterOptions> = {},
    ): Promise<ArticleModel|IErrorResponse|null> {
        return this.getByIdFromTable(
            "article",
            articleId,
            options,
        );
    }

    public async add(
        data: IAddArticle,
        uploadedPhotos: IUploadedPhoto[],
    ): Promise<ArticleModel|IErrorResponse> {
        return new Promise<ArticleModel|IErrorResponse>(resolve => {
            this.db.beginTransaction()
            .then(() => {
                this.db.execute(
                    `
                    INSERT article
                    SET
                        title       = ?,
                        description = ?,
                        is_active   = ?,
                        is_promoted = ?,
                        category_id = ?;
                    `,
                    [
                        data.title,
                        data.description,
                        data.isActive ? 1 : 0,
                        data.isPromoted ? 1 : 0,
                        data.categoryId,
                    ]
                )
                .then(async (res: any) => {
                    const newArticleId: number = +(res[0]?.insertId);

                    const promises = [];

                    promises.push(
                        this.db.execute(
                            `INSERT article_price SET price = ?, article_id = ?;`,
                            [ data.price, newArticleId, ]
                        ),
                    );

                    for( const colorSize of data.colorSizes ){
                        promises.push(
                            this.db.execute(
                                `INSERT color_sizes
                                 SET article_id = ?, color_id = ?, size_id = ?, quantity = ?;`,
                                [ newArticleId, colorSize.colorId, colorSize.sizeId, colorSize.quantity ]
                            ),
                        ); 
                    }

                    for( const material of data.material ){
                        promises.push(
                            this.db.execute(
                                `INSERT article_material
                                 SET article_id = ?, material_id = ?;`,
                                [ newArticleId, material.materialId, ]
                            ),
                        ); 
                    }
                    
                         
                    for (const uploadedPhoto of uploadedPhotos) {
                        promises.push(
                            this.db.execute(
                                `INSERT photo SET article_id = ?, image_path = ?;`,
                                [ newArticleId, uploadedPhoto.imagePath, ]
                            ),
                        );
                    }

                    Promise.all(promises)
                    .then(async () => {
                        await this.db.commit();

                        resolve(await this.services.articleService.getById(
                            newArticleId,
                            {
                                loadCategory: true,
                                loadPhotos: true,
                                loadMaterial: true,
                                loadColors: true,
                                loadSizes: true,
                                loadColorSizes: true
                                
                            }
                        ));
                    })
                    .catch(async error => {
                        await this.db.rollback();
    
                        resolve({
                            errorCode: error?.errno,
                            errorMessage: error?.sqlMessage
                        });
                    });
                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
            });
        });
    }

    private editArticle(articleId: number, data: IEditArticle) {
        return this.db.execute(
            `UPDATE
                article
            SET
                title       = ?,
                description = ?,
                is_active   = ?,
                is_promoted = ?,
                category_id = ?
            WHERE
                article_id = ?;`,
                [
                    data.title,
                    data.description,
                    data.isActive ? 1 : 0,
                    data.isPromoted ? 1 : 0,
                    data.categoryId,
                    articleId,
                ]
        );
    }

    private addArticlePrice (articleId: number, newPrice: number) {
        return this.db.execute(
            `INSERT
                article_price
            SET
                article_id = ?,
                price = ?;`,
                [articleId, newPrice],
        );
    }
    

    private insertOrUpdateQuantity(articleId: number, cs: ColorSize) {
        return this.db.execute(
            `UPDATE
                color_sizes
            SET
                quantity = ?
            WHERE
                article_id = ?;`,
                [ cs.quantity, articleId ],
        );
    }

    public async edit(articleId: number, data: IEditArticle): Promise<ArticleModel|null|IErrorResponse> {
        return new Promise<ArticleModel|null|IErrorResponse>(async resolve => {
            const currentArticle = await this.getById(articleId, {
                loadColorSizes: true,
            });

            if(currentArticle === null) {
                return resolve(null);
            }

            const rollBackAndResolve = async (error) => {
                await this.db.rollback();
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });
            }
            this.db.beginTransaction()
                .then(() => {
                    this.editArticle(articleId, data)
                    .catch(error => {
                        rollBackAndResolve({
                            errno: error?.errno,
                            sqlMessage: "Part article: "+ error?.sqlMessage,
                        });
                    });
                })
            .then(async() => {
                const currentPrice = (currentArticle as ArticleModel).currentPrice.toFixed(2);
                const newPrice = data.price.toFixed(2);

                if(currentPrice !== newPrice){
                    this.addArticlePrice(articleId, data.price)
                    .catch(error => {
                        rollBackAndResolve({
                            errno: error?.errno,
                            sqlMessage: "Part price: " + error?.sqlMessage,
                        });
                    })
                }
            })
            .then(async () => {
                for(const cs of data.colorSizes) {
                    this.insertOrUpdateQuantity(articleId, cs)
                    .catch(error => {
                        rollBackAndResolve({
                            errno: error?.errno,
                            sqlMessage: `Part add/edit color and size ID(${cs.colorId}, ${cs.sizeId}): ${error.sqlMessage}`,
                        });
                    });
                }
            })
            .then(async () => {
                this.db.commit()
                .catch(error => {
                    rollBackAndResolve({
                        errno: error?.errno,
                        sqlMessage: `Part save changes: ${error.sqlMessage}`,
                    });
                });
            })
            .then(async() => {
                resolve(await this.getById(articleId, {
                    loadCategory: true,
                    loadPrices: true,
                    loadPhotos: true,
                    loadColors: true,
                    loadSizes: true,
                    loadColorSizes: true,
                    loadMaterial: true
                }));
            })
            .catch(async error => {
                await this.db.rollback();

                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });
            });

        });
    }

    public async deleteArticlePrices(articleId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM article_price WHERE article_id = ?;`,
                [articleId]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false))
        });
    }
    
    private async deleteArticleColors(articleId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM article_colors WHERE article_id = ?;`,
                [articleId]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false))
        });
    }

    private async deleteArticleSizes(articleId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM article_sizes WHERE article_id = ?;`,
                [articleId]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false))
        });
    }

    private async deleteArticleColorSizes(articleId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM color_sizes WHERE article_id = ?;`,
                [articleId]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false))
        });
    }

    private async deleteArticlePhotoRecords(articleId: number): Promise<string[]> {
        return new Promise<string[]>(async resolve => {
            const [rows] = await this.db.execute(
                `SELECT image_path FROM photo WHERE article_id = ?;`,
                [articleId]
            );

            if(!Array.isArray(rows) || rows.length === 0) return resolve([]);

            const filesToDelete = rows.map( row => row?.image_path);

            this.db.execute(
                `DELETE FROM photo WHERE article_id = ?;`,
                [articleId]
            )
            .then(() => resolve(filesToDelete))
            .catch(() => resolve([]))

            resolve(filesToDelete);
        });
    }

    private async deleteArticleRecord(articleId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM article WHERE article_id = ?;`,
                [articleId]

            )
            .then(() => resolve(true))
            .catch(() => resolve(false))
        });
    }

    private deleteArticlePhotosAndResizedVersion(filesToDelete: string[]) {
        try {

            for(const filetoDelete of filesToDelete) {
                fs.unlinkSync(filetoDelete);
            

            const pathParts = path.parse(filetoDelete);


            const directory = pathParts.dir;
            const fileName = pathParts.name;
            const extension = pathParts.ext;

        for (const resizeSpecification of Config.fileUpload.photos.resizes) {
            const resizedImagePath = directory + "/" + 
                                    fileName + 
                                    resizeSpecification.sufix +
                                    extension;

            fs.unlinkSync(resizedImagePath);
        }
    }

    } catch (e) {}
}
    
    public async delete(articleId: number): Promise<IErrorResponse|null> {
        return new Promise<IErrorResponse>(async resolve => {
            const currentArticle = await this.getById(articleId, {
                loadPhotos: true,
                loadPrices: true,
                loadColors: true,
                loadColorSizes: true,
                loadSizes: true,
                loadMaterial: true
            });

            if(currentArticle === null) {
                return resolve(null);
            }

            this.db.beginTransaction()
                .then(async () => {
                    if(await this.deleteArticlePrices(articleId)) return;
                    throw { errno: -1002, sqlMessage: "Could not delete article prices.", };
                })
                .then(async () => {
                    if(await this.deleteArticleColors(articleId)) return;
                    throw { errno: -1003, sqlMessage: "Could not delete article colors.", };
                })
                .then(async () => {
                    if(await this.deleteArticleSizes(articleId)) return;
                    throw { errno: -1003, sqlMessage: "Could not delete article sizes.", };
                })
                .then(async () => {
                    if(await this.deleteArticleColorSizes(articleId)) return;
                    throw { errno: -1003, sqlMessage: "Could not delete color sizes.", };
                })
                .then(async () => {
                    const filesToDelete = await await this.deleteArticlePhotoRecords(articleId);
                    if(filesToDelete.length !== 0) return filesToDelete;
                    throw { errno: -1005, sqlMessage: "Could not delete article photo records.", };
                })
                .then(async (filesToDelete) => {
                    if(await this.deleteArticleRecord(articleId)) return filesToDelete;
                    throw { errno: -1006, sqlMessage: "Could not delete the article records.", };
                })
                .then(async (filesToDelete) => {
                    await this.db.commit();
                    return filesToDelete;
                })
                .then((filesToDelete) => {
                    this.deleteArticlePhotosAndResizedVersion(filesToDelete);
                })
                .then(() => {
                    resolve({
                        errorCode: 0,
                        errorMessage: "Article deleted!",
                    });
                })
                .catch(async error => {
                    await this.db.rollback();
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async deleteArticlePhoto(articleId: number, photoId: number): Promise<IErrorResponse|null> {
        return new Promise<IErrorResponse|null>(async resolve => {
            const article = await this.getById(articleId, {
                loadPhotos: true,
            });

            if(article === null) {
                return resolve(null);
            }
            const filteredPhotos = (article as ArticleModel).photos.filter(p => p.photoId === photoId);

            if(filteredPhotos.length === 0){
                return resolve(null);
            }

            const photo = filteredPhotos[0];

            this.db.execute(
                `DELETE FROM photo WHERE photo_id = ?;`,
                [photo.photoId]
            )
            .then(() => {
                this.deleteArticlePhotosAndResizedVersion([
                    photo.imagePath
                ]);

                resolve({
                    errorCode: 0,
                    errorMessage: "Photo Deleted",
                });
            })
            .catch(error => resolve({
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
            }))
        });
    }

    public async addArticlePhotos(articleId: number, uploadedPhotos: IUploadedPhoto[]): Promise<ArticleModel|IErrorResponse|null> {
        return new Promise<ArticleModel|IErrorResponse|null>(async resolve => {
            const article = await this.getById(articleId, {
                loadPhotos: true,
            });

            if(article === null) {
                return resolve(null);
            }

            this.db.beginTransaction()
                .then(() => {
                    const promises = [];

                    for(const uploadedPhoto of uploadedPhotos) {
                        promises.push(
                            this.db.execute(
                                `INSERT photo SET article_id = ?, image_path = ?;`,
                                [articleId, uploadedPhoto.imagePath,]
                            ),
                        );
                    }
                    Promise.all(promises)
                        .then(async () => {
                            await this.db.commit();

                            resolve(await this.services.articleService.getById(
                                articleId,
                                {
                                    loadCategory: true,
                                    loadPhotos: true,
                                    loadColors: true,
                                    loadSizes: true,
                                    loadColorSizes: true,
                                    loadMaterial: true
                                }
                            ));
                        })
                        .catch(async error => {
                            await this.db.rollback();

                            resolve({
                                errorCode: error?.errno,
                                errorMessage: error?.sqlMessage
                            });
                        });
                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        })
    }

    public async getAllByCategoryId(categoryId: number): Promise<ArticleModel[]> {
        return await this.getAllByFieldNameFromTable<ArticleModelAdapterOptions>("article", "category_id", categoryId, {
            loadPhotos: true,
        }) as ArticleModel[];
    }

   /* public async getAllArticlesBySizeId(sizeId: number): Promise<ArticleModel[]> {
        return await this.getAllBySizeId<ArticleModelAdapterOptions>( sizeId, {
            loadPhotos: true,
        }) as ArticleModel[];
    }  */

   
}

export default ArticleService;
