import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import {
  APP_SUBTITLE,
  APP_TITLE,
  ENERGY_FIELD_HELP,
  ENERGY_FIELD_LABEL,
  FORM_SUBMIT_LABEL,
  FORM_TITLE,
  IDEAL_WEIGHT_FIELD_LABEL,
  IDEAL_WEIGHT_HELP,
  profileLabelFor,
  PROFILE_FIELD_LABEL,
  PROFILE_GUIDANCE,
  speciesOptionLabelFor,
  SPECIES_FIELD_LABEL,
} from '../copy/calculator';
import type { PetProfile, Species } from '../domain/petProfile';
import styles from './CalculatorForm.module.css';

interface CalculatorFormProperties {
  readonly species: Species;
  readonly profile: PetProfile;
  readonly rawWeight: string;
  readonly rawEnergy: string;
  readonly supportedProfiles: readonly PetProfile[];
  readonly weightError: string | null;
  readonly energyError: string | null;
  readonly changeSpecies: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly changeProfile: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly changeWeight: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly changeEnergy: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly submitCalculation: (event: FormEvent<HTMLFormElement>) => void;
}

/** Accessible four-field form defined by docs/prd.md > Fluxo. */
export function CalculatorForm(properties: CalculatorFormProperties): React.JSX.Element {
  return (
    <form
      className={styles.form}
      aria-labelledby="calculator-form-title"
      noValidate
      onSubmit={properties.submitCalculation}
    >
      <header className={styles.heading}>
        <h1 id="calculator-form-title">{APP_TITLE}</h1>
        <p>{APP_SUBTITLE}</p>
        <span>{FORM_TITLE}</span>
      </header>
      <div className={styles.grid}>
        {speciesField(properties, '01')}
        {weightField(properties, '02')}
        {profileField(properties, '03')}
        {energyField(properties, '04')}
      </div>
      <button className={styles.submit} type="submit">
        {FORM_SUBMIT_LABEL}
      </button>
    </form>
  );
}

function speciesField(properties: CalculatorFormProperties, step: string): ReactNode {
  return fieldGroup(
    'species',
    step,
    SPECIES_FIELD_LABEL,
    <select id="species" value={properties.species} onChange={properties.changeSpecies}>
      <option value="dog">{speciesOptionLabelFor('dog')}</option>
      <option value="cat">{speciesOptionLabelFor('cat')}</option>
    </select>,
  );
}

function weightField(properties: CalculatorFormProperties, step: string): ReactNode {
  return fieldGroup(
    'ideal-weight',
    step,
    IDEAL_WEIGHT_FIELD_LABEL,
    <input
      id="ideal-weight"
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={properties.rawWeight}
      aria-describedby="ideal-weight-help ideal-weight-error"
      aria-invalid={properties.weightError !== null}
      onChange={properties.changeWeight}
    />,
    <>
      <p id="ideal-weight-help" className={styles.help}>
        {IDEAL_WEIGHT_HELP}
      </p>
      {fieldError('ideal-weight-error', properties.weightError)}
    </>,
  );
}

function profileField(properties: CalculatorFormProperties, step: string): ReactNode {
  return fieldGroup(
    'profile',
    step,
    PROFILE_FIELD_LABEL,
    <select
      id="profile"
      value={properties.profile}
      aria-describedby="profile-help"
      onChange={properties.changeProfile}
    >
      {properties.supportedProfiles.map((profile) => (
        <option key={profile} value={profile}>
          {profileLabelFor(profile)}
        </option>
      ))}
    </select>,
    <p id="profile-help" className={styles.help}>
      {PROFILE_GUIDANCE}
    </p>,
  );
}

function energyField(properties: CalculatorFormProperties, step: string): ReactNode {
  return fieldGroup(
    'metabolizable-energy',
    step,
    ENERGY_FIELD_LABEL,
    <input
      id="metabolizable-energy"
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={properties.rawEnergy}
      aria-describedby="energy-help energy-error"
      aria-invalid={properties.energyError !== null}
      onChange={properties.changeEnergy}
    />,
    <>
      <p id="energy-help" className={styles.help}>
        {ENERGY_FIELD_HELP}
      </p>
      {fieldError('energy-error', properties.energyError)}
    </>,
  );
}

function fieldGroup(
  id: string,
  step: string,
  label: string,
  control: ReactNode,
  supportingText?: ReactNode,
): ReactNode {
  return (
    <div className={styles.field}>
      <span className={styles.step} aria-hidden="true">
        {step}
      </span>
      <label htmlFor={id}>{label}</label>
      {control}
      {supportingText}
    </div>
  );
}

function fieldError(id: string, message: string | null): ReactNode {
  return message === null ? null : (
    <p id={id} className={styles.error} role="alert">
      {message}
    </p>
  );
}
