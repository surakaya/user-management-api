# 1- FROM - hangi python/typescript?
# 2- WORKDIR - hangi klasör?
# 3- COPY - hangi dosyalar kopyalanacak?
# 4- RUN - hangi bağımlılıklar?
# 5- CMD - neler çalışacak? 

# docker build -t uygulama_adı . - imaj oluşturur
# docker run -p 5000:5000 uygulama_adı - konteyner oluşturur ve çalıştırır
# docker images - imajları listeler
# docker rmi uygulama-adı - imajı siler
# docker ps -a - çalışan ve durmuş tüm konteynerleri listeler
# docker stop/start konteyner-adı - konteyneri durdurur ve devam ettirir
# docker rm konteyner-adı - konteyneri siler (önce durdurulmalı)
# docker -rm -f konteyner-adı - konteyneri durdurur ve siler
# docker logs konteyner-adı - konteynerin loglarını gösterir
# docker exec -it backend-validation-api sh - konteynerin içine girer
# docker system df - disk kullanımını gösterir
# docker system prune - gereksiz dosyaları siler

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "dev"]
