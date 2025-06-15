import { sql } from "../config/db.js";


export async function getTransactionById(req,res) {
        try {
            const { givenUserID } = req.params;
            // console.log("given user id :", givenUserID);
            const transaction = await sql `
            SELECT * FROM transactions WHERE user_id = ${givenUserID} ORDER BY created_at DESC
            `;
            res.status(200).json(transaction);
    
        } catch (error) {
            console.log("error in finding transaction ",error);
            res.status(500).json({message: "Internal server error "});
        }
}


export async function createTransaction(req,res) {
        try {
            const { title, user_id, category, amount } = req.body
    
            if  (!title || !user_id || !category || amount === undefined){
                return res.status(400).json({message: "All fields are required"});
            }
            // if no problem then will create a transaction
    
            const transaction = await sql`
                INSERT INTO transactions(user_id,title,category,amount)
                VALUES (${user_id},${title},${category},${amount})
                RETURNING * 
            `;
    
            // how transactions looks like
            console.log(transaction);
            res.status(201).json(transaction[0]);
    
        } catch (error) {
            console.log("error creating transaction ",error);
            res.status(500).json({message: "Internal server error "});
        }
}


export async function deleteTransaction(req,res) {
        try{
            const {givenId} = req.params;
            if(isNaN(parseInt(givenId))){
                return res.status(400).json({message:"Invalid id"});
            }
            const result = await sql `
            DELETE FROM transactions WHERE id = ${givenId} RETURNING *
            `;
    
            // if givenId not exist
            if(result.length === 0){
                return res.status(404).json({message:"No transaction with this id"});
            }
            // else
            res.status(200).json({message:"transaction deleted successfully"});
        }
        catch(error){
            console.log("error creating transaction ",error);
            res.status(500).json({message: "Internal server error "});
        }    
}

export async function summaryOfUser(req,res){
    try {
        const {givenId} = req.params;

        const balanceResult = await sql `
        SELECT COALESCE(SUM(amount),0) as balance FROM transactions where user_id = ${givenId}
        `;

        const incomeResult = await sql `
        SELECT COALESCE(SUM(amount),0) as income FROM transactions where user_id = ${givenId} AND amount > 0
        `;

        const expensesResult = await sql `
        SELECT COALESCE(SUM(amount),0) as expenses FROM transactions where user_id = ${givenId} AND amount < 0
        `;

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expensesResult[0].expenses,
        })

    } catch (error) {
        console.log("error creating transaction ",error);
        res.status(500).json({message: "Internal server error "});
    }
}