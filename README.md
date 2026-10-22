# Backend Validation API

Express.js ve TypeScript kullanılarak geliştirilmiş, kullanıcı yönetimi için REST API sunan bir backend projesidir. Proje; veri doğrulama, merkezi hata yönetimi, otomatik testler, Docker ile container ortamında çalıştırma ve CI/CD süreçlerini uygulamalı olarak öğrenmek amacıyla geliştirilmiştir.

## Features

- RESTful API ile kullanıcı oluşturma, listeleme, görüntüleme, güncelleme ve silme (CRUD)
- UUID ile benzersiz kullanıcı kimlikleri oluşturma
- Zod ile istek verilerini doğrulama
- Merkezi hata yönetimi ve özel `AppError` sınıfı
- HTTP istekleri için logging
- Helmet ve CORS ile temel güvenlik yapılandırması
- Rate limiting ile istek sıklığını sınırlandırma
- `/health` endpoint'i ile uygulama durumunu kontrol etme
- Vitest ile otomatik testler
- Docker ile container oluşturma ve çalıştırma
- GitHub Actions ile otomatik test ve kod kontrolleri
- Render üzerinde deployment

## Tech Stack

| Teknoloji | Kullanım amacı |
|---|---|
| Node.js | JavaScript çalışma ortamı |
| Express.js | HTTP sunucusu ve API routing |
| TypeScript | Tip güvenliği ve daha kontrollü geliştirme |
| Zod | İstek verilerinin doğrulanması |
| Vitest | Otomatik testler |
| Docker | Uygulamayı container içinde çalıştırma |
| GitHub Actions | CI sürecini otomatikleştirme |
| Render | Uygulamayı yayınlama |

## Project Structure

```text
backend-validation/
├── src/
│   ├── index.ts
│   ├── user.routes.ts
│   ├── user.schema.ts
│   ├── errors.ts
│   ├── types.ts
│   └── data.ts
├── .github/
│   └── workflows/
├── Dockerfile
├── .dockerignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

`src/index.ts` uygulamayı başlatır ve middleware yapılandırmasını içerir. `user.routes.ts` kullanıcı endpoint'lerini, `user.schema.ts` doğrulama şemalarını, `errors.ts` özel hata sınıfını, `types.ts` TypeScript tiplerini ve `data.ts` bellek içi kullanıcı verilerini tanımlar.

## Getting Started

### Prerequisites

- Node.js
- npm
- Docker (container içinde çalıştırmak için)

### Installation

Depoyu bilgisayarına klonla ve proje dizinine gir:

```bash
git clone https://github.com/surakaya/user-management-api.git
cd backend-validation
npm install
```

### Run in Development

```bash
npm run dev
```

Geliştirme sunucusu `tsx watch` ile çalışır. Kaynak kodda yapılan değişiklikler geliştirme sürecinde otomatik olarak yeniden yüklenir.

Yerel API varsayılan olarak `http://localhost:3000` adresinde kullanılabilir.

## API Endpoints

### Health Check

| Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/health` | Uygulamanın durumunu kontrol eder. |

### User Management

| Method | Endpoint | Açıklama |
|---|---|---|
| POST | `/users` | Yeni kullanıcı oluşturur. |
| GET | `/users` | Kullanıcıları listeler. |
| GET | `/users/:id` | ID ile kullanıcı getirir. |
| PATCH | `/users/:id` | Kullanıcı bilgilerini kısmi olarak günceller. |
| DELETE | `/users/:id` | Kullanıcıyı siler. |

### Create User

**Request**

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "age": 25
}
```

Başarılı oluşturma işleminde API `201 Created` durum koduyla oluşturulan kullanıcıyı döndürür.

### Get Users

```http
GET /users
```

Kayıtlı kullanıcıları JSON formatında döndürür.

### Get User by ID

```http
GET /users/:id
```

