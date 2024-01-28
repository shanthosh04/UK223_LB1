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
    this.app.post('/tweet', this.createTweet);
    this.app.put('/tweet/:id', this.editTweet);
    this.app.delete('/tweet/:id', this.deleteTweet);
  }

  private createTweet = async (req: Request, res: Response) => {
    const { content, username } = req.body;
    try {
      await this.database.executeSQL(
        `INSERT INTO tweets (content, username) VALUES ("${content}", "${username}")`
      );
      res.status(200).send('Tweet erstellt');
    } catch (error) {
      res.status(500).send('Fehler beim Erstellen des Tweets');
    }
  }

  private editTweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
      await this.database.executeSQL(
        `UPDATE tweets SET content = "${content}" WHERE id = ${id}`
      );
      res.status(200).send('Tweet bearbeitet');
    } catch (error) {
      res.status(500).send('Fehler beim Bearbeiten des Tweets');
    }
  }

  private deleteTweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await this.database.executeSQL(
        `DELETE FROM tweets WHERE id = ${id}`
      );
      res.status(200).send('Tweet gelöscht');
    } catch (error) {
      res.status(500).send('Fehler beim Löschen des Tweets');
    }
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
  
      const userExists = await this.database.executeSQL(
        `SELECT * FROM users WHERE username = "${username}" AND password = "${password}"`
      );
  
      if (userExists.length > 0) {
        const token = jwt.sign({ username: username }, process.env.TOKEN_SECRET || '', { expiresIn: '30m' });
        console.log (token)
        res.status(200).json({ token: token });
      } else {
        res.status(404).send('Benutzer nicht gefunden');
      }
    });
  }
}
