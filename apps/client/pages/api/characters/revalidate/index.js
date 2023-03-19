export default async function handler(req, res) {
  try {
    await res.revalidate(`/characters/${req.query.id}`);
    return res.json({ revalidated: true });
  } catch (error) {
    return res.status(500).send("Error revalidating");
  }
}
