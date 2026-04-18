/**
 * Mirrors DefaultController::assemblySearchAction + UserRepository::assemblySearch / countAllUsers.
 */

/** @type {Record<string, string>} */
const ORDER_COL = {
  id: "u.id",
  username: "u.username",
  country: "u.country",
  city: "u.city",
  registeredAt: "u.registered_at",
};

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

/**
 * @param {import('pg').Pool} pool
 * @param {Record<string, unknown>} body DataTables POST body (express.urlencoded extended)
 */
export async function runAssemblySearch(pool, body) {
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
  const order0 = orderArr[0] || { column: 1, dir: "asc" };
  const colIdx = toInt(order0.column, 1);
  const orderDir =
    String(order0.dir || "asc").toLowerCase() === "desc" ? "DESC" : "ASC";
  const colData =
    columns[colIdx] && typeof columns[colIdx] === "object"
      ? String(columns[colIdx].data || "username")
      : "username";
  const orderSql = ORDER_COL[colData] || "u.username";

  const params = [];
  let whereExtra = "";
  if (searchValue.trim() !== "") {
    params.push(`%${searchValue.toLowerCase()}%`);
    whereExtra = ` AND (LOWER(u.username) LIKE $1 OR LOWER(COALESCE(u.city, '')) LIKE $1)`;
  }

  const totalSql = `SELECT COUNT(*)::int AS c FROM fos_user u WHERE u.enabled = true`;
  const { rows: totalRows } = await pool.query(totalSql);
  const recordsTotal = totalRows[0]?.c ?? 0;

  const filterSql = `
    SELECT COUNT(*)::int AS c FROM fos_user u
    WHERE u.enabled = true${whereExtra}
  `;
  const { rows: filterRows } = await pool.query(
    filterSql,
    params.length ? params : [],
  );
  const recordsFiltered = filterRows[0]?.c ?? 0;

  const listSql = `
    SELECT u.id, u.username, u.country, u.city, u.registered_at, u.gender
    FROM fos_user u
    WHERE u.enabled = true${whereExtra}
    ORDER BY ${orderSql} ${orderDir}
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;
  const listParams = [...params, length, start];
  const { rows } = await pool.query(listSql, listParams);

  const items = rows.map((r) => ({
    id: r.id,
    username: r.username,
    country: r.country,
    city: r.city,
    gender: r.gender,
    mobileNumber: null,
    registeredAt: formatDt(r.registered_at),
  }));

  return {
    draw,
    recordsTotal,
    recordsFiltered,
    items,
  };
}

function toInt(v, d) {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : d;
}

function formatDt(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
