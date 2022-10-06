import express, { Response, Request, NextFunction } from 'express';
import logger from 'morgan';

const app = express();
app.use(express.json());
app.use(logger('dev'));

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello world!');
});

// (academia) activity
const academia: Map<string, Array<string>> = new Map([
    ['MIT', ['arvind', 'dnj']],
    ['ASU', ['chomsky']]
]);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json([...academia.keys()]);
});

// TODO: (academia) Add route with /schools parameter to fetch profs at school

// TODO: (academia) Add route to create new professor at a school

// TODO: (academia) Add middleware validating if institution/professor exists

// TODO: (dynamic-routing) Clean up routes with dynamic routing for modularity

// (sessions) activity
import session from 'express-session';

app.use(session({
  secret: '61040-rec5',
  resave: true,
  saveUninitialized: false
}));

declare module 'express-session' {
  export interface SessionData {
    userId: string;
  }
}

app.get('/', (req: Request, res: Response) => {
    res.status(200).send(`Hello ${req.session?.userId}!`);
});

// TODO: (sessions) Add route clearing a session

// TODO: (sessions) Add middleware to validate login/logout requests

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
