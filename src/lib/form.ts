export async function submitLead(endpoint: string, email: string): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) return { ok: false, message: 'Не удалось отправить. Попробуйте позже.' };
    return { ok: true, message: 'Спасибо! Проверьте почту — мы прислали материалы.' };
  } catch {
    return { ok: false, message: 'Ошибка сети. Попробуйте ещё раз.' };
  }
}






