import { Fragment } from 'react';
import { ArticleColor, ArticleSize, ColorSize, Material } from '../../../../03-back-end/src/components/article/model';
import BasePage, { BasePageProperties } from '../BasePage/BasePage';
import * as path from 'path-browserify';
import { Col, Row, Card, Form, Button } from 'react-bootstrap';
import './ArticlePage.sass'
import ArticleService from '../../service/ArticleService';
import CategoryService from '../../service/CategoryService';
import CategoryModel from '../../../../03-back-end/src/components/category/model';

class ArticlePageProperties extends BasePageProperties {
    match?: {
        params: {
            aid: string;
        }
    }
}

class ArticlePageState {
    title: string;
    description: string;
    isActive: boolean;
    isPromoted: boolean;
    price: number;
    categories: CategoryModel[];
    category: string;
    colors: ArticleColor[];
    sizes: ArticleSize[];
    quantity: ColorSize[];
    material: string;
    materials: Material[];
}

export default class ArticlePage extends BasePage<ArticlePageProperties> {
    state: ArticlePageState;

    constructor(props: ArticlePageProperties) {
        super(props);

        this.state = {
            title: '',
            description: '',
            isActive: false,
            isPromoted: false,
            price: 0,
            categories: [],
            category: '',
            colors: [],
            sizes: [],
            quantity: [],
            material: '',
            materials: [],
        }
    }

    componentDidMount() {
        this.loadCategories();
        this.loadColors();
        this.loadSizes();
        this.loadMaterials();
    }

    getThumbPath(url: string): string {
        const directory = path.dirname(url);
        const extension = path.extname(url);
        const filename  = path.basename(url, extension);
        return directory + "/" + filename + "-thumb" + extension;
    }

    loadSizes() {
        ArticleService.getSizes().then(res => {
            this.setState({ sizes: res });
        });
    }

    loadColors() {
        ArticleService.getColors().then(res => this.setState({ colors: res }));
    }

    loadCategories() {
        CategoryService.getTopLevelCategories()
        .then(categories => {
            this.setState({
                categories: categories,
            });
        });
    }

    loadMaterials() {
        ArticleService.getMaterials().then(res => this.setState({ materials: res }));
    }

    onChangeInput(field: string): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                [field]: event.target.value,
            });
        }
    }

    onChangeSelect(field: string): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                [field]: event.target.value + "",
            });
        }
    }

    createSelectOptionGroup(category: CategoryModel, level: number = 0): JSX.Element {
        const levelPrefix = "» ".repeat(level);
        return(
            <Fragment key={"category-and-subcategory-fragment-" + category.categoryId}>
                <option key={"parent-category-option-" + category.categoryId} value={category.categoryId}>
                    {levelPrefix}{category.name}
                </option>
                {category.subcategories.map(subcategory => this.createSelectOptionGroup(subcategory, level +1))}
            </Fragment>
        );
    }

    createSelectOptionGroupMaterials(material: Material, level: number = 0): JSX.Element {
        return(
            <Fragment key={"category-and-subcategory-fragment-" + material.materialId}>
                <option key={"parent-category-option-" + material.materialId} value={material.materialId}>
                    {material.name}
                </option>
            </Fragment>
        );
    }

    handleAddButtonClick = () => {
        //nisam stigla da povezem dodavanje artikala sa back-endom
        
    }

    onPickSize = (e: React.ChangeEvent<HTMLInputElement>, index: number ) => {
        const temp = this.state.quantity;
        temp[index].sizeId = Number(e.target.value);
        this.setState({ quantity: temp });
    }

    onPickColor = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const temp = this.state.quantity;
        temp[index].colorId = Number(e.target.value);
        this.setState({ quantity: temp });
    }

    onChangeQuantity = (e:  React.ChangeEvent<HTMLInputElement>, index: number) => {
        const temp = this.state.quantity;
        temp[index].quantity = Number(e.target.value);
        this.setState({ quantity: temp });
    }

    renderMain(): JSX.Element {
        return (
            <Row>
                 <Col sm={12} md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                    <Card>
                        <Card.Title>
                                    <b>Add new article</b>
                        </Card.Title>
                        <Card.Text as="div">
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Title:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter the title"
                                            value={this.state.title}
                                            onChange={this.onChangeInput("title")}/>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Description:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter the description"
                                            value={this.state.description}
                                            onChange={this.onChangeInput("description")}/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                        <Form.Check onChange={(e: { target: { checked: any; }; }) => this.setState({ isActive: e.target.checked })} type="checkbox" label="Active article" />
                                        <Form.Check onChange={(e: { target: { checked: any; }; }) => this.setState({ isPromoted: e.target.checked })} type="checkbox" label="Promoted article" />
                                    </Form.Group>

                                    <Form.Group>
                                        <>
                                        <Form.Label>Price:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter the description"
                                            value={this.state.price}
                                            onChange={this.onChangeInput("price")}/>
                                        </>
                                        <>
                                        <Form.Label>Material:</Form.Label>
                                        <Form.Control as="select"
                                            value={ this.state.material }
                                            onChange={ this.onChangeSelect("material") }>
                                            <option value="">Pick material</option>
                                            { this.state.materials.map(mat => this.createSelectOptionGroupMaterials(mat)) }
                                        </Form.Control>
                                        </>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Parent category:</Form.Label>
                                        <Form.Control as="select"
                                            value={ this.state.category }
                                            onChange={ this.onChangeSelect("category") }>
                                            <option value="">Pick category</option>
                                            { this.state.categories.map(category => this.createSelectOptionGroup(category)) }
                                        </Form.Control>
                                    </Form.Group>

                                    {this.state.quantity.map((item, index) => {
                                        return (
                                            <Form.Group style={{ display: 'inline-flex'}}>
                                            <Form.Control as="select"
                                                // value={ this.state.selectedParent }
                                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => this.onPickSize(e, index) }>
                                                <option value="">Pick a size</option>
                                                { this.state.sizes.map(({ name, sizeId }) => (
                                                    <Fragment key={"size-" + sizeId}>
                                                    <option key={"option-size-" + sizeId} value={sizeId}>
                                                        {name}
                                                    </option>
                                                </Fragment>
                                                )) }
                                            </Form.Control>

                                            <Form.Control
                                                
                                                as="select"
                                                // value={ this.state.selectedParent }
                                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => this.onPickColor(e, index)  }>
                                                <option value="">Pick a color</option>
                                                { this.state.colors.map(({ name, colorId }) => (
                                                    <Fragment key={"coor-" + colorId}>
                                                    <option key={"option-color-" + colorId} value={colorId}>
                                                        {name}
                                                    </option>
                                                </Fragment>
                                                )) }
                                            </Form.Control>
                                            <Form.Control
                                                type="number"
                                                placeholder="quantity"
                                                // value={this.state.title}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChangeQuantity(e, index) }/>
                                        </Form.Group>
                                        )
                                    })}

                                    <Form.Group>
                                        <Button variant="primary" className="mt-3" onClick={() => {
                                            
                                            this.setState({ quantity: [ ...this.state.quantity, { }]});
                                        }}>
                                            Add quantity
                                        </Button>
                                    </Form.Group>

                                    <Form.Group>
                                        <Button variant="primary" className="mt-3"
                                                 onClick={() => this.handleAddButtonClick()}>
                                            Add new article
                                        </Button>
                                    </Form.Group>

                                </Form>
                            </Card.Text>
                        </Card>
                 </Col>
            </Row>
        );
    }
} 