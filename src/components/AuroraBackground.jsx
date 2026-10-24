// Nền aurora: các vệt sáng lớn trôi chậm (CSS thuần, nhẹ cho điện thoại) + viền tối ở rìa
export default function AuroraBackground() {
  return (
    <>
      <div className="aurora" aria-hidden="true">
        <div className="blob blob--1" />
        <div className="blob blob--2" />
        <div className="blob blob--3" />
      </div>
      <div className="vignette" aria-hidden="true" />
    </>
  )
}
