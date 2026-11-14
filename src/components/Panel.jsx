export default function Panel({ step, title, description, children }) {
  return (
    <section className="panel" aria-labelledby={`panel-${step}`}>
      <div className="panel-head">
        <span className="step-stamp" aria-hidden="true">
          {step}
        </span>
        <div>
          <h2 id={`panel-${step}`} className="section-title">
            {title}
          </h2>
          {description ? <p className="section-sub">{description}</p> : null}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
