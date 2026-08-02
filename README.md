# 🎡 GG Lucky · Ruleta de sorteos

Ruleta animada para sorteos y rifas: configuras un rango de números, la ruleta gira varias vueltas eliminando números al azar y en la última vuelta revela al ganador — con luces, música y confeti. **100% offline**, sin anuncios y sin recolección de datos.

Hecho por **Mizarium** y **EasySolution**.

## Características

- Rango de números configurable (desde / hasta) con exclusiones interactivas (toque o arrastre estilo galería).
- Nombres opcionales para los participantes; el ganador aparece con su nombre.
- Tablero en vivo de números en juego / eliminados, mostrado como modal animado tras cada vuelta.
- Música y efectos sintetizados con Web Audio API (sin archivos de audio); se pausa sola al ir a segundo plano.
- Bloqueada en vertical, respeta las safe areas de Android.

## Stack

| Pieza | Detalle |
|---|---|
| App web | Un solo archivo autocontenido: [`www/index.html`](www/index.html) (HTML + CSS + JS inline, sin dependencias externas) |
| Empaquetado | [Capacitor 8](https://capacitorjs.com/) → proyecto Android nativo en [`android/`](android/) |
| App ID | `com.mizarium.gglucky` |
| Íconos / splash | Generados por script: [`assets/build-icons.js`](assets/build-icons.js) |
| Assets de Play Store | Generados por script: [`assets/build-store-assets.js`](assets/build-store-assets.js) → carpeta [`store/`](store/) |
| Política de privacidad | [`privacy-policy.html`](privacy-policy.html) en la raíz — se sirve con GitHub Pages |

## Desarrollo

```bash
npm install
npx http-server www -p 5050 -c-1   # probar la web en el navegador
```

Tras cambiar `www/index.html`, sincronizar con el proyecto Android:

```bash
npx cap sync android
```

## Compilar

Requisitos: Node 18+, Android SDK y **Java 21** (sirve el JBR incluido en Android Studio).

**APK de debug** (para probar en un teléfono):

```bash
cd android && ./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

**AAB de release firmado** (para Play Store):

```bash
cd android && ./gradlew bundleRelease
# → android/app/build/outputs/bundle/release/app-release.aab
```

La firma requiere dos archivos que **no están en el repo** (ver `.gitignore`):
- `gglucky-release.keystore` (raíz del proyecto)
- `android/keystore.properties` (storeFile / storePassword / keyAlias / keyPassword)

> ⚠️ El keystore y su contraseña tienen respaldo privado. Sin ellos no se pueden firmar actualizaciones.

## Publicación en Play Store — estado

**✅ Hecho**
- [x] App terminada y probada en dispositivo físico (v1.0.0, `versionCode 1`).
- [x] Keystore de firma creado y `.aab` de release firmado y verificado.
- [x] Cuenta de desarrollador de Google Play creada (personal) y pago de 25 USD realizado.
- [x] Identidad de la cuenta de desarrollador verificada por Google.
- [x] Assets de la ficha generados en [`store/`](store/): ícono 512×512, gráfico destacado 1024×500 y textos de la ficha ([`store/ficha-play-store.md`](store/ficha-play-store.md)).
- [x] Política de privacidad escrita ([`privacy-policy.html`](privacy-policy.html)).
- [x] App creada en Play Console con el paquete `com.mizarium.gglucky`.
- [x] **GitHub Pages activado** — política de privacidad publicada y verificada en
      <https://alexd-e-v.github.io/gglucky/privacy-policy.html>

- [x] **Prueba interna publicada**: `.aab` subido, **Play App Signing aceptado**, app instalada desde Google Play en dispositivo físico y verificada funcionando. El keystore y la cadena de firma quedan validados.
- [x] Capturas de pantalla tomadas desde la build instalada de Play.

**⏳ En curso — aquí nos quedamos**
- [ ] **Completar la ficha de Play Store**, en este orden:
  1. Cambiar el idioma predeterminado a **Español (Latinoamérica) – es-419** y quitar `en-US`
     (desplegable de idioma → **Gestionar idiomas**). El cambio no persiste hasta guardar.
  2. Pegar los textos de [`store/ficha-play-store.md`](store/ficha-play-store.md) y subir ícono,
     gráfico destacado y capturas.

**📋 Pendiente (en este orden)**
- [ ] **Contenido de la aplicación** (sección aparte de la ficha): URL de política de privacidad, acceso a la app, anuncios, clasificación IARC, público objetivo y seguridad de datos. Respuestas sugeridas en `store/ficha-play-store.md`.
- [ ] Sacar capturas de pantalla desde el teléfono (mínimo 2, mejor 4): ruleta principal, tablero tras una vuelta, modal de excluir números, overlay del ganador.
- [ ] Completar la ficha de Play Store con los textos de [`store/ficha-play-store.md`](store/ficha-play-store.md).
- [ ] Cuestionarios: clasificación IARC, seguridad de datos y público objetivo (respuestas sugeridas en `store/ficha-play-store.md` — clave: es una herramienta de sorteos, sin dinero real ni apuestas).
- [ ] **Prueba cerrada obligatoria** (cuenta personal nueva): 12 testers durante 14 días seguidos antes de poder pedir acceso a producción. **Ir juntando los emails desde ya** — es el cuello de botella.
- [ ] Promover a **Producción** y enviar a revisión (la primera revisión puede tardar hasta ~2 semanas).

> ℹ️ La cuenta de desarrollador es **personal**, así que en la ficha aparecerá el nombre legal, no "Mizarium". Migrar a una cuenta de organización requiere D-U-N-S y una cuenta nueva (no se puede convertir la existente).
