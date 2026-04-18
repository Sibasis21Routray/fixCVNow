// lib/utils/groupExperience.js
//
// Groups consecutive experience entries by company name.
// Handles two cases:
//   1. Same company + different roles (promotions) → nested positions under one company header
//   2. Same company + same role (continuous)       → merged into one entry with combined date range

function normalize(str) {
  return (str || '').trim().toLowerCase()
}

function mergeIdenticalRoles(positions) {
  const merged = []
  for (const pos of positions) {
    const last = merged[merged.length - 1]
    if (last && normalize(last.role) === normalize(pos.role)) {
      // Same role — extend start date, merge and dedupe descriptions
      last.start = pos.start
      const combined = [...(pos.description || []), ...(last.description || [])]
      last.description = [...new Set(combined)].filter(Boolean)
    } else {
      merged.push({ ...pos })
    }
  }
  return merged
}

/**
 * @param {Array} experience  Flat experience array from resume data
 * @returns {Array} Array of company groups:
 *   {
 *     company: string,
 *     positions: Position[],   // merged/deduped
 *     overallStart: string,    // earliest start across all positions
 *     overallEnd: string|null, // latest end (null = Present)
 *     isSingleRole: boolean,   // true → render as today; false → show company header + nested roles
 *   }
 */
export function groupExperience(experience = []) {
  if (!experience?.length) return []

  // Step 1: group consecutive entries by company name
  const groups = []
  for (const entry of experience) {
    const last = groups[groups.length - 1]
    if (last && normalize(last.company) === normalize(entry.company)) {
      last.positions.push(entry)
    } else {
      groups.push({ company: entry.company, positions: [entry] })
    }
  }

  // Step 2: within each group, merge identical role names
  return groups.map(group => {
    const positions = mergeIdenticalRoles(group.positions)
    return {
      company: group.company,
      positions,
      overallStart: positions[positions.length - 1]?.start ?? '',
      overallEnd: positions[0]?.end ?? null,
      isSingleRole: positions.length === 1,
    }
  })
}
