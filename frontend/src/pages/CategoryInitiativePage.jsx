import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { symfonyUrl } from "../config/symfonyLegacy";

const PAGE_SIZE = 25;

function buildSearchBody({
  draw,
  start,
  length,
  search,
  orderColumn,
  orderDir,
}) {
  return {
    draw,
    start,
    length,
    search: { value: search },
    columns: [
      { data: "title" },
      { data: "createdBy.username" },
      { data: "createdAt" },
      { data: "voteStatus", orderable: false },
    ],
    order: [{ column: orderColumn, dir: orderDir }],
  };
}

export default function CategoryInitiativePage() {
  const { type, id, slug } = useParams();
  const legacyPath = `/category/${type}/${id}/${slug}`;

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({
    recordsTotal: 0,
    recordsFiltered: 0,
    draw: 1,
  });
  const [start, setStart] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [orderColumn, setOrderColumn] = useState(0);
  const [orderDir, setOrderDir] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const apiUrl = useMemo(() => {
    if (!type || !id || !slug) return null;
    const encSlug = encodeURIComponent(slug);
    return `/api/v1/category/${type}/${id}/${encSlug}/search`;
  }, [type, id, slug]);

  useEffect(() => {
    if (!apiUrl) return;
    let cancelled = false;
    const body = buildSearchBody({
      draw: 1,
      start,
      length: PAGE_SIZE,
      search: appliedSearch,
      orderColumn,
      orderDir,
    });
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (cancelled) return;
        if (!r.ok || j.error) {
          setErr(String(j.error || r.statusText || "Request failed"));
          setRows([]);
          return;
        }
        setErr(null);
        setRows(Array.isArray(j.items) ? j.items : []);
        setMeta({
          recordsTotal: j.recordsTotal ?? 0,
          recordsFiltered: j.recordsFiltered ?? 0,
          draw: j.draw ?? 1,
        });
      })
      .catch((e) => {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : "Request failed");
          setRows([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiUrl, appliedSearch, orderColumn, orderDir, start]);

  const onSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setStart(0);
    setAppliedSearch(searchInput);
  };

  const maxStart = Math.max(0, meta.recordsFiltered - PAGE_SIZE);
  const canPrev = start > 0;
  const canNext = start + PAGE_SIZE < meta.recordsFiltered;

  const headingType =
    type === "future"
      ? "Proposals"
      : type === "current"
        ? "Votes"
        : type === "program"
          ? "Program"
          : type === "past"
            ? "Archive"
            : "Initiatives";

  return (
    <article className="category-initiatives-page">
      <h1>
        {headingType} — <span className="muted">{slug?.replace(/-/g, " ")}</span>
      </h1>
      <p className="lead">
        Initiatives in this category (type <code>{type}</code>), loaded from{" "}
        <code>/api/v1/category/…/search</code> with the same DataTables-style payload as Symfony.
      </p>

      <form className="assembly-search" onSubmit={onSearch} role="search">
        <label htmlFor="cat-q">Search title, description, or author</label>
        <div className="assembly-search-row">
          <input
            id="cat-q"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search…"
            autoComplete="off"
          />
          <button type="submit">Search</button>
        </div>
      </form>

      <div className="category-toolbar">
        <label>
          Sort by{" "}
          <select
            value={orderColumn}
            onChange={(e) => {
              setLoading(true);
              setStart(0);
              setOrderColumn(Number(e.target.value));
            }}
          >
            <option value={0}>Title</option>
            <option value={1}>Creator</option>
            <option value={2}>Date</option>
          </select>
        </label>
        <label>
          Direction{" "}
          <select
            value={orderDir}
            onChange={(e) => {
              setLoading(true);
              setStart(0);
              setOrderDir(e.target.value);
            }}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      <p className="muted">
        Showing {rows.length ? start + 1 : 0}–{Math.min(start + PAGE_SIZE, meta.recordsFiltered)} of{" "}
        {meta.recordsFiltered} matching ({meta.recordsTotal} total in this category and type).
      </p>

      {err ? <p className="error">{err}</p> : null}
      {loading ? <p>Loading…</p> : null}

      {!loading && !err && rows.length === 0 ? <p>No initiatives found.</p> : null}

      {!loading && rows.length > 0 ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Creator</th>
                <th>Created</th>
                <th>Vote</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link to={`/initiative/${row.id}/${row.slug}`}>{row.title}</Link>
                  </td>
                  <td>
                    {row.createdBy?.id != null ? (
                      <Link to={`/user/${row.createdBy.id}/profile`}>
                        {row.createdBy.username ?? "—"}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{row.createdAt ?? "—"}</td>
                  <td>
                    {row.voteStatus === "now" ? (
                      <span className="badge badge-now">NOW</span>
                    ) : row.voteStatus === "soon" ? (
                      <span className="badge badge-soon">SOON</span>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="pager">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => {
            setLoading(true);
            setStart((s) => Math.max(0, s - PAGE_SIZE));
          }}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => {
            setLoading(true);
            setStart((s) => Math.min(maxStart, s + PAGE_SIZE));
          }}
        >
          Next
        </button>
      </div>

      <p className="classic-link">
        <a href={symfonyUrl(legacyPath)}>Open classic category page (Twig + DataTables)</a>
      </p>
    </article>
  );
}
