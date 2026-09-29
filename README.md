# User Management API

Express ve TypeScript kullanılarak backend temellerini öğrenmek amacıyla geliştirilmiş basit bir REST API.

## Özellikler

- Kullanıcı oluşturma
- Kullanıcıları listeleme
- Kullanıcı detaylarını getirme
- Kullanıcı güncelleme
- Kullanıcı silme
- UUID ile kullanıcı kimliklendirme
- Zod ile veri doğrulama
- Global hata yönetimi
- Custom AppError
- Express Router
- HTTP status kodları

## Teknolojiler

- Node.js
- TypeScript
- Express
- Zod

## Çalıştırma

```bash
npm install
npm run dev
```

## API varsayılan olarak;

```bash
http://localhost:3000
```
üzerinden çalışır. 

## API Endpointleri

| Method | Endpoint | Açıklama |
|---|---|---|
| POST | `/users` | Kullanıcı oluşturur |
| GET | `/users` | Tüm kullanıcıları getirir |
| GET | `/users/:id` | Kullanıcı detayını getirir |
| PATCH | `/users/:id` | Kullanıcıyı günceller |
| DELETE | `/users/:id` | Kullanıcıyı siler |

## Not

Bu proje backend temellerini öğrenmek amacıyla geliştirilmiştir. Kullanıcı verileri şu aşamada veritabanı yerine bellekte tutulmaktadır. Bu nedenle sunucu yeniden başlatıldığında veriler sıfırlanır.