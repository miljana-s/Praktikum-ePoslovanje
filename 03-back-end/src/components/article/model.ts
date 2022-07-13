import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';

class Price implements IModel {
    priceId: number;
    price: number;
    createdAt: Date;
}

class Photo implements IModel {
   photoId: number;
   imagePath: string;
}

class ArticleColors implements IModel {
    colorId: number;
    name:string;
}

class ArticleSizes implements IModel{
    sizeId: number;
    name: string;
} 

class ColorSizes implements IModel{
    colorId: number;
    colorName: string;
    sizeId: number;
    sizeName: string;
    quantity: number;
} 

class Material implements IModel {
    materialId: number;
    name: string;
}

class ArticleModel implements IModel {
    articleId: number;
    createdAt: Date;
    title: string;
    description: string;
    isActive: boolean;
    isPromoted: boolean;
    categoryId: number;
    category?: CategoryModel;
    currentPrice: number;
    material: Material[] = [];
    prices: Price[] = [];
    photos: Photo[] = [];
    colors: ArticleColors[] = [];
    sizes: ArticleSizes[] = [];
    colorSizes: ColorSizes[] = [];
}

export default ArticleModel;
export { Price as ArticlePrice };
export { Photo as ArticlePhoto };
export { ArticleColors as ArticleColor };
export { ArticleSizes as ArticleSize };
export { ColorSizes as ColorSize }
export { Material as Material }



