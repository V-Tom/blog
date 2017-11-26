'use strict'

/**
 * readonly
 * @param target
 * @param name
 * @param discriptor
 * @returns {*}
 */
export function readonly(target, name, discriptor) {
  discriptor.writable = false
  return discriptor
}