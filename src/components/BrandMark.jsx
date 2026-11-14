export default function BrandMark() {
  return (
    <header className="brand">
      <div className="logo-wrap">
        <div className="logo-stage" aria-hidden="true">
          <span className="fan-card" />
          <span className="fan-card" />
          <span className="fan-card" />
          <span className="fan-card" />
          <span className="fan-card" />
        </div>
        <h1 className="wordmark">
          <span className="wordmark-text" aria-hidden="true">
            SPLIT
          </span>
          <span className="wordmark-symbol" aria-hidden="true">
            ÷
          </span>
          <span className="sr-only">Split Bill</span>
        </h1>
      </div>
      <p className="ribbon">BAGI TAGIHAN TANPA RIBET</p>
      <p className="brand-note">
        Isi teman, item, dan biaya tambahan. Pembagian dihitung langsung.
      </p>
    </header>
  );
}
