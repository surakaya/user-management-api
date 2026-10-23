# Backend Validation API

Express.js ve TypeScript ile geliştirilmiş, kullanıcı yönetimi için REST API sunan bir backend projesidir. Proje boyunca mevcut API üzerinde otomatik test, veri doğrulama, merkezi hata yönetimi, logging, temel güvenlik önlemleri, rate limiting, health check, Docker, CI kontrolleri ve deployment çalışmaları yapılmıştır. Ayrıca Prometheus ve Grafana ile yerel metrik izleme ortamı yapılandırılmıştır.

## İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Proje Yapısı](#proje-yapısı)
- [Gereksinimler](#gereksinimler)
- [Kurulum ve Yerel Çalıştırma](#kurulum-ve-yerel-çalıştırma)
- [API Endpoint'leri](#api-endpointleri)
- [Doğrulama ve Hata Yönetimi](#doğrulama-ve-hata-yönetimi)
- [Logging ve Metrikler](#logging-ve-metrikler)
- [Prometheus ve Grafana ile İzleme](#prometheus-ve-grafana-ile-izleme)
- [Test, Tip Kontrolü ve Build](#test-tip-kontrolü-ve-build)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Deployment](#deployment)
- [Sınırlamalar](#sınırlamalar)

## Özellikler

- Kullanıcı oluşturma, listeleme, görüntüleme, güncelleme ve silme işlemleri (CRUD)
- Kullanıcı kimlikleri için UUID
- Zod ile oluşturma ve güncelleme isteklerinin doğrulanması
- Özel `AppError` sınıfı ve merkezi hata yönetimi
- HTTP istekleri için yapılandırılmış log kaydı
- Helmet ile temel HTTP güvenlik başlıkları
- CORS yapılandırması
- `express-rate-limit` ile istek sıklığını sınırlama
- `GET /health` ile temel sağlık kontrolü
- `GET /metrics` ile Prometheus formatında metrik sunma
- `prom-client` ile varsayılan Node.js metrikleri, HTTP istek sayacı ve istek süresi histogramı
- Prometheus ile metrik toplama
- Grafana ile Prometheus metriklerini görselleştirmek için yerel izleme ortamı
- Vitest ve Supertest ile otomatik testler
- Docker image ve container oluşturma
- GitHub Actions ile otomatik test, TypeScript kontrolü ve build
- Render üzerinde API deployment'ı

## Teknoloji Yığını

| Teknoloji | Kullanım amacı |
|---|---|
| Node.js 22 | JavaScript çalışma ortamı |
| Express.js 5 | HTTP sunucusu, middleware ve API routing |
| TypeScript | Statik tip kontrolü |
| Zod | İstek verilerinin doğrulanması |
| Vitest | Otomatik testlerin çalıştırılması |
| Supertest | HTTP endpoint'lerinin test edilmesi |
| Helmet | HTTP güvenlik başlıklarının yapılandırılması |
| CORS | Cross-origin istek politikasının belirlenmesi |
| express-rate-limit | İstek sıklığının sınırlandırılması |
| prom-client | Uygulama metriklerinin toplanması ve `/metrics` üzerinden sunulması |
| Prometheus | Metriklerin belirli aralıklarla toplanması ve sorgulanması |
| Grafana | Metriklerin panolarda görselleştirilmesi |
| Docker | Uygulamayı container içinde çalıştırma |
| Docker Compose | Prometheus ve Grafana servislerini birlikte çalıştırma |
| GitHub Actions | CI kontrollerinin otomatikleştirilmesi |
| Render | API'nin yayınlanması |

## Proje Yapısı

```text
user-management-api/
├── .github/
│   └── workflows/
│       └── ci.yml
├── monitoring/
│   └── prometheus.yml
├── src/
│   ├── data.ts
│   ├── errors.ts
│   ├── index.ts
│   ├── server.ts
│   ├── types.ts
│   ├── user.integration.test.ts
│   ├── user.routes.ts
│   ├── user.schema.ts
│   └── zod.test.ts
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

- `src/index.ts`: Portu belirleyerek uygulama sunucusunu başlatır.
- `src/server.ts`: Express uygulamasını, middleware'leri, health check'i, Prometheus metriklerini ve merkezi hata yönetimini yapılandırır.
- `src/user.routes.ts`: Kullanıcı CRUD endpoint'lerini tanımlar.
- `src/user.schema.ts`: Kullanıcı oluşturma ve güncelleme için Zod şemalarını içerir.
- `src/errors.ts`: `AppError` hata sınıfını tanımlar.
- `src/types.ts`: Kullanıcı veri tipini tanımlar.
- `src/data.ts`: Başlangıç kullanıcılarını ve bellek içi kullanıcı listesini tutar.
- `src/zod.test.ts`: Zod doğrulama mantığı için temel birim testlerini içerir.
- `src/user.integration.test.ts`: Supertest ile API endpoint'lerine yönelik entegrasyon testlerini içerir.
- `monitoring/prometheus.yml`: Prometheus'un scrape aralığını ve API hedefini tanımlar.
- `docker-compose.yml`: Prometheus ve Grafana servislerini, portlarını ve veri volume'lerini tanımlar.
- `.github/workflows/ci.yml`: Push ve pull request olaylarında test, tip kontrolü ve build adımlarını çalıştırır.

## Gereksinimler

- Node.js 22 ve npm
- Docker Desktop veya Docker Engine ve Docker Compose (Prometheus/Grafana ortamı için)

## Kurulum ve Yerel Çalıştırma

Depoyu klonlayıp bağımlılıkları yükle:

```bash
git clone https://github.com/surakaya/user-management-api.git
cd user-management-api
npm ci
```

Geliştirme sunucusunu başlat:

```bash
npm run dev
```

API varsayılan olarak `http://localhost:3000` adresinde dinler. Port, `PORT` ortam değişkeniyle değiştirilebilir.

## API Endpoint'leri

| Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/health` | Uygulamanın çalışır durumda olduğunu belirten temel yanıtı döndürür. |
| GET | `/metrics` | Prometheus'un okuyabileceği metrik çıktısını döndürür. |
| POST | `/users` | Yeni kullanıcı oluşturur. |
| GET | `/users` | Kullanıcı listesini döndürür. |
| GET | `/users/:id` | Belirtilen ID'ye sahip kullanıcıyı döndürür. |
| PATCH | `/users/:id` | Kullanıcı bilgilerini kısmi olarak günceller. |
| DELETE | `/users/:id` | Kullanıcıyı siler. |

### Kullanıcı oluşturma örneği

İstek:

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

Başarılı oluşturma işlemi `201 Created` durum kodu ile oluşturulan kullanıcıyı döndürür. Kullanıcı kimliği sunucu tarafında UUID olarak oluşturulur.

### Kullanıcı güncelleme örneği

```http
PATCH /users/<user-uuid>
Content-Type: application/json
```

```json
{
  "name": "Jane Smith"
}
```

PATCH isteğinde yalnızca güncellenecek alanların gönderilmesi yeterlidir.

### Yanıtlar ve sınırlar

- Geçersiz istek verisi için `400 Bad Request` döndürülür.
- Kullanıcı bulunamazsa `404 Not Found` döndürülür.
- Başarılı silme işlemi `204 No Content` döndürür.
- Mevcut rate-limit yapılandırması `/users` rotasına 15 dakikalık pencere başına 5 istek sınırı uygular.

## Doğrulama ve Hata Yönetimi

Kullanıcı oluşturma ve güncelleme istekleri Zod şemalarıyla doğrulanır. `name` boş olamaz, `email` geçerli bir e-posta biçiminde olmalıdır ve `age` pozitif bir tam sayı olmalıdır. Güncelleme şeması, oluşturma şemasının alanlarını isteğe bağlı hâle getirerek kısmi güncellemeye izin verir.

`AppError`, uygulamaya özgü hataların HTTP durum kodu ve hata koduyla ifade edilmesini sağlar. Merkezi hata middleware'i bu hataları ortak bir yerde işler; beklenmeyen hatalar loglanır ve `500 Internal Server Error` yanıtıyla karşılanır.

## Logging ve Metrikler

HTTP istek middleware'i yanıt tamamlandığında istek method'unu, rotayı, HTTP durum kodunu ve yanıt süresini loglar. Aynı middleware, Prometheus için aşağıdaki metrikleri günceller:

- `http_requests_total`: HTTP isteklerinin toplam sayısını ölçen sayaç. `method`, `route` ve `status_code` etiketlerini içerir.
- `http_request_duration_seconds`: İstek sürelerini saniye cinsinden ölçen histogram. Aynı etiketlerle kaydedilir.
- `prom-client` tarafından toplanan varsayılan Node.js metrikleri.

Metrikler `GET /metrics` endpoint'i üzerinden sunulur. API çalışırken çıktıyı kontrol etmek için:

```bash
curl http://localhost:3000/metrics
```

## Prometheus ve Grafana ile İzleme

Depodaki Docker Compose yapılandırması Prometheus ve Grafana'yı yerel izleme ortamı olarak çalıştırır. `docker-compose.yml` dosyası API container'ını başlatmaz; API'yi ayrıca yerel geliştirme süreciyle çalıştırmak gerekir.

### 1. API'yi başlat

Proje kök dizininde ilk terminalde:

```bash
npm run dev
```

API'nin metrik endpoint'inden yanıt geldiğini kontrol et:

```bash
curl http://localhost:3000/metrics
```

### 2. Prometheus ve Grafana'yı başlat

İkinci terminalde proje kök dizininde:

```bash
docker compose up -d
```

Arayüzler:

- Prometheus: [http://localhost:9090](http://localhost:9090)
- Grafana: [http://localhost:3001](http://localhost:3001)

`monitoring/prometheus.yml` yapılandırmasında scrape aralığı 5 saniyedir. `backend-validation` işi, host makinede 3000 portunda çalışan API'nin `/metrics` endpoint'ini `host.docker.internal:3000` hedefinden izler. Bu hedef Docker Desktop kullanan macOS ortamına uygundur; farklı işletim sistemlerinde hedef yapılandırması değişiklik gerektirebilir.

### 3. Prometheus hedefini ve metrikleri kontrol et

Prometheus arayüzünde **Status → Targets** bölümünü açıp `backend-validation` hedefinin `UP` durumda olduğunu doğrula. Veri oluşması için API'ye birkaç istek gönder:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/users
```

Prometheus'un **Graph** bölümünde aşağıdaki PromQL sorgularını deneyebilirsin:

Toplam HTTP istek sayaçları:

```promql
http_requests_total
```

Dakikadaki istek hızını hesaplama:

```promql
rate(http_requests_total[1m])
```

Rotalara ve durum kodlarına göre istek hızını karşılaştırma:

```promql
sum(rate(http_requests_total[1m])) by (method, route, status_code)
```

95. yüzdelik istek süresini histogram üzerinden tahmin etme:

```promql
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

### 4. Grafana'yı Prometheus'a bağla

1. Grafana'yı [http://localhost:3001](http://localhost:3001) adresinde aç.
2. Compose dosyasında özel bir Grafana kullanıcı/parola değişkeni tanımlanmadığı için ilk girişte varsayılan `admin` / `admin` bilgileri kullanılabilir; Grafana parola değiştirmeni isteyebilir.
3. **Connections → Data sources** (sürüme göre menü adı değişebilir) bölümünden **Add data source** seç ve **Prometheus**'u ekle.
4. URL alanına `http://prometheus:9090` yaz. Grafana container'ı Prometheus'a Docker Compose servis adı üzerinden erişir.
5. **Save & test** ile bağlantıyı doğrula.
6. Bir dashboard oluşturup panel sorgularına yukarıdaki PromQL ifadelerini ekleyebilirsin.

Not: Mevcut Compose dosyası Grafana ve Prometheus servislerini ve veri volume'lerini tanımlar. Dashboard'lar veya paneller depodan otomatik provision edilmez; bunları Grafana arayüzünde ayrıca oluşturmak gerekir.

### 5. İzleme servislerini durdurma

```bash
docker compose down
```

Bu komut container'ları durdurup kaldırır, ancak isimlendirilmiş volume'leri korur. İzleme verilerini de silmek için ayrıca `docker compose down -v` kullanılabilir; bu komut Prometheus ve Grafana volume'lerindeki verileri de siler.

## Test, Tip Kontrolü ve Build

Otomatik testleri çalıştır:

```bash
npm test
```

TypeScript tip kontrolünü çalıştır:

```bash
npm run typecheck
```

Production JavaScript çıktısını oluştur:

```bash
npm run build
```

Build sonrasında derlenmiş uygulamayı başlatmak için:

```bash
npm start
```

Testler Vitest ile çalışır; endpoint testlerinde Supertest, doğrulama testlerinde ise doğrudan Zod şemaları kullanılır.

## Docker

API için Docker image oluştur:

```bash
docker build -t backend-validation-api .
```

Container'ı başlat:

```bash
docker run -d --name backend-validation-prod -p 3000:3000 backend-validation-api
```

Container durumunu ve loglarını kontrol et:

```bash
docker ps
docker logs backend-validation-prod
```

Container'ı durdur:

```bash
docker stop backend-validation-prod
```

Health check endpoint'ini denemek için:

```bash
curl http://localhost:3000/health
```

API'yi bu şekilde container içinde çalıştırdığında, Prometheus yapılandırmasındaki `host.docker.internal:3000` hedefi de API'nin host portundan erişilebilir olmasını bekler. Aynı portu kullanan yerel sunucu ile container'ı aynı anda başlatmamaya dikkat et.

## CI/CD

`.github/workflows/ci.yml` workflow'u `main` dalına push edildiğinde veya `main` dalını hedefleyen bir pull request açıldığında çalışır. Node.js 22 ortamında bağımlılıkları `npm ci` ile yükler ve şu kontrolleri yürütür:

1. `npm test`
2. `npm run typecheck`
3. `npm run build`

Bu yapılandırma Continuous Integration (CI) kontrollerini otomatikleştirir. Workflow dosyasında Render'a otomatik deployment adımı bulunmadığından, CI'ı tam otomatik CD süreciyle karıştırmamak gerekir.

## Deployment

API, Render üzerinde yayınlanmıştır: [Backend Validation API](https://user-management-api-g44x.onrender.com).

Servis aktif olduğunda temel smoke test için `/health` ve `/users` endpoint'leri kullanılabilir. Render servisi durdurulduğunda veya uyku durumundayken herkese açık URL hemen yanıt vermeyebilir.

Prometheus ve Grafana yapılandırması yerel Docker Compose izleme ortamı içindir; Compose dosyası bu servisleri Render'a deploy etmez.

## Sınırlamalar

- Kullanıcılar kalıcı bir veritabanında değil, bellek içinde tutulan bir dizide saklanır. Uygulama yeniden başlatıldığında veriler sıfırlanabilir.
- Kimlik doğrulama ve yetkilendirme bu projenin kapsamına dahil değildir.
- `/health` temel bir liveness benzeri kontroldür; veritabanı veya başka bağımlılıklar için readiness kontrolü yapmaz.
- Grafana dashboard'ları depoda otomatik provision edilmez; arayüzden ayrıca oluşturulmaları gerekir.
- GitHub Actions workflow'u test, tip kontrolü ve build çalıştırır; otomatik deployment yapmaz.
