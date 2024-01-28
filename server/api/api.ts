import { Request, Response, Express } from 'express';
import { Database } from '../database/database';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'

process.env.TOKEN_SECRET;

dotenv.config();

export class API {
  // Properties
  app: Express
  database: Database

  // Constructor
  constructor(app: Express) {
    this.app = app
    this.database = new Database();
    this.app.post('/register', this.register);
    this.app.post('/login', this.checkUser);
  }

  private register = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { username, password, email } = req.body;

      await this.database.executeSQL(
        `INSERT INTO users (username, password, email, role) VALUES ("${username}", "${password}", "${email}", "User")`
      );

    });
  }

  private checkUser = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const {  username, password } = req.body;
  
      console.log('Benutzerüberprüfung für:', username);
  
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
