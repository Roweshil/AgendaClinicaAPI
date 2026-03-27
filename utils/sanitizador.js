const escapeHtml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj

  const newObj = {}

  for (const key in obj) {
    const value = obj[key]

    if (typeof value === 'string') {
      newObj[key] = escapeHtml(value.trim())
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      newObj[key] = sanitizeObject(value)
    } else {
      newObj[key] = value
    }
  }

  return newObj
}

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body)
  }
  next()
}

export default sanitizeMiddleware