# @roehai/sdk

SDK officiel JavaScript/TypeScript pour intégrer les agents IA RoehAI dans vos applications.

[![npm version](https://img.shields.io/npm/v/@roehai/sdk)](https://www.npmjs.com/package/@roehai/sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## Installation

```bash
npm install @roehai/sdk
# ou
yarn add @roehai/sdk
# ou
pnpm add @roehai/sdk
```

## Démarrage rapide

```typescript
import { RoehAI } from "@roehai/sdk";

const client = new RoehAI({ apiKey: "sk_votre_cle_api" });

// Déclencher un appel vocal IA
const call = await client.aria.triggerCall({
  phone_number: "+33612345678",
  contact_name: "Jean Dupont",
  context: "Prospect depuis formulaire web",
});

console.log(call.call_id); // "call_abc123"
console.log(call.status);  // "ringing"
```

Obtenez votre clé API sur [dev.roehai.com](https://dev.roehai.com).

---

## Agents disponibles

### `client.aria` — Agent Vocal Téléphonique

#### `aria.triggerCall(params)`

Déclenche un appel sortant IA vers un numéro de téléphone.

```typescript
const call = await client.aria.triggerCall({
  phone_number: "+33612345678",   // Requis — format E.164
  contact_name: "Jean Dupont",    // Optionnel
  business_name: "Salon Beauté",  // Optionnel
  pain_point: "Perd 30% des appels",
  context: "PME de 5 employés, secteur beauté",
});
```

**Réponse :**
```typescript
{
  success: true,
  call_id: "call_abc123",
  status: "ringing",
  prospect: "+33612345678"
}
```

---

#### `aria.getCallStatus(callId)`

Récupère le statut et les données d'un appel.

```typescript
const status = await client.aria.getCallStatus("call_abc123");

console.log(status.transcript);                       // Transcription complète
console.log(status.summary);                          // Résumé IA
console.log(status.extracted_data.qualification_level); // "Chaud" | "Tiède" | "Froid"
```

---

#### `aria.listCalls(params?)`

Liste les appels récents.

```typescript
const { calls, total } = await client.aria.listCalls({
  limit: 20,
  status: "completed",
});
```

---

#### `aria.ingestLead(params)`

Ajoute un prospect à la file d'appels automatique.

```typescript
await client.aria.ingestLead({
  business_name: "Salon Lumière",
  phone_number: "+33612345678",
  city: "Paris",
  pain_point: "Perd des appels le week-end",
  source: "formulaire_site",
});
```

---

### `client.lea` — Agent WhatsApp

#### `lea.sendMessage(params)`

Envoie un message WhatsApp proactif.

```typescript
await client.lea.sendMessage({
  to: "+33612345678",
  message: "Bonjour Jean, Aria a essayé de vous joindre. Êtes-vous disponible ?",
});
```

---

#### `lea.listConversations(params?)`

Liste les conversations WhatsApp actives.

```typescript
const conversations = await client.lea.listConversations({ status: "active" });
```

---

## Webhooks

Recevez les événements RoehAI en temps réel sur votre serveur.

### Avec le `WebhookRouter`

```typescript
import { WebhookRouter } from "@roehai/sdk";
import express from "express";

const app = express();
const router = new WebhookRouter();

router.on("call.completed", async (payload) => {
  const { call_id, summary, extracted_data, prospect_phone } = payload.call_data;
  console.log(`Appel ${call_id} terminé : ${summary}`);
  // Mettre à jour votre CRM ici
});

router.on("call.failed", async (payload) => {
  console.warn(`Appel échoué : ${payload.call_data.reason}`);
});

app.post("/webhooks/roehai", express.json(), async (req, res) => {
  await router.handle(req.body);
  res.sendStatus(200);
});
```

### Événements disponibles

| Événement | Description |
|---|---|
| `call.completed` | Appel terminé — inclut transcript, résumé, données extraites |
| `call.failed` | Appel échoué (occupé, messagerie, numéro invalide) |
| `call.started` | Appel décroché |
| `lead.qualified` | Prospect qualifié par l'agent |
| `whatsapp.message_received` | Message WhatsApp reçu |
| `whatsapp.message_sent` | Message WhatsApp envoyé |

---

## Gestion des erreurs

Toutes les erreurs sont des instances de `RoehAIError` avec un `code` typé.

```typescript
import { RoehAI, RoehAIError } from "@roehai/sdk";

const client = new RoehAI({ apiKey: process.env.ROEHAI_API_KEY! });

try {
  await client.aria.triggerCall({ phone_number: "+33612345678" });
} catch (err) {
  if (err instanceof RoehAIError) {
    switch (err.code) {
      case "unauthorized":   // Clé API invalide
      case "rate_limited":   // Trop de requêtes — attendre avant retry
      case "invalid_params": // Paramètres manquants ou invalides
      case "server_error":   // Erreur côté serveur RoehAI
      case "timeout":        // La requête a dépassé le délai
    }
  }
}
```

---

## Configuration avancée

```typescript
const client = new RoehAI({
  apiKey: "sk_votre_cle",
  baseUrl: "https://www.roehai.com/api/v1", // Par défaut
  timeout: 30_000,                           // ms, par défaut 30s
});
```

---

## Développement local

```bash
# Installer les dépendances
npm install

# Build
npm run build

# Tests
npm test

# Watch mode
npm run dev
```

---

## Liens

- [Portail Développeurs](https://dev.roehai.com)
- [Référence API complète](https://dev.roehai.com/reference)
- [Guide d'intégration](https://dev.roehai.com/quickstart)
- [Support](mailto:dev@roehai.com)
