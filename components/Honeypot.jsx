'use client';

// Hidden field that people never see or fill in. Automated form fillers usually do, and the server then drops the submission.
export default function Honeypot({ value, onChange }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
    >
      <label>
        Leave this field empty
        <input
          type="text"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
