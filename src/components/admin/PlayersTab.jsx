// Danh sách người đã chơi; game = state hiện tại, prizes = danh sách quà
export default function PlayersTab({ game, prizes }) {
  const rows = Object.entries(game?.assignments ?? {})
    .map(([key, a]) => ({ key, ...a }))
    .sort((a, b) => a.drawnAt - b.drawnAt)
  const prizeName = (id) => prizes.find((p) => p.id === id)?.name ?? '(đã xóa)'
  const remaining = game?.remaining?.length ?? 0

  return (
    <div className="admin-section">
      <p className="admin-note">Còn {remaining} quà chưa ai bốc</p>
      {rows.length === 0 ? (
        <p className="admin-empty">Chưa ai chơi</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Tên</th><th>Quà</th><th>Giờ quay</th><th>Lời chúc</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td>{r.name}</td>
                  <td>{prizeName(r.prizeId)}</td>
                  <td>{new Date(r.drawnAt).toLocaleString('vi-VN')}</td>
                  <td>{r.wish}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
