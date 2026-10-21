import express, {Request, Response, NextFunction} from "express";
import { AppError } from "./errors.js";
import userRouter from "./user.routes.js"; 

import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import client from "prom-client";

const app = express(); // express uygulaması oluşturuluyor.

const register = new client.Registry(); // prometheus client için register oluşturuluyor. Bu register, metric'leri toplamak ve expose etmek için kullanılır.
client.collectDefaultMetrics({ register }); // Prometheus'un varsayılan metriklerini toplamak için kullanılır. Bu metrikler, CPU kullanımı, bellek kullanımı, ağ trafiği gibi sistemle ilgili bilgileri içerir.

const httpRequestsTotal = new client.Counter({ // http_requests_total adında bir counter metric oluşturuluyor. Bu metric, toplam HTTP istek sayısını saymak için kullanılır.
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
    registers: [register],
});
const httpRequestDuration = new client.Histogram({ // http_request_duration adında bir histogram metric oluşturuluyor. Bu metric, HTTP isteklerinin süresini ölçmek için kullanılır.
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [register],
});


app.use(helmet()); // helmet middleware ekleniyor. Bu middleware, HTTP başlıklarını güvenlik için ayarlamak için kullanılır. Örneğin, XSS saldırılarına karşı koruma sağlar, içerik güvenlik politikalarını uygular ve diğer güvenlik önlemlerini alır.

app.use(express.json()); // http request body'yi json formatında parse etmek için middleware ekleniyor.

app.use(cors({
    origin: "http://localhost:5173",
})); // CORS middleware ekleniyor. Bu middleware, farklı kaynaklardan gelen HTTP isteklerini kontrol etmek için kullanılır. Burada, sadece "http://localhost:5173" adresinden gelen isteklere izin veriliyor.

app.use((req: Request, res: Response, next: NextFunction) => { //log
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const durationSeconds =
            Number(process.hrtime.bigint() - start) / 1e9;

        const route = req.route?.path
            ? `${req.baseUrl}${req.route.path}`
            : req.path === "/metrics" || req.path === "/health"
                ? req.path
                : "unmatched";

        const labels = {
            method: req.method,
            route,
            status_code: String(res.statusCode),
        };

        httpRequestsTotal.inc(labels);
        httpRequestDuration.observe(labels, durationSeconds);

        console.info({
            ...labels,
            durationMs: durationSeconds * 1000,
        });
    });

    next();
});

const limiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, // 15 dakika
    limit: 5, // 5 istek
    standardHeaders: "draft-8", // limit aşıldığında dönecek standart header
    legacyHeaders: false, // limit aşıldığında dönecek legacy header
});
app.use("/users", limiter); // rate limit middleware ekleniyor. Bu middleware, belirli bir süre içinde belirli sayıda isteği sınırlamak için kullanılır. Burada, 15 dakika içinde 5 istekten fazla gönderildiğinde, kullanıcıya "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin." mesajı dönecek.

app.get("/metrics", async (req, res) => { // Prometheus metrics endpoint'i. Bu endpoint, Prometheus'un uygulamanın performansını ve durumunu izlemesi için kullanılır. Burada, Prometheus'un anlayabileceği formatta metric'ler döndürülür.
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
}); 
app.get("/health", (req, res) => { // health check endpoint'i. Bu endpoint, uygulamanın çalışıp çalışmadığını kontrol etmek için kullanılır.
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});
app.use("/users", userRouter); 

app.use((err: Error, req: Request, res: Response, next: NextFunction) => { // error handling middleware
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            statusCode: err.statusCode,
            code: err.code
        });
    }    
    console.error(err); // console.error(err) ile hatayı logluyoruz.

    res.status(500).json({
        message: "Sunucu hatası"
    });  
  }  

);
export default app; // app değişkenini dışa aktarıyoruz. Bu sayede diğer dosyalarda import edebiliriz.