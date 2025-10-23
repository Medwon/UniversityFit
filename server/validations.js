import {body} from 'express-validator';

export const loginValidator = [
    body('email',"not an email").isEmail(),
    body('password', "password's length min 8").isLength({min:8}),
];
export const registerValidator = [
    body('email', "not an email").isEmail(),
    body('password', "password's length min 8").isLength({min:8}),
    body('fullName', "need a name").isLength({min:3}),
    body('avatarUrl', "wrong link").optional().isURL(),
];   
export const postCreateValidator = [
    body('title', "need a titile").isLength({min: 3}).isString(),
    body('text', "need a text").isLength({min:5}).isString(),
    body('tags', "wrong tags").optional().isArray(),
    body('imageUrl', "wrong link").optional().isString(),
];   