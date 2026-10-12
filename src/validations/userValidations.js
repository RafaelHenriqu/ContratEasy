const { body } = require('express-validator');

const registerValidation = [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha muito curta')
];

module.exports = { registerValidation };