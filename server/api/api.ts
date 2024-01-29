import { Request, Response, Express } from 'express';
import { Database } from '../database/database';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

export class API {
    app: Express;
    database: Database;

    constructor(app: Express) {
        this.app = app;
        this.database = new Database();
        this.app.post('/register', this.register);
        this.app.post('/login', this.login);


        this.app.post('/createPost', this.createPost);
        this.app.put('/editPost', this.editPost);    
        this.app.delete('/deletePost', this.deletePost);
    }

    private register = (req: Request, res: Response) => {
        bodyParser.json()(req, res, async () => {
            const { username, password, email } = req.body;
            await this.database.executeSQL(
                `INSERT INTO users (username, password, email, role) VALUES ("${username}", "${password}", "${email}", "User")`
            );
        });
    };

    private login = (req: Request, res: Response) => {
        bodyParser.json()(req, res, async () => {
            const { username, password } = req.body;
            console.log('Benutzerüberprüfung für:', username);
            const userExists = await this.database.executeSQL(
                `SELECT * FROM users WHERE username = "${username}" AND password = "${password}"`
            );
            if (userExists.length > 0) {
                const token = jwt.sign({ username: username }, process.env.TOKEN_SECRET || '', { expiresIn: '30m' });
                console.log(token);
                res.status(200).json({ token: token });
            } else {
                res.status(404).send('Benutzer nicht gefunden');
            }
        });
    };

    private createPost = (req: Request, res: Response) => {
      bodyParser.json()(req, res, async () => {
          const { postMessage, jwtToken } = req.body;
          // Extract username from JWT
          const username = jwt.verify(jwtToken, process.env.TOKEN_SECRET || '');
          // Insert post into database
          await this.database.executeSQL(
              `INSERT INTO posts (username, content) VALUES ("${username}", "${postMessage}")`
          );
          res.status(200).send('Post erfolgreich erstellt');
      });
  };

  // Method to edit a post
  private editPost = (req: Request, res: Response) => {
      bodyParser.json()(req, res, async () => {
          const { postId, newContent, jwtToken } = req.body;
          // Extract username from JWT and check permission
          const username = jwt.verify(jwtToken, process.env.TOKEN_SECRET || '');
          // Update post in database
          await this.database.executeSQL(
              `UPDATE posts SET content = "${newContent}" WHERE id = ${postId} AND username = "${username}"`
          );
          res.status(200).send('Beitrag erfolgreich bearbeitet');
      });
  };

  // Method to delete a post
  private deletePost = (req: Request, res: Response) => {
      bodyParser.json()(req, res, async () => {
          const { postId, jwtToken } = req.body;
          // Extract username from JWT and check permission
          const username = jwt.verify(jwtToken, process.env.TOKEN_SECRET || '');
          // Delete post from database
          await this.database.executeSQL(
              `DELETE FROM posts WHERE id = ${postId} AND username = "${username}"`
          );
          res.status(200).send('Beitrag erfolgreich gelöscht');
      });
  };


    
}