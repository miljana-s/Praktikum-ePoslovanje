import Ajv from "ajv";
import { ArticleColor, ArticleSize, ColorSize, Material} from "../model";

interface IAddArticle {
    title: string;
    description: string;
    isActive: boolean;
    isPromoted: boolean;
    price: number;
    categoryId: number;
    material: Material[];
    colors: ArticleColor[];
    sizes: ArticleSize[];
    colorSizes: ColorSize[];

}

interface IUploadedPhoto {
    imagePath: string;
}


const ajv = new Ajv();

const IAddArticleValidator = ajv.compile({
    type: "object",
    properties: {
        title: {
            type: "string",
            minLength: 2,
            maxLength: 128,
        },
        description: {
            type: "string",
            minLength: 2,
            maxLength: 64 * 1024,
        },
        isActive: {
            type: "boolean",
        },
        isPromoted: {
            type: "boolean",
        },
        price: {
            type: "number",
            minimum: 0.01,
            multipleOf: 0.01,
        },
        material: {
            type: "array",
            minItems: 0,
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    materialId: {
                        type: "number",
                        minimum: 1,
                    },
                },
                required: [
                    "materialId"
                ],
                additionalProperties: false,
            },
        },
        categoryId: {
            type: "integer",
            minimum: 1,
        },
        colors: {
            type: "array",
            minItems: 0,
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    colorId: {
                        type: "number",
                        minimum: 1,
                    },
                },
                required: [
                    "colorId"
                ],
                additionalProperties: false,
            },
        },
        sizes: {
            type: "array",
            minItems: 0,
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    sizeId: {
                        type: "number",
                        minimum: 1,
                    }
                },
                required: [
                    "sizeId",
                ],
                additionalProperties: false,
            },
        },
        colorSizes: {
            type: "array",
            minItems: 0,
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    colorId: {
                        type: "number",
                        minimum: 1,
                    },
                    sizeId: {
                        type: "number",
                        minimum: 1,
                    },
                    quantity: {
                        type: "number",
                        minimum: 1,
                    },

                },
                required: [
                    "colorId",
                    "sizeId",
                    "quantity"
                ],
                additionalProperties: false,
            },
        },
        
            
    },
    required: [
        "title",
        "description",
        "isActive",
        "isPromoted",
        "price",
        "categoryId",
        "material",
        "colors",
        "sizes",
        "colorSizes",
    ],
    additionalProperties: false,
});

export { IAddArticle };
export { IAddArticleValidator };
export { IUploadedPhoto };