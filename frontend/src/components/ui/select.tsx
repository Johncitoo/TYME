// src/components/ui/select.tsx
import React from 'react';

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} />;
}
export function SelectOption(props: React.OptionHTMLAttributes<HTMLOptionElement>) {
  return <option {...props} />;
}
