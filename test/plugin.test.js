import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { apply, createProvider, inject, name } from '../lib/index.js'

const patch = parse(readFileSync(new URL('../cordis.patch.yml', import.meta.url), 'utf8'))
function mock() {
  const sections = []
  const factories = []
  return { sections, factories, ctx: {
    systemPrompt: { section: (section) => sections.push(section) },
    inject: (services, callback) => {
      assert.deepEqual(services, ['skills'])
      callback({ skills: { registerProvider: (factory) => factories.push(factory) } })
    },
  } }
}
test('bundle entry registers a real system prompt section', () => {
  assert.deepEqual(inject, ['systemPrompt'])
  const row = patch[0].insert[0]
  assert.equal(row.name, name)
  const { ctx, sections, factories } = mock()
  apply(ctx, row.config)
  assert.equal(sections.length, 1)
  assert.match(sections[0].text, /Taste Skill/)
  assert.equal(factories.length, 1)
})
test('defaults, overrides and disabled configuration', () => {
  const { ctx, sections, factories } = mock()
  apply(ctx, { enabled: false })
  assert.equal(sections.length, 0)
  assert.equal(factories.length, 0)
  apply(ctx)
  assert.equal(sections[0].order, 420)
  apply(ctx, { text: 'custom {{literal}}', order: 300 })
  assert.equal(sections[1].order, 300)
  assert.ok(!sections[1].text.includes('{{'))
  assert.throws(() => apply(ctx, { order: NaN }), /finite number/)
  assert.throws(() => apply(ctx, { text: 3 }), /string/)
})
test('catalog and full skill content are accessible with resource base', async () => {
  const provider = createProvider()
  const [candidate] = await provider.list()
  assert.equal(candidate.name, 'design-taste-frontend')
  assert.equal(candidate.source, 'bundled')
  assert.equal(candidate.rank, 600)
  assert.equal(candidate.resourceBase.kind, 'directory')
  const skill = await provider.get(candidate)
  assert.ok(skill.content.length > 80000)
  assert.match(skill.content, /BRIEF INFERENCE/)
  assert.equal(await provider.get({ ...candidate, name: 'other' }), undefined)
  assert.equal(await provider.get({ ...candidate, locator: { dir: '../' } }), undefined)
})
