import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "./server.js";
import { users, InitialUsers } from "./data.js";

beforeEach(() => {
    users.splice(0, users.length, ...InitialUsers);
});

describe("POST /users", () => {
    it("geçerli kullanıcı oluşturduğunda 201 dönmeli", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                name: "Ayşe",
                email: "ayse@example.com",
                age: 22
            });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe("Ayşe");
        expect(response.body.email).toBe("ayse@example.com");
        expect(response.body.age).toBe(22);
        expect(response.body.id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        );
    });
    it("geçersiz e-posta gönderildiğinde 400 dönmeli", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                name: "Ayşe",
                email: "gecersiz-email",
                age: 22
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Geçersiz kullanıcı bilgileri."
        );
    });
});

describe("GET /users/:id", () => {
    it("olmayan kullanıcı için 404 dönmeli", async () => {
        const response = await request(app)
            .get("/users/olmayan-kullanici-id");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe(
            "Kullanıcı bulunamadı."
        );
    });
});

describe("GET /users", () => {
    it("oluşturulan kullanıcıyı listede göstermeli", async () => {
        // arrange
        await request(app).post("/users").send({ 
            name: "Ayşe",
            email: "ayse@example.com",
            age: 22
        });
        // act
        const response = await request(app).get("/users");
        // assert
        expect(response.status).toBe(200);
        expect(
            response.body.some(
                (user: { email: string }) =>
                    user.email === "ayse@example.com"
            )
        ).toBe(true);
    });
});

