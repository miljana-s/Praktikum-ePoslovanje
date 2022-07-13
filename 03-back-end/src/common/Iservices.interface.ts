
import AdministratorService from '../components/administrator/service';
import ArticleService from '../components/article/service';
import CategoryService from '../components/category/service';
export default interface IServices {
    categoryService: CategoryService;
    articleService: ArticleService;
    administratorService: AdministratorService;
}