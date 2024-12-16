# AIAC - Artificial Intelligence Arduino Car

## Visão Geral

O AIAC (Artificial Intelligence Arduino Car) é um projeto de carro autônomo que pode ser controlado remotamente e possui um sistema interno de decisão aplicada. O projeto utiliza um NodeMCU para controlar o carro e se comunica com uma câmera GoPro para transmitir vídeo em tempo real.

## Participantes

- [Eshley](https://github.com/Eshinha)
- [Felipe Lira](https://github.com/Felpslira)
- [Felipe Murakami](https://github.com/Murakami1410)
- [João Pedro Mascena](https://github.com/mascenaa)
- [Marty](https://github.com/martz3)
- [Pietro Garbin](https://github.com/pepgna)

## Estrutura do Projeto

O projeto está dividido em três principais diretórios:

- **arduino/**: Contém o código para o NodeMCU que controla o carro.
- **backend/**: Contém a API backend desenvolvida com FastAPI para controlar o carro e processar dados.
- **frontend/**: Contém a interface web desenvolvida com Next.js para interagir com o carro.

## Arduino

O código do Arduino está localizado em [arduino/core/core.ino](arduino/core/core.ino). Ele configura a conexão WiFi, inicializa os motores e o servo, e define as rotas HTTP para controlar o movimento do carro.

### Configuração

- **SSID**: `JOAO__.2.4 G`
- **GoPro SSID**: `bmwixespm`
- **GoPro Senha**: `goprohero4`

### Funções Principais

- `setup()`: Configura a conexão WiFi, inicializa os motores e o servo, e inicia o servidor HTTP.
- `loop()`: Função principal que mantém o servidor HTTP em execução.
- `handleMove()`: Manipula os comandos de movimento recebidos via HTTP.

## Backend

O backend está localizado em [backend/app/main.py](backend/app/main.py) e [backend/app/test/test_main.py](backend/app/test/test_main.py). Ele utiliza FastAPI para criar uma API que controla o carro e processa dados.

### Endpoints Principais

- `GET /start-stream/`: Inicia a transmissão de vídeo.
- `GET /stop-stream/`: Interrompe a transmissão de vídeo.
- `POST /move/`: Envia comandos de movimento para o carro.

### Testes

Os testes estão localizados em [backend/app/test/test_main.py](backend/app/test/test_main.py) e utilizam `TestClient` do FastAPI para testar os endpoints.

## Frontend

O frontend está localizado em [frontend/aiac/](frontend/aiac/). Ele utiliza Next.js para criar uma interface web que permite controlar o carro e visualizar a transmissão de vídeo.

### Configuração

- **Arquivo de configuração ESLint**: [frontend/aiac/.eslintrc.json](frontend/aiac/.eslintrc.json)
- **Arquivo de configuração Tailwind**: [frontend/aiac/tailwind.config.ts](frontend/aiac/tailwind.config.ts)

### Componentes Principais

- `AboutUs`: Componente que descreve o projeto e a equipe, localizado em [frontend/aiac/src/app/about/page.tsx](frontend/aiac/src/app/about/page.tsx).

## Deploy

### Backend

Para rodar o backend, utilize o Docker Compose:

```sh
docker-compose up --build
```
