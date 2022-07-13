import ArticleModel, { ArticleColor, ArticlePrice, ArticleSize, Material } from '../../../03-back-end/src/components/article/model';
import api, { apiAsForm } from '../api/api';
import EventRegister from '../api/EventRegister';
import * as path from 'path-browserify';

type ColorSizesType = {
    colorId: number;
    colorName: string;
    sizeId: number;
    sizeName: string;
    quantity: number;
}

export interface IAddArticle {
    title: string;
    description: string;
    isPromoted: 0 | 1;
    categoryId: number;
    price: number;

    material: Map<number, string>;
    colors: Map<number, string>;
    sizes: Map<number, string>;
    colorSizes: ColorSizesType;

    images: File[];
}


export default class ArticleService {
    public static getArticleById(articleId: number): Promise<ArticleModel|null> {
        return new Promise<ArticleModel|null>(resolve => {
            api("get", "/article/" + articleId, 'visitor')
            .then(res => {
                 if (res?.status !== "ok") {
                    return resolve(null);
                } 
                resolve(res.data as ArticleModel);
            });
        });
    }

    public static getArticlesByCategoryId(categoryId: number): Promise<ArticleModel[]> {
        return new Promise<ArticleModel[]>(resolve => {
            api("get", "/category/" + categoryId + "/article")
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve([]);
                } 
                resolve(res.data as ArticleModel[]);
            });
        });
    }

    public static addArticle(data: IAddArticle): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            const colors: {
                colorId: number;
                name: string;
            }[] = [];

            data.colors.forEach((value, key) => {
                colors.push({
                    colorId: key,
                    name: value
                });
            });

            const sizes: {
                sizeId: number;
                name: string;
            }[] = [];

            data.sizes.forEach((value, key) => {
                sizes.push({
                    sizeId: key,
                    name: value
                });
            });

            const material: {
                materialId: number;
                name: string;
            }[] = [];

            data.material.forEach((value, key) => {
                material.push({
                    materialId: key,
                    name: value
                });
            });


            const colorSizes: {
                colorId: number;
                colorName: string;
                sizeId: number;
                sizeName: string;
                quantity: number;
            }[] = [];


            const formData = new FormData();

            formData.append("data", JSON.stringify({
                title: data.title,
                description: data.description,
                isActive: true,
                isPromoted: data.isPromoted === 1,
                price: data.price,
                categoryId: data.categoryId,
                material: material,
                colors: colors,
                sizes: sizes,
                colorSizes: colorSizes
            }));
            for(let image of data.images) {
                formData.append("image", image);
            }
            apiAsForm("post", "/article", "administrator", formData)
            .then(res => {
                if(res?.status !== "ok") {
                    if(res.status === "login") EventRegister.emit("AUTH_EVENT", "force_login");

                    return resolve(false);
                }
                resolve(true);
            });
        });
    }

    public static getThumbPath(url: string): string {
        const directory = path.dirname(url);
        const extension = path.extname(url);
        const filename  = path.basename(url, extension);
        return directory + "/" + filename + "-thumb" + extension;
    }

    public static getSmallPath(url: string): string {
        const directory = path.dirname(url);
        const extension = path.extname(url);
        const filename  = path.basename(url, extension);
        return directory + "/" + filename + "-small" + extension;
    }

    public static getPriceBefore(article: ArticleModel, date: string): number {
        const prices: ArticlePrice[] =article.prices;

        if(prices === undefined) {
            return article.currentPrice;
        }
        if(prices.length === 0) {
            return article.currentPrice;
        }

        let p = prices[0].price;
 
        const orderData = new Date(date).getTime();

        for(let price of prices) {
            if(new Date(price.createdAt + "").getTime() <= orderData) {
                p = price.price;
            } else {
                break;
            }
        }
        return p;
    }

    public static getColors() {
        return new Promise<ArticleColor[]>(resolve => {
            api("get", "/color")
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve([]);
                } 
                resolve(res.data as ArticleColor[]);
            });
        });
    }

    public static getSizes() {
        return new Promise<ArticleSize[]>(resolve => {
            api("get", "/size")
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve([]);
                } 
                resolve(res.data as ArticleSize[]);
            });
        });
    }

    public static getMaterials() {
        return new Promise<Material[]>(resolve => {
            api("get", "/material")
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve([]);
                } 
                resolve(res.data as Material[]);
            });
        });
    }
}
