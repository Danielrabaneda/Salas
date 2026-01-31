
# Especificación Funcional: Sistema de Notificaciones Inteligentes

## 1. Triggers y Condiciones de Envío

| Tipo | Trigger | Prioridad | Condición Crítica |
| :--- | :--- | :--- | :--- |
| **Re-enganche** | Cron (Cada 4h) | 2 | Usuario = Creador O WordCount > Media Y Inactivo en historia > 12h. |
| **Cierre Ranking** | Cron (Domingo 20:00) | 1 | Historia en Top 50 O Votos gratis > 0. |
| **Nuevo Desafío** | Trigger de DB | 3 | Categoría desafío = Top 3 ThemeAffinity del usuario. |

## 2. Segmentación de Usuarios
*   **Casual:** < 3 historias/semana. Recibe copys más "invitadores".
*   **Heavy User:** > 10 historias/semana. Recibe copys competitivos.
*   **Premium:** Suscripción activa. Recibe copys enfocados en exclusividad y recompensas.

## 3. Control de Spam y Frecuencia
*   **Límite Diario:** 3 notificaciones máximo (excluyendo turnos).
*   **Grace Period:** Si `lastActiveAt` < 45 minutos, se cancela el envío (el usuario ya está en la app).
*   **Franja Horaria:** Solo enviar entre las 09:00 y las 23:00 del huso horario del usuario.

## 4. Listado de Copys (A/B Testing)

### A. Re-enganche
*   **A (Emocional):** ¡Tu historia te echa de menos! ✍️ "La pizza que conquistó Madrid" necesita un giro épico. ¿Entras?
*   **B (Acción):** ¡Remata la jugada! 🔥 Eres el que más ha escrito en "[Título]". Entra y pon el punto final antes que otros.

### B. Cierre de Ranking
*   **A (Votos):** ¡No los pierdas! ⚡ Tienes 3 votos gratis que caducan en 2h. Apoya a tus amigos ahora.
*   **B (Competitivo):** ¡Estás muy cerca! 🏆 Tu historia está en el Top 50. Un par de votos más y entras al podio semanal.

### C. Desafíos Personalizados
*   **A (Afinidad):** Para un amante del [Tema]... 🎭 Ha empezado el reto "[Nombre]". Tu estilo encaja perfectamente.
*   **B (Premios):** ¡Monedas en juego! 💰 Nuevo desafío de [Tema]. Participa y dobla tus ganancias esta semana.

## 5. Propuesta de Cloud Functions

### `fnCheckReengagement` (Cron: `0 */4 * * *`)
1. Busca historias `active` con `lastActivityAt` > 12h.
2. Filtra participantes clave (creador o top contributors).
3. Verifica `dailyPushCount < 3` y `lastActiveAt > 1h`.
4. Envía notificación y actualiza `lastPushAt` y `dailyPushCount`.

### `fnRankingDeadline` (Cron: `0 20 * * 0`)
1. Ejectuta a las 20:00 (2h antes del cierre).
2. Query: Usuarios con `freeVotes > 0` O Historias en `voting` con `votes > threshold`.
3. Envío masivo segmentado.

### `onChallengeCreated` (Firestore Trigger: `onCreate` en `/challenges`)
1. Lee el `themeId` del desafío.
2. Busca usuarios (en batches) donde `preferredThemes` incluya el `themeId`.
3. Dispara notificación solo a ese segmento.
