import mysql from "mysql";
import util from "util";

class Database {
  private connection: mysql.Connection;
  private query: (arg1: string | mysql.QueryOptions) => Promise<unknown>;

  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST || "",
      user: process.env.DB_USER || "",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "",
    });

    this.connection.connect();
    this.query = util.promisify(this.connection.query).bind(this.connection);
  }

  close = () => {
    this.connection.end();
  };

  getConnection = () => {
    return this.connection;
  };

  executeQuery = async (query: string): Promise<any[]> => {
    const rows = await this.query(query);
    return rows as unknown[];
  };
}

export default Database;
