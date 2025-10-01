export async function getMessages(locale: string) {
const messages = await import(`@/i18n/messages/${locale}.json`)
return messages.default
}