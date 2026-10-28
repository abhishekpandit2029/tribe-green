import type { ReactNode } from "react";

export function FormField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      {label}
      {children}
    </label>
  );
}

export function CheckboxGroup({
  legend,
  name,
  options,
  checked,
}: {
  legend: string;
  name: string;
  options: { value: string; id: string; checked?: boolean }[];
  checked?: (option: { value: string; id: string }) => boolean;
}) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className="check-grid">
        {options.map((option) => (
          <label className="check-label" key={option.id}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={checked?.(option) ?? option.checked}
            />
            <span>{option.value}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
