import express, {Request, Response, NextFunction} from "express";
import { randomUUID } from "crypto";    
import { User } from "./types.js"; 
import { users } from "./data.js";
import { AppError } from "./errors.js";
import userRouter from "./user.routes.js";
import { createUserSchema, updateUserSchema } from "./user.schema.js";   

const app = express();

app.use(express.json());
app.use("/users", userRouter);

const PORT = 3000;

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }    
    console.error(err);

    res.status(500).json({
        message: "Sunucu hatası"
    });  
  }  
);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});