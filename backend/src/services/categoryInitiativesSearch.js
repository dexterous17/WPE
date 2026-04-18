/**
 * Mirrors CategoryController::listCategorySearchAction + InitiativeRepository
 * (searchCategoryType / countAllTypeInitiatives). Response matches createApiResponse envelope.
 */

/** @type {Record<string, number>} */
const TYPE_NAME_TO_INT = {
  future: 0,
  current: 1,
  past: 2,
  program: 3,
};

/** InitiativeEnum: STATE_ACTIVE=1, STATE_FINISHED=2 */
function stateForTypeName(typeName) {
  return typeName === "past" || typeName === "program" ? 2 : 1;
}

function normalizeArrayish(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    return Object.keys(raw)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => raw[k]);
  }
  return [];
}

function toInt(v, d) {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : d;
}

/** Maps DataTables column `data` to SQL ORDER BY expression (whitelist only). */
const ORDER_COL = {
  title: "i.title",
  "createdBy.username": "c.username",
  createdAt: "i.created_at",
  voteStatus: "i.title",
};

/**
 * @param {import('pg').Pool} pool
 * @param {{
 *   typeName: string,
 *   categoryId: number,
 *   slug: string,
 *   body: Record<string, unknown>,
 * }} args
 */
export async function runCategoryInitiativesSearch(pool, args) {
  const { typeName, categoryId, slug, body } = args;
  const initiativeType = TYPE_NAME_TO_INT[typeName];
  if (initiativeType === undefined) {
    return { error: "Invalid type", status: 400 };
  }
  if (!Number.isFinite(categoryId) || categoryId <= 0) {
    return { error: "Invalid category id", status: 400 };
  }

  const { rows: catRows } = await pool.query(
    `SELECT id, slug FROM category WHERE id = $1`,
    [categoryId],
  );
  const cat = catRows[0];
  if (!cat) {
    return { error: "Category not found", status: 404 };
  }
  if (slug && String(cat.slug) !== String(slug)) {
    return { error: "Category slug mismatch", status: 404 };
  }

  const state = stateForTypeName(typeName);

  const draw = toInt(body.draw, 1);
  const start = toInt(body.start, 0);
  const length = Math.min(500, Math.max(1, toInt(body.length, 10)));
  const search = body.search;
  const searchValue =
    search && typeof search === "object" && "value" in search
      ? String(search.value ?? "")
      : "";

  const columns = normalizeArrayish(body.columns);
  const orderArr = normalizeArrayish(body.order);
  const order0 = orderArr[0] || { column: 0, dir: "asc" };
  const colIdx = toInt(order0.column, 0);
  const orderDir =
    String(order0.dir || "asc").toLowerCase() === "desc" ? "DESC" : "ASC";
  const colData =
    columns[colIdx] && typeof columns[colIdx] === "object"
      ? String(columns[colIdx].data || "title")
      : "title";
  const orderSql = ORDER_COL[colData] || "i.title";

  const voteStatusExpr = `
    CASE
      WHEN i.type = 0 AND i.state = 1 THEN
        CASE (SELECT v.state FROM voting v WHERE v.initiative_id = i.id AND v.type = 0 ORDER BY v.id ASC LIMIT 1)
          WHEN 0 THEN 'soon'
          WHEN 1 THEN 'now'
          ELSE ''
        END
      WHEN i.type = 1 AND i.state = 1 THEN
        CASE (SELECT v.state FROM voting v WHERE v.initiative_id = i.id AND v.type = 1 ORDER BY v.id ASC LIMIT 1)
          WHEN 0 THEN 'soon'
          WHEN 1 THEN 'now'
          ELSE ''
        END
      ELSE ''
    END`;

  const baseWhere = `i.category_id = $1 AND i.type = $2 AND i.state = $3`;
  const baseParams = [categoryId, initiativeType, state];

  const { rows: totalRows } = await pool.query(
    `SELECT COUNT(*)::int AS c FROM initiative i WHERE ${baseWhere}`,
    baseParams,
  );
  const recordsTotal = totalRows[0]?.c ?? 0;

  let whereFiltered = baseWhere;
  const listParams = [...baseParams];
  if (searchValue.trim() !== "") {
    const p = `%${searchValue.toLowerCase()}%`;
    listParams.push(p);
    const idx = listParams.length;
    whereFiltered += ` AND (
      LOWER(i.title) LIKE $${idx}
      OR LOWER(COALESCE(i.description, '')) LIKE $${idx}
      OR LOWER(c.username) LIKE $${idx}
    )`;
  }

  const countFilteredSql = `
    SELECT COUNT(*)::int AS c
    FROM initiative i
    JOIN fos_user c ON c.id = i.created_by
    WHERE ${whereFiltered}
  `;
  const { rows: filteredRows } = await pool.query(countFilteredSql, listParams);
  const recordsFiltered = filteredRows[0]?.c ?? 0;

  const listSql = `
    SELECT
      i.id,
      i.title,
      i.slug,
      i.created_at AS "createdAt",
      c.id AS creator_id,
      c.username AS creator_username,
      (${voteStatusExpr}) AS vote_status
    FROM initiative i
    JOIN fos_user c ON c.id = i.created_by
    WHERE ${whereFiltered}
    ORDER BY ${orderSql} ${orderDir}
    LIMIT $${listParams.length + 1} OFFSET $${listParams.length + 2}
  `;
  const listParamsPaged = [...listParams, length, start];
  const { rows } = await pool.query(listSql, listParamsPaged);

  const items = rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    createdAt: formatDt(r.createdAt),
    createdBy: {
      id: r.creator_id,
      username: r.creator_username,
    },
    voteStatus: r.vote_status || "",
  }));

  return {
    json: {
      draw,
      recordsTotal,
      recordsFiltered,
      items,
    },
  };
}

function formatDt(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
