import express, { Response, Request, NextFunction } from 'express';
import logger from 'morgan';

const app = express();
app.use(express.json());
app.use(logger('dev'));

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello world!');
});

// (dynamic routing) activity
import fs from 'fs';
import path from 'path';

// SOLN: (dynamic-routing) Clean up routes with dynamic routing
// (see routes/schools.ts and sessions.ts for additional solutions)
const routes = fs.readdirSync(path.join(__dirname, 'routes'), {
    withFileTypes: true
}).filter(dirent => dirent.isFile());
console.log(`Loaded ${routes.length} routes!`);
routes.forEach((dirent: fs.Dirent) => {
    const filename: string = dirent.name.split('.')[0];
    const { prefix, router } = require(`./routes/${filename}`);
    app.use(prefix, router);
});

// (sessions) activity
import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    userId: string;
  }
}

app.use(session({
  secret: '6170',
  resave: false,
  saveUninitialized: false
}));

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
