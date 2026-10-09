# App Android

O Manor Escape também roda como app Android, empacotado com o [Capacitor](https://capacitorjs.com): o jogo roda numa WebView, com ícone e abertura próprios. O progresso continua salvo automaticamente no aparelho.

- Id do app: `br.com.renanaugusto.manorescape` · Nome: **Manor Escape** · Android 7.0 (API 24) ou superior.

## Instalar no celular (APK de depuração)

1. No GitHub: **Actions → Android APK → Run workflow** (ou abra a execução mais recente).
2. Baixe o arquivo `manor-escape-debug-apk` em **Artifacts**, descompacte e abra o `app-debug.apk` no celular.
3. Na primeira vez, o Android pede para permitir a instalação de apps de fontes desconhecidas para o navegador ou o gerenciador de arquivos que você usou.

O APK de depuração serve para uso próprio e testes. Ele **não** pode ser enviado para a Play Store.

## Gerar uma versão nova

O fluxo `.github/workflows/android.yml` faz tudo na nuvem, sem Android Studio. Ele roda sozinho em PRs que mexem em `android/` e pode ser disparado à mão.

No computador, com [Android Studio](https://developer.android.com/studio):

```bash
npm ci
npm run build:app   # build do jogo + sincronização com android/
npm run app:open    # abre o projeto no Android Studio (Run ▶ para instalar no aparelho)
```

A cada mudança no jogo, rode `npm run build:app` de novo antes de compilar o app. O ícone e a abertura saem das imagens de `assets/` (`npx capacitor-assets generate --android`).

## Publicar na Play Store (passos que só o dono pode fazer)

1. Criar uma conta de desenvolvedor no Google Play Console (taxa única).
2. Criar uma chave de assinatura (keystore) e guardá-la com segurança: sem ela não há como publicar atualizações.
3. Gerar um pacote assinado (`.aab`) pelo Android Studio (**Build → Generate Signed Bundle**) ou configurar a assinatura no fluxo com segredos do repositório.
4. Preencher a ficha da loja (descrição, capturas de tela, classificação indicativa e política de privacidade). O jogo não coleta dados pessoais.

## Limites conhecidos

- As fontes (Cormorant Garamond e IBM Plex Sans) são carregadas do Google Fonts; sem internet, o jogo usa fontes do sistema.
- Os testes foram feitos no navegador e na geração do APK; ainda falta validar em um aparelho Android de verdade.
