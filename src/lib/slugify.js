import slugify from 'slugify'

export default function slugifyToLowercase(slug = '') {
  return slugify(slug).toLowerCase()
}
