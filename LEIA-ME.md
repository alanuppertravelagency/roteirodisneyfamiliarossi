# Roteiro de viagem — Mariana, Denise & Violeta Rossi

Mesmo app que já usamos no projeto Disney (disneyorlando), só que configurado do zero pra esse cliente novo.

## Passo a passo pra colocar no ar

1. **Importar a planilha**: abra o Google Sheets, importe o `modelo-planilha.csv` (Arquivo → Importar → Upload). Ele já vem preenchido com os dados extraídos dos vouchers (voo, hotel, traslados, ingressos).
2. **Publicar a planilha**: Arquivo → Compartilhar → Publicar na Web → formato CSV → copie o link gerado.
3. **Colar o link no index.html**: abra o arquivo, procure `SHEET_CSV_URL: ""` e cole o link entre as aspas.
4. **Subir pro GitHub**: crie um repositório novo (ex: `roteiro-rossi`) e envie todos os arquivos desta pasta.
5. **Conectar ao Netlify**: mesmo processo do projeto Disney — "Add new site → Import an existing project" → GitHub → escolher o repositório.
6. **Tornar público**: em Project configuration, verifique a visibilidade do site (Public, não Private) antes de enviar o link ao cliente.

## Funções extras (opcional)

- **Deslocamento real (Google Maps)**: crie um projeto no Google Cloud, ative a **Routes API** (não a Distance Matrix, que está descontinuada), gere uma chave, e adicione `GOOGLE_MAPS_API_KEY` nas Environment Variables do Netlify.
- **Lembretes automáticos**: adicione `SHEET_CSV_URL`, e as variáveis do Twilio (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, `RECIPIENT_WHATSAPP`) e/ou Resend (`RESEND_API_KEY`, `RESEND_FROM`, `RECIPIENT_EMAIL`).

## Pontos de atenção nos dados

- O ingresso "Walt Disney World 4-Park Magic Ticket" é válido em qualquer 4 dias entre 16/09 e 22/09 — a linha no CSV está só no Dia 2 como referência; ajuste conforme os dias reais escolhidos.
- Os dias 17, 19 e 20/09 estão marcados como "Dia livre" — edite se houver mais atividades planejadas.
- Ícone do app já configurado com a logo da Upper Travel Agency.
