'use client';

import { useId, useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';

/** Keep detailed content available without making it a long stop on phones. */
export function MobileDisclosure({ label, children }: { label: string; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  return (
    <div className={`mobile-disclosure${expanded ? ' is-expanded' : ''}`}>
      <button type="button" className="mobile-disclosure-toggle" aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded((value) => !value)}>
        {label}<Plus size={18} aria-hidden="true" />
      </button>
      <div id={panelId} className="mobile-disclosure-panel">{children}</div>
    </div>
  );
}
