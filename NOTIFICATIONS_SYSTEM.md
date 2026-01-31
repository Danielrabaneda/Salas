
# Sistema de Notificaciones Inteligentes - One Word Story

## 1. Estructura de Datos (Firestore)

### Colección `users/{uid}`
```json
{
  "lastActiveAt": "Timestamp",
  "stats": {
    "preferredThemes": ["humor", "terror"]
  },
  "notificationSettings": {
    "dailyPushCount": 0,
    "lastPushSentAt": "Timestamp"
  }
}
```

### Colección `notifications_log` (Para evitar spam)
```json
{
  "uid": "user_id",
  "type": "re-engagement | ranking_alert | challenge",
  "storyId": "story_id",
  "sentAt": "Timestamp"
}
```

## 2. Listado de Copys (Español Neutro)

### A. Re-enganche de Historias
*   **Variante A (Motivadora):**
    *   **Título:** ¡Tu historia te extraña! ✍️
    *   **Cuerpo:** "La pizza que conquistó Madrid" sigue activa. ¡Entra y dales un final épico!
*   **Variante B (Social/FOMO):**
    *   **Título:** ¡El caos continúa! 🔥
    *   **Cuerpo:** Tus amigos siguen escribiendo en tu historia. ¡No dejes que la terminen sin ti!

### B. Cierre de Ranking (Domingo 22:00)
*   **Variante A (Participante Top):**
    *   **Título:** ¡Cierre de ranking en 2h! 🏆
    *   **Cuerpo:** Tu historia está en el Top 50. ¡Consigue los últimos votos para ganar el premio semanal!
*   **Variante B (Votante):**
    *   **Título:** ¡No desperdicies tus votos! ⚡
    *   **Cuerpo:** Aún tienes votos gratis hoy. Úsalos antes del cierre para apoyar a tus favoritos.

### C. Desafíos Temáticos (Segmentados)
*   **Variante A (Específica):**
    *   **Título:** Nuevo reto de [Tema] 🎭
    *   **Cuerpo:** Ha empezado el desafío "[Nombre]". ¡Es tu categoría favorita, demuestra quién manda!
*   **Variante B (Premios):**
    *   **Título:** ¡Monedas extra en juego! 💰
    *   **Cuerpo:** Participa en el nuevo desafío de [Tema] y gana bonos de monedas si llegas al podio.

## 3. Lógica de Cloud Functions

### `cronCheckInactiveStories` (Cada 4 horas)
1. Busca historias `status: 'active'` donde `lastActivityAt` sea > 6h y < 24h.
2. Identifica participantes que no han jugado en los últimos 60 min.
3. Envía notificación de re-enganche si `user.notificationSettings.dailyPushCount` < 3.

### `cronRankingWarning` (Domingos 22:00)
1. Filtra usuarios activos en la última semana.
2. Comprueba si tienen historias en el Top 50 (query por `weekNumber` y `totalVotes`).
3. Envía el aviso de "Cierre de Ranking".

### `onChallengeCreated` (Trigger por escritura en `/challenges`)
1. Obtiene el `theme` del nuevo desafío.
2. Busca usuarios (segmentos de 500) que tengan ese `theme` en su `preferredThemes`.
3. Dispara la notificación personalizada.

## 4. Priorización de Notificaciones
Si un usuario es elegible para varias, la función `pushDispatcher` aplica este orden:
1. **Es tu turno** (Ignora límites diarios).
2. **Cierre de Ranking** (Solo domingos).
3. **Re-enganche de historia propia**.
4. **Nuevo Desafío Temático**.
