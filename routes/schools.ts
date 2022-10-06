import express, { Response, Request, NextFunction } from 'express';

const app = express.Router();

// (academia) activity
const academia: Map<string, Array<string>> = new Map([
    ['MIT', ['arvind', 'dnj']],
    ['ASU', ['chomsky']]
]);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json([...academia.keys()]);
});

// SOLN: Add middleware validating if institution/professor exists
const doesSchoolExist = (req: Request, res: Response, next: NextFunction) => {
    const school = req.params.school;
    if (!academia.has(school)) {
        res.status(404).send(`School ${school} not found`);
        return;
    }
    next();
};

// SOLN: Add route with / parameter to fetch profs at school
app.get('/:school', [doesSchoolExist], (req: Request, res: Response) => {
    const school = req.params.school;
    res.status(200).json({school: school, professors: academia.get(school)});
});

// SOLN: Add route to create new professor at a school
app.post('/:school/professors', [doesSchoolExist], (req: Request, res: Response) => {
    const school = req.params.school;
    const professor = req.body.professor;
    academia.set(school, (academia.get(school) ?? []).concat([professor]));
    res.status(200).json({school: school, professors: academia.get(school)});
});

module.exports = {
    prefix: '/schools',
    router: app
};
