import { Container, Row, Col, Card } from 'react-bootstrap';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import { Link } from 'react-router-dom';
import ArticleModel from '../../../../03-back-end/src/components/article/model';
import CategoryModel from '../../../../03-back-end/src/components/category/model';
import { isRoleLoggedIn } from '../../api/api';
import EventRegister from '../../api/EventRegister';
import ArticleService from '../../service/ArticleService';
import CategoryService from '../../service/CategoryService';
import BasePage from '../BasePage/BasePage';
import * as path from "path-browserify";
import { AppConfiguration } from "../../config/app.config";

interface CategoryDashboardListState {
    categories: CategoryModel[];
    articles: ArticleModel[],
    isLoggedIn: boolean,
}

export default class CategoryListPage extends BasePage<{}> {
    state: CategoryDashboardListState;

    constructor(props: any) {
        super(props);

        this.state = {
            categories: [],
            articles: [],
            isLoggedIn: false,
        }
    }

     getThumbPath(url: string): string {
        const directory = path.dirname(url);
        const extension = path.extname(url);
        const filename  = path.basename(url, extension);
        return directory + "/" + filename + "-small" + extension;
    }

    componentDidMount() {
        isRoleLoggedIn("administrator")
        .then(loggedIn => {
            console.log(loggedIn, 'loggedIn');
            this.setState({ isLoggedIn: loggedIn});
            if (!loggedIn) return EventRegister.emit("AUTH_EVENT", "force_login");
        });
        this.loadCategories();
    }

    loadCategories() {
        CategoryService.getTopLevelCategories()
        .then(categories => {
            this.setState({
                categories: categories,
            });
        });
    }

    loadArticles(categoryId: number) {
        ArticleService.getArticlesByCategoryId(categoryId)
        .then((res) => this.setState({ articles: res }));
    }

    renderMain(): JSX.Element {       
        return (
            <Container>
                <Row>
                    <Col xs={4}>
                    <h1>Categories</h1>
                    {
                        this.state.isLoggedIn && (
                            <div>
                                <Link to="/dashboard/category/add" className="btn btn-sm btn-link">
                                    Add new category
                                </Link>
                            </div>
                        )
                    }
                    <div>
                        { this.renderCategoryGroup(this.state.categories) }
                    </div>
                    </Col>
                    {this.state.articles.length === 0 ? (
                        <Col xs={8}><h3>Nema artikla za prikazivanje</h3></Col>
                    ) : (
                        <Col xs={8}>
                            <Row>
                                {this.renderArticles()}
                            </Row>
                        </Col>
                    )}
                    
                </Row>
            </Container>
        );
    }

    private renderArticles() {
        return (
            <>
            {this.state.articles.map((article) => (
                <Col xs={4}>
                    <Card className="mb-3">
                        <Card.Img variant="top" src={this.getThumbPath(AppConfiguration.API_URL + "/" + article.photos[0]?.imagePath)} />
                        <Card.Body>
                        <Card.Title>
                            {article.title}
                        </Card.Title>
                        <Card.Text>
                            <b>{article.currentPrice} $</b>
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
            </>
        );
    }

    private renderCategoryGroup(categories: CategoryModel[]): JSX.Element {
        if (!Array.isArray(categories)) {
            return (
                <></>
            );
        }

        return (
            <ul>
                {
                    categories.map(category => (
                        <li  onClick={() => {
                            if(category.subcategories.length === 0) {
                                this.loadArticles(category.categoryId);
                            } 
                        }} key={ "category-list-item-" + category.categoryId }>
                            <b>{ category.name }</b> { this.renderCategoryOptions(category) }
                            { this.renderCategoryGroup(category.subcategories) }
                        </li>
                    ))
                }
            </ul>
        );
    }

    private renderCategoryOptions(category: CategoryModel): JSX.Element {
        return (
            <>
                {
                    this.state.isLoggedIn && (
                        <Link to={ "/dashboard/category/edit/" + category.categoryId }
                            className="btn btn-sm btn-link" title="Click here to edit this category">
                            Edit
                        </Link>
                    )
                }
            </>
        );
    }
}
