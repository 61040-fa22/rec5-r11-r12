
import express, { Response, Request, NextFunction } from 'express';
import session from 'express-session';

const app = express.Router();

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

// (sessions) activity
const users = new Map([
    ['bob', 'password']
]);

app.get('/', (req: Request, res: Response) => {
    res.status(200).send(`Hello ${req.session?.userId}!`);
});

// SOLN: (sessions) Add middleware to validate login/logout requests
const isUserLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId !== undefined) {
        res.status(403).send(`You are already logged in as ${req.session.userId}`);
        return;
    }
    next();
};
const isUserLoggedOut = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        res.status(403).send(`You are already logged out as ${req.session.userId}`);
        return;
    }
    next();
};
const isRightPassword = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId || '';
    if (users.get(userId) !== req.body.password) {
        res.status(403).send(`Wrong password`);
        return;
    }
    next();
};

app.post('/', [isUserLoggedIn, isRightPassword], (req: Request, res: Response) => {
    const userId = req.body.userId;
    console.log(req.body.password);
    req.session.userId = userId;
    res.status(200).send(`Logged in as ${userId}`);
});

// SOLN: (sessions) Add route clearing a session (logging out)
app.delete('/', [isUserLoggedOut], (req: Request, res: Response) => {
    const userId = req.body.userId;
    req.session.userId = undefined;
    res.status(200).send(`Logged out ${userId}, now user is ${req.session.userId}`);
});

module.exports = {
    prefix: '/sessions',
    router: app
};
