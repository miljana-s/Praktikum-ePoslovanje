import * as mysql2 from "mysql2/promise";
import IServices from './Iservices.interface';

export default interface IApplicationResources {
    databaseConnection: mysql2.Connection;
    services?: IServices;
}