Belirtilen UUID ile eşleşen kullanıcıyı getirir. Kullanıcı bulunamazsa `404 Not Found` yanıtı döndürülür.

### Update User

```http
PATCH /users/:id
Content-Type: application/json
```

```json
{
  "name": "Jane Smith"
}
```

Yalnızca gönderilen alanlar güncellenir. İstek verileri Zod şemasıyla doğrulanır.

### Delete User

```http
DELETE /users/:id
```

Başarılı silme işleminde API `204 No Content` durum kodunu döndürür.

## Validation and Error Handling

İstek gövdeleri Zod şemalarıyla doğrulanır. Geçersiz kullanıcı bilgileri için `400 Bad Request`, bulunamayan kullanıcılar için `404 Not Found` kullanılır.

`AppError` sınıfı, uygulamaya özgü hataların HTTP durum kodlarıyla ifade edilmesini sağlar. Merkezi hata yönetimi middleware'i hataları ortak bir noktadan ele alır. Beklenmeyen sunucu hataları `500 Internal Server Error` durum koduyla yanıtlanır.

## Testing

Proje, Vitest kullanılarak otomatik testlerle kontrol edilir.

Testleri çalıştırmak için:

```bash
npm test
```

TypeScript tip kontrolü için:

```bash
npm run typecheck
```

Production çıktısını oluşturmak için:

```bash
npm run build
```

Bu komutlar sırasıyla otomatik testleri çalıştırır, tip hatalarını kontrol eder ve TypeScript kodunu `dist` dizinine derler.

## Docker

Uygulamayı Docker image'ı olarak oluşturmak için proje kök dizininde:

```bash
docker build -t backend-validation-api .
```

Container'ı başlatmak için:

```bash
docker run -d \
  --name backend-validation-prod \
  -p 3000:3000 \
  backend-validation-api
```

Container durumunu kontrol etmek için:

```bash
docker ps
```

Uygulamanın health check endpoint'ini test etmek için:

```bash
curl http://localhost:3000/health
```

Container loglarını görüntülemek için:

```bash
docker logs backend-validation-prod
```

Container'ı durdurmak için:

```bash
docker stop backend-validation-prod
```

> Docker komutlarındaki port eşlemesi, Dockerfile ve uygulamanın dinlediği port ile uyumlu olmalıdır.

## CI/CD

GitHub Actions, kod deposuna gönderilen değişiklikler üzerinde otomatik kontroller çalıştırmak için kullanılır.

CI sürecinde testlerin, TypeScript tip kontrolünün ve yapılandırılmış build adımlarının başarılı olması hedeflenir. Böylece hataların uygulama yayınlanmadan önce tespit edilmesi kolaylaşır.

## Deployment

Uygulama Render üzerinde yayınlanmıştır. Yerel geliştirme ortamından farklı olarak deployment ortamında uygulama, hosting platformunun sağladığı çalışma ortamında çalışır.

Deployment sonrasında `/health` ve `/users` endpoint'leri üzerinden temel smoke testler gerçekleştirilebilir.

## Limitations

- Kullanıcı verileri şu anda bellekte tutulan bir dizide saklanır.
- Kalıcı bir veritabanı kullanılmamaktadır.
- Sunucu yeniden başlatıldığında kullanıcı verileri sıfırlanabilir.
- Kalıcı veri saklama, kimlik doğrulama ve yetkilendirme bu projenin mevcut kapsamına dahil değildir.

## Learning Objectives

Bu proje kapsamında aşağıdaki backend geliştirme konularının uygulamalı olarak öğrenilmesi hedeflenmiştir:

- REST API tasarımı ve CRUD işlemleri
- İstek doğrulama ve hata yönetimi
- Unit test ve integration test yaklaşımı
- Docker image ve container kavramları
- Logging ve temel API güvenliği
- Rate limiting ve health check
- CI/CD süreçleri ve GitHub Actions
- Deployment ve production ortamı kavramları
