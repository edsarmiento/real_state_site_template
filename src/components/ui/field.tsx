import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";
const controlClass =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100";

type FieldShellProps = {
  id: string;
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  children: ReactNode;
};

/** Label + control wrapper. Use it directly when the control is custom. */
export function FieldShell({
  id,
  label,
  required,
  hint,
  children,
}: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>
      {children}
      {hint ? (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      ) : null}
    </div>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
};

export function TextField({
  id,
  label,
  hint,
  required,
  className,
  ...rest
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint}>
      <input
        id={id}
        required={required}
        className={`${controlClass} ${className ?? ""}`}
        {...rest}
      />
    </FieldShell>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
};

export function SelectField({
  id,
  label,
  hint,
  required,
  className,
  children,
  ...rest
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint}>
      <select
        id={id}
        required={required}
        className={`${controlClass} ${className ?? ""}`}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
};

export function TextAreaField({
  id,
  label,
  hint,
  required,
  className,
  ...rest
}: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint}>
      <textarea
        id={id}
        required={required}
        className={`${controlClass} ${className ?? ""}`}
        {...rest}
      />
    </FieldShell>
  );
}
