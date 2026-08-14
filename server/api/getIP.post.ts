export default defineEventHandler((event) => {
  return getRequestIP(event, { xForwardedFor: true })
})
