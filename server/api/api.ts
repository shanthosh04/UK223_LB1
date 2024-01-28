import { Request, Response, Express } from 'express';
import { Database } from '../database';
import * as jwt from 'jsonwebtoken';
import bodyParser from 'body-parser'

process.env.TOKEN_SECRET;

export class API {
  // Properties
  app: Express
  database: Database

  // Constructor
  constructor(app: Express) {
    this.app = app
    this.database = new Database();
    this.app.post('/register', this.register);
    this.app.post('/login', this.login);
  }

  private register = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { username, password, email } = req.body;

      await this.database.executeSQL(
        `INSERT INTO users (username, password, email, role) VALUES ("${username}", "${password}", "${email}", "User")`
      );

    });
  }

  private login = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { password, username } = req.body;
  
      // Hier überprüfen Sie, ob der Benutzer in der Datenbank existiert
      const userExists = await this.database.executeSQL(
        `SELECT * FROM users WHERE username = "${username}" AND password = "${password}"`
      );
  
      if (userExists.length > 0) {
        const token = jwt.sign({ username: username }, process.env.TOKEN_SECRET || '', { expiresIn: '30m' });
        res.status(200).json({ token: token });
      } else {
        res.status(404).send('Benutzer nicht gefunden');
      }
    });
  }

}
