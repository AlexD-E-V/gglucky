# 🗺️ GG Lucky — Planes a futuro

Cosas que **no** se hacen ahora pero conviene tener anotadas para no olvidarlas.
El estado del lanzamiento vive en el [`README.md`](README.md); este archivo es solo
para lo que viene *después*.

---

## 1. Monetización con anuncios (AdMob) — checklist de 5 lugares

> ⚠️ **Esto es lo más fácil de olvidar y lo único con riesgo de sanción.**
> Hoy la app declara "sin anuncios" en varios sitios a la vez. El día que se integre
> AdMob hay que actualizar **los cinco**, en el mismo release. Cambiar uno y no los
> otros es una **incoherencia sancionable** por Google (suspensión de la ficha o de
> la cuenta), no un simple error de redacción.

Al integrar el SDK de AdMob, este añade **por su cuenta** el permiso `AD_ID`
(`com.google.android.gms.permission.AD_ID`) al manifest fusionado — aunque no se
escriba en `AndroidManifest.xml`. Eso dispara toda la cadena:

| # | Qué actualizar | Dónde |
|---|---|---|
| 1 | **Declaración de ID de publicidad** → *Sí*, con sus finalidades | Play Console → Contenido de la aplicación → ID de publicidad |
| 2 | **Declaración de anuncios** → *Sí, contiene anuncios* | Play Console → Contenido de la aplicación → Anuncios |
| 3 | **Seguridad de los datos** → declarar la recolección del *identificador de publicidad* (y cualquier otro dato que recoja el SDK) | Play Console → Contenido de la aplicación → Seguridad de los datos |
| 4 | **Descripción de la ficha** → quitar / reescribir "sin anuncios" | [`store/ficha-play-store.md`](store/ficha-play-store.md) (línea ~45 y nota de familias ~91) **y** la ficha real en Play Console |
| 5 | **Política de privacidad** → describir AdMob como tercero, qué recoge y enlazar su política | [`privacy-policy.html`](privacy-policy.html) (secciones 1 y 4) |

**Bonus (no obligatorio pero coherente):** el [`README.md`](README.md) también dice
"sin anuncios" en la primera línea de la descripción. Es la página pública de
GitHub Pages, así que conviene alinearla igual.

### Otras consecuencias a tener en cuenta

- **Público objetivo.** Hoy la ficha declara 16-17 y 18+ y se apoya en "cumple la
  política de familias por construcción". Con anuncios eso deja de ser cierto tal
  cual; revisar si hay que ajustar la justificación o la configuración de anuncios
  (p. ej. contenido apto para menores en AdMob).
- **Ya no es 100% offline.** La app pasaría a necesitar permiso de red y conexión
  para servir anuncios. Hay que decidir si los anuncios son opcionales / degradan
  bien sin internet, y actualizar el claim de "100% offline" donde aparezca.
- **Clasificación IARC.** Un cuestionario nuevo puede pedir revisión si cambian
  interactividad o compartición de datos.

---

## 2. Landing real en GitHub Pages

**Situación actual:** Pages está activo sirviendo la raíz del repo. Eso significa
que el `README.md` **es una página web pública** y se republica sola cada vez que
se edita. No hay riesgo de seguridad — el repo ya era público, el keystore y
`keystore.properties` están fuera del repo (`.gitignore`) y el README solo los
menciona.

**El detalle:** si alguien recorta la URL de la política de privacidad hasta la raíz
(<https://alexd-e-v.github.io/gglucky/>), aterriza en documentación técnica de
desarrollo. No es un problema de política ni de seguridad — es **estético**.

**Plan (post-lanzamiento):** armar una landing de verdad en la raíz, con:

- Ícono y nombre de la app.
- Un par de capturas de [`store/screenshots/`](store/screenshots/).
- Botón "Descargar en Google Play".
- Link a la [política de privacidad](privacy-policy.html).
- Los créditos (Mizarium · EasySolution).

Se arma rápido (un `index.html` estático, mismo estilo que `privacy-policy.html`) y
queda como buen ítem de portafolio. El README seguiría existiendo en el repo pero
dejaría de ser la portada.

---

## 3. Ideas sueltas de producto

*(Sin compromiso — anotar aquí lo que vaya surgiendo.)*

- [ ] Historial de sorteos realizados.
- [ ] Compartir el resultado como imagen.
- [ ] Modo "varios ganadores" (sortear N puestos seguidos).
- [ ] Importar la lista de participantes desde texto pegado / CSV.
- [ ] Localización a inglés (`en-US`) en la ficha de Play Store.
- [ ] Cuenta de desarrollador de **organización** para que la ficha diga "Mizarium"
      en vez del nombre legal — requiere D-U-N-S y una **cuenta nueva**: la personal
      no se puede convertir, y migrar la app implica transferirla.
