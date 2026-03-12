import { useMemo, useState } from 'react';

const templateStyles = {
  classic: {
    name: 'Classic',
    cardBorderRadius: '14px',
    bodyBg: '#ffffff',
    sectionStyle: 'solid'
  },
  modern: {
    name: 'Modern',
    cardBorderRadius: '28px',
    bodyBg: '#f7f8fb',
    sectionStyle: 'glass'
  },
  minimal: {
    name: 'Minimal',
    cardBorderRadius: '8px',
    bodyBg: '#fefefe',
    sectionStyle: 'clean'
  }
};

const defaultFeeRows = [
  { label: 'Tuition Fee', amount: '1500' },
  { label: 'Transport Fee', amount: '300' },
  { label: 'Library Fee', amount: '120' }
];

function App() {
  const [config, setConfig] = useState({
    schoolName: 'Sunrise Public School',
    schoolAddress: '123 Learning Street, New Delhi',
    templateKey: 'classic',
    headerColor: '#1a4e9b',
    footerColor: '#0f2d5a',
    accentColor: '#e8efff',
    logoUrl: '',
    slipTitle: 'Monthly Fee Slip',
    studentName: 'Aarav Sharma',
    className: 'Grade 8 - A',
    rollNumber: '27',
    receiptNumber: 'RCP-2026-0142',
    issueDate: '2026-03-05',
    dueDate: '2026-03-15',
    note: 'Please pay by due date to avoid late charges.'
  });

  const [feeRows, setFeeRows] = useState(defaultFeeRows);

  const totals = useMemo(() => {
    const total = feeRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
    const tax = Math.round(total * 0.05 * 100) / 100;
    return {
      subtotal: total,
      tax,
      grandTotal: total + tax
    };
  }, [feeRows]);

  const activeTemplate = templateStyles[config.templateKey];

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateFeeRow = (index, key, value) => {
    setFeeRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  const addFeeRow = () => {
    setFeeRows((prev) => [...prev, { label: 'New Fee Item', amount: '0' }]);
  };

  const removeFeeRow = (index) => {
    setFeeRows((prev) => prev.filter((_, i) => i !== index));
  };

  const onLogoUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateConfig('logoUrl', String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="page">
      <aside className="panel">
        <h1>Fee Slip Template Builder</h1>
        <p>Create customizable fee slips for different schools.</p>

        <section>
          <h2>School Branding</h2>
          <label>
            School Name
            <input value={config.schoolName} onChange={(e) => updateConfig('schoolName', e.target.value)} />
          </label>
          <label>
            School Address
            <input value={config.schoolAddress} onChange={(e) => updateConfig('schoolAddress', e.target.value)} />
          </label>
          <label>
            Logo Upload
            <input type="file" accept="image/*" onChange={(e) => onLogoUpload(e.target.files?.[0])} />
          </label>
          <label>
            Logo URL (optional)
            <input value={config.logoUrl} onChange={(e) => updateConfig('logoUrl', e.target.value)} placeholder="https://..." />
          </label>
        </section>

        <section>
          <h2>Template Styling</h2>
          <label>
            Template Design
            <select value={config.templateKey} onChange={(e) => updateConfig('templateKey', e.target.value)}>
              {Object.entries(templateStyles).map(([key, template]) => (
                <option key={key} value={key}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>
          <div className="colors">
            <label>
              Header Color
              <input type="color" value={config.headerColor} onChange={(e) => updateConfig('headerColor', e.target.value)} />
            </label>
            <label>
              Footer Color
              <input type="color" value={config.footerColor} onChange={(e) => updateConfig('footerColor', e.target.value)} />
            </label>
            <label>
              Accent Color
              <input type="color" value={config.accentColor} onChange={(e) => updateConfig('accentColor', e.target.value)} />
            </label>
          </div>
        </section>

        <section>
          <h2>Slip Details</h2>
          <label>
            Slip Title
            <input value={config.slipTitle} onChange={(e) => updateConfig('slipTitle', e.target.value)} />
          </label>
          <label>
            Student Name
            <input value={config.studentName} onChange={(e) => updateConfig('studentName', e.target.value)} />
          </label>
          <label>
            Class
            <input value={config.className} onChange={(e) => updateConfig('className', e.target.value)} />
          </label>
          <label>
            Roll Number
            <input value={config.rollNumber} onChange={(e) => updateConfig('rollNumber', e.target.value)} />
          </label>
          <label>
            Receipt Number
            <input value={config.receiptNumber} onChange={(e) => updateConfig('receiptNumber', e.target.value)} />
          </label>
          <label>
            Issue Date
            <input type="date" value={config.issueDate} onChange={(e) => updateConfig('issueDate', e.target.value)} />
          </label>
          <label>
            Due Date
            <input type="date" value={config.dueDate} onChange={(e) => updateConfig('dueDate', e.target.value)} />
          </label>
          <label>
            Footer Note
            <textarea value={config.note} onChange={(e) => updateConfig('note', e.target.value)} rows={3} />
          </label>
        </section>

        <section>
          <h2>Fee Details</h2>
          {feeRows.map((row, index) => (
            <div className="fee-row-editor" key={`${row.label}-${index}`}>
              <input value={row.label} onChange={(e) => updateFeeRow(index, 'label', e.target.value)} />
              <input value={row.amount} onChange={(e) => updateFeeRow(index, 'amount', e.target.value)} type="number" min="0" />
              <button type="button" onClick={() => removeFeeRow(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addFeeRow}>
            + Add Fee Item
          </button>
        </section>
      </aside>

      <main className="preview-wrap">
        <article
          className={`slip-card ${activeTemplate.sectionStyle}`}
          style={{ borderRadius: activeTemplate.cardBorderRadius, backgroundColor: activeTemplate.bodyBg }}
        >
          <header className="slip-header" style={{ backgroundColor: config.headerColor }}>
            <div className="logo-wrap">
              {config.logoUrl ? <img src={config.logoUrl} alt="School logo" /> : <div className="logo-placeholder">LOGO</div>}
            </div>
            <div>
              <h2>{config.schoolName}</h2>
              <p>{config.schoolAddress}</p>
              <h3>{config.slipTitle}</h3>
            </div>
          </header>

          <section className="student-meta" style={{ backgroundColor: config.accentColor }}>
            <p>
              <strong>Student:</strong> {config.studentName}
            </p>
            <p>
              <strong>Class:</strong> {config.className}
            </p>
            <p>
              <strong>Roll #:</strong> {config.rollNumber}
            </p>
            <p>
              <strong>Receipt #:</strong> {config.receiptNumber}
            </p>
            <p>
              <strong>Issue:</strong> {config.issueDate}
            </p>
            <p>
              <strong>Due:</strong> {config.dueDate}
            </p>
          </section>

          <table>
            <thead>
              <tr>
                <th>Fee Component</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {feeRows.map((row, index) => (
                <tr key={`${row.label}-preview-${index}`}>
                  <td>{row.label}</td>
                  <td>{Number(row.amount || 0).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td>Subtotal</td>
                <td>{totals.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Tax (5%)</td>
                <td>{totals.tax.toFixed(2)}</td>
              </tr>
              <tr className="grand-total">
                <td>Grand Total</td>
                <td>{totals.grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <footer className="slip-footer" style={{ backgroundColor: config.footerColor }}>
            <p>{config.note}</p>
          </footer>
        </article>
      </main>
    </div>
  );
}

export default App;
