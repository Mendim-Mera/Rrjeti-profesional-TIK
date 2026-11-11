const { initializeApp } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

initializeApp();
const TOPIC = "updates";
const SITE_URL = "https://mendim-mera.github.io/Rrjeti-profesional-TIK/";

/* Çdo pajisje që aktivizon njoftimet shkruan tokenin te deviceTokens/{token};
   këtu e abonojmë automatikisht në temën "updates". */
exports.onTokenCreated = onDocumentCreated("deviceTokens/{token}", async (event) => {
  const token = event.params.token;
  try {
    await getMessaging().subscribeToTopic([token], TOPIC);
  } catch (err) {
    console.error("subscribeToTopic gabim:", err);
  }
});

/* Trajnim i ri -> njoftim */
exports.onSessionCreated = onDocumentCreated("sessions/{id}", async (event) => {
  const s = event.data?.data();
  if (!s) return;
  await getMessaging().send({
    topic: TOPIC,
    notification: {
      title: "📅 Trajnim i ri",
      body: s.title ? `${s.title}${s.date ? " – " + s.date : ""}` : "U hap një trajnim i ri.",
    },
    webpush: { fcmOptions: { link: SITE_URL } },
  }).catch((err) => console.error("send gabim (session):", err));
});

/* Material i ri -> njoftim */
exports.onMaterialCreated = onDocumentCreated("materials/{id}", async (event) => {
  const m = event.data?.data();
  if (!m) return;
  await getMessaging().send({
    topic: TOPIC,
    notification: {
      title: "📎 Material i ri",
      body: m.title || "U shtua një material i ri.",
    },
    webpush: { fcmOptions: { link: SITE_URL } },
  }).catch((err) => console.error("send gabim (material):", err));
});
