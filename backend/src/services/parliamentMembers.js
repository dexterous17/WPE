/**
 * Mirrors App\Repository\UserRepository::getMostDelegationsByUser (platform + category scope).
 * DelegationEnum::SCOPE_PLATFORM = 0, SCOPE_CATEGORY = 1.
 */

const SCOPE_PLATFORM = 0;
const SCOPE_CATEGORY = 1;

/**
 * @param {import('pg').Pool} pool
 * @param {number} max
 */
export async function computeParliamentMembers(pool, max) {
  const { rows: categoryRows } = await pool.query(`SELECT id FROM category`);
  const categories = {};
  for (const row of categoryRows) {
    categories[row.id] = null;
  }

  const users = {};

  const { rows: platformRows } = await pool.query(
    `SELECT u.id AS user_id, t.id AS truster_id, t.username AS truster_username
     FROM delegation d
     LEFT JOIN fos_user u ON d.user_id = u.id
     LEFT JOIN fos_user t ON d.truster_id = t.id
     WHERE d.scope = $1`,
    [SCOPE_PLATFORM],
  );

  for (const delegation of platformRows) {
    const uid = delegation.user_id;
    if (uid == null) continue;
    for (const key of Object.keys(categories)) {
      if (!users[uid]) users[uid] = {};
      users[uid][key] = [delegation.truster_id, delegation.truster_username];
    }
  }

  const { rows: categoryScopeRows } = await pool.query(
    `SELECT u.id AS user_id, t.id AS truster_id, t.username AS truster_username, c.id AS category_id
     FROM delegation d
     LEFT JOIN fos_user u ON d.user_id = u.id
     LEFT JOIN fos_user t ON d.truster_id = t.id
     LEFT JOIN category c ON d.category_id = c.id
     WHERE d.scope = $1`,
    [SCOPE_CATEGORY],
  );

  for (const delegation of categoryScopeRows) {
    const uid = delegation.user_id;
    const cid = delegation.category_id;
    if (uid == null || cid == null) continue;
    if (!users[uid]) users[uid] = {};
    users[uid][cid] = [delegation.truster_id, delegation.truster_username];
  }

  const score = {};
  for (const uKey of Object.keys(users)) {
    const byCat = users[uKey];
    for (const cKey of Object.keys(byCat)) {
      const truster = byCat[cKey];
      if (!truster || truster[0] == null) continue;
      const tid = truster[0];
      if (!score[tid]) {
        score[tid] = {
          id: truster[0],
          username: truster[1],
          score: 0,
        };
      }
      score[tid].score += 1;
    }
  }

  const sorted = Object.values(score).sort((a, b) =>
    a.score > b.score ? -1 : a.score < b.score ? 1 : 0,
  );

  return sorted.slice(0, max);
}
