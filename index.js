const express = require("express");
const cors = require ("cors");
const bodyParser = require ("body-parser");
const { v4: uuid } = require('uuid');
var fakeTodos = [{
    id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
    text: 'Welcome',
    isCompleted: false,
    createdAt: new Date(),
}, {
    id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
    text: 'Reading 10 pages of react',
    isCompleted: false,
    createdAt: new Date(Date.now() - 86400000 * 7),
}, {
    id: '2e538cc5-b734-4771-a109-dfcd204bb38b',
    text: 'Fun time',
    isCompleted: true,
    createdAt: new Date(Date.now() - 86400000 * 14),
}];

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/todos', (req, res) => {
    res.status(200).json(fakeTodos);
});

app.get('/todos-delay', (req, res) => {
    setTimeout(() => res.status(200).json(fakeTodos), 2000);
});

app.post('/todos', (req, res) => {
    const { text } = req.body;
    if (text) {
        const insertedTodo = {
            id: uuid(),
            createdAt: Date.now(),
            isCompleted: false,
            text,
        }
        fakeTodos.push(insertedTodo);
        res.status(200).json(insertedTodo);
    } else {
        res.status(400).json({ message: 'Request body should have a text property' });
    }
});

app.post('/todos/:id/completed', (req, res) => {
    const { id } = req.params;
    const matchingTodo = fakeTodos.find(todo => todo.id === id);
    const updatedTodo = {
        ...matchingTodo,
        isCompleted: true,
    }
    if (updatedTodo) {
        fakeTodos = fakeTodos.map(todo =>
            todo.id === id
                ? updatedTodo
                : todo);
        res.status(200).json(updatedTodo);
    } else {
        res.status(400).json({ message: 'There is no todo with that id' });
    }
})

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const removedTodo = fakeTodos.find(todo => todo.id === id);
    fakeTodos = fakeTodos.filter(todo => todo.id !== id);
    res.status(200).json(removedTodo);
});

app.listen(8080, () => console.log("Server listening on port 8080"));
