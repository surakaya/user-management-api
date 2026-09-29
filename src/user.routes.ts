import e, { Router } from "express";
import { randomUUID } from "crypto";
import { AppError } from "./errors.js";
import { createUserSchema, updateUserSchema } from "./user.schema.js";
import { users } from "./data.js";
import { User } from "./types.js";
import userRouter from "./user.routes.js";

const router = Router();

router.post("/", (req, res) => {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
          message: "Geçersiz kullanıcı bilgileri.",
          errors: result.error.issues,
        });
      }
    const user: User = {
    id: randomUUID(),
    ...result.data,
    };

    users.push(user);
    res.status(201).json(user); // response cevabı. (201:http success), user objesini json formatında kaydet ve geri döndür.
});

router.get("/", (req, res) => {
    res.json(users); 
});


router.get("/:id", (req, res) => {
    const id = req.params.id;
  
    const user = users.find((user) => user.id === id);
  
    if (!user) {
        throw new AppError("Kullanıcı bulunamadı.", 404);
    }
  
    res.json(user);
  });

 router.patch("/:id", (req, res) => {
    const id = req.params.id;
    const user = users.find((user) => user.id ===id); 

    if (!user){
       throw new AppError("kullanici bulunamadi.", 404);
    }
    const result = updateUserSchema.safeParse(req.body);

    if (!result.success){
        return res.status(400).json({
            message: "Geçersiz kullanıcı bilgileri.",
            errors: result.error.issues,
        });
    }
    const updateUser = {
        ...user,
        ...result.data
    };
    const index = users.findIndex((user) => user.id === id);
    users[index] = updateUser;
    res.json(updateUser);

});

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    const index = users.findIndex((user) => user.id === id);
    if (index == -1){
        throw new AppError("Kullanıcı bulunamadı.", 404);
    }
    users.splice(index,1);
    res.status(204).send();
});

export default router;