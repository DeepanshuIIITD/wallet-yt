import express from "express";
import { createTransaction, deleteTransaction, getTransactionById, summaryOfUser } from "../controllers/transactionsController.js";

const router = express.Router();


router.get('/:givenUserID',getTransactionById);

router.post('/',createTransaction);


router.delete('/:givenId',deleteTransaction);

router.get('/summary/:givenId', summaryOfUser);

export default router; 