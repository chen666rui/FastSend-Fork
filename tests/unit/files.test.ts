import { describe, expect, it } from 'vitest'
import { fileMapWithoutRoot } from '../../app/utils/files'

describe('fileMapWithoutRoot', () => {
  it('去掉根目录段', () => {
    const map: any = {
      'root/a.txt': { paths: ['root', 'a.txt'], size: 1, lastModified: 1, file: null }
    }
    const res = fileMapWithoutRoot(map)
    expect(res['a.txt']).toBeDefined()
    expect(res['a.txt'].paths).toEqual(['a.txt'])
  })
})