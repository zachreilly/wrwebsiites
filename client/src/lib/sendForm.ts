// Sends a website form to /send.php, which emails it to the business inbox.
// `form` names which form it came from (it goes in the email subject).
export async function sendForm(form: string, data: Record<string, unknown>) {
  const res = await fetch("/send.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form, data }),
  });

  let body: { success?: boolean; message?: string } = {};
  try {
    body = await res.json();
  } catch {
    // not JSON - fall through to the generic error below
  }

  if (!res.ok || !body.success) {
    throw new Error(
      body.message || "Sorry, something went wrong. Please try again or email us directly.",
    );
  }
  return body;
}
