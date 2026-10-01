import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

export const name = 'dsh-taste-skill'
export const inject = ['systemPrompt']
const skillDir = fileURLToPath(new URL('../skills/taste-skill/', import.meta.url))
const skillPath = fileURLToPath(new URL('../skills/taste-skill/SKILL.md', import.meta.url))

function readSkill() {
  const raw = readFileSync(skillPath, 'utf8').replaceAll('\r\n', '\n')
  const boundary = raw.indexOf('\n---\n', 4)
  if (!raw.startsWith('---\n') || boundary < 0) throw new Error('Invalid Taste Skill frontmatter')
  const metadata = parse(raw.slice(4, boundary))
  if (typeof metadata.name !== 'string' || typeof metadata.description !== 'string') {
    throw new Error('Taste Skill name and description are required')
  }
  return { ...metadata, content: raw.slice(boundary + 5).trim() }
}

export function createProvider() {
  return {
    name,
    async list() {
      const skill = readSkill()
      return [{
        name: skill.name,
        description: skill.description,
        invocation: { modelInvocable: true, userInvocable: true },
        source: 'bundled',
        provider: name,
        rank: 600,
        locator: { dir: skillDir },
        resourceBase: { kind: 'directory', path: skillDir },
        path: skillPath,
      }]
    },
    async get(candidate) {
      const skill = readSkill()
      if (candidate?.name !== skill.name || candidate?.provider !== name || candidate?.locator?.dir !== skillDir) return undefined
      return { ...candidate, content: skill.content }
    },
  }
}

export function apply(ctx, config = {}) {
  if (config.enabled === false) return
  const defaults = parse(readFileSync(new URL('../cordis.patch.yml', import.meta.url), 'utf8'))[0].insert[0].config
  const order = config.order ?? defaults.order
  const text = config.text ?? defaults.text
  if (typeof order !== 'number' || !Number.isFinite(order)) throw new TypeError('order must be a finite number')
  if (typeof text !== 'string') throw new TypeError('text must be a string')
  // DSH interprets double braces as prompt variables; protect literal examples.
  ctx.systemPrompt.section({ name, order, text: text.replaceAll('{{', '{​{') })
  ctx.inject(['skills'], (host) => {
    host.skills.registerProvider(() => createProvider())
  })
}
