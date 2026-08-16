import { useReducer } from 'react';
import type { ChangeEvent, Dispatch, FormEvent } from 'react';
import { calculateDailyPortion, type DailyPortionResult } from '../domain/dailyPortion';
import { validateMetabolizableEnergy } from '../domain/metabolizableEnergy';
import {
  isPetProfile,
  isSpecies,
  supportedProfilesFor,
  type PetProfile,
  type Species,
} from '../domain/petProfile';
import { validateWeightInKilograms } from '../domain/weightRange';
import { metabolizableEnergyViolationMessage, weightViolationMessage } from '../copy/fieldMessages';

export interface DailyPortionCalculatorState {
  readonly species: Species;
  readonly profile: PetProfile;
  readonly rawWeight: string;
  readonly rawEnergy: string;
  readonly result: DailyPortionResult | null;
  readonly supportedProfiles: readonly PetProfile[];
  readonly weightError: string | null;
  readonly energyError: string | null;
  readonly changeSpecies: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly changeProfile: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly changeWeight: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly changeEnergy: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly submitCalculation: (event: FormEvent<HTMLFormElement>) => void;
}

interface CalculatorState {
  readonly species: Species;
  readonly profile: PetProfile;
  readonly rawWeight: string;
  readonly rawEnergy: string;
  readonly weightWasEdited: boolean;
  readonly energyWasEdited: boolean;
  readonly result: DailyPortionResult | null;
}

type CalculatorAction =
  | { readonly type: 'species'; readonly value: Species }
  | { readonly type: 'profile'; readonly value: PetProfile }
  | { readonly type: 'weight'; readonly value: string }
  | { readonly type: 'energy'; readonly value: string }
  | { readonly type: 'submission'; readonly result: DailyPortionResult | null };

const INITIAL_CALCULATOR_STATE: CalculatorState = {
  species: 'dog',
  profile: 'neutered',
  rawWeight: '',
  rawEnergy: '',
  weightWasEdited: false,
  energyWasEdited: false,
  result: null,
};

/** Owns browser form state while leaving every calculation rule in domain. */
export function useDailyPortionCalculator(): DailyPortionCalculatorState {
  const [state, dispatch] = useReducer(reduceCalculatorState, INITIAL_CALCULATOR_STATE);
  return {
    species: state.species,
    profile: state.profile,
    rawWeight: state.rawWeight,
    rawEnergy: state.rawEnergy,
    result: state.result,
    supportedProfiles: supportedProfilesFor(state.species),
    weightError: weightErrorFor(state),
    energyError: energyErrorFor(state),
    changeSpecies: speciesChangeFor(dispatch),
    changeProfile: profileChangeFor(dispatch),
    changeWeight: numericFieldChangeFor('weight', dispatch),
    changeEnergy: numericFieldChangeFor('energy', dispatch),
    submitCalculation: submissionFor(state, dispatch),
  };
}

function reduceCalculatorState(state: CalculatorState, action: CalculatorAction): CalculatorState {
  if (action.type === 'species') return { ...state, species: action.value, result: null };
  if (action.type === 'profile') return { ...state, profile: action.value, result: null };
  if (action.type === 'weight') {
    return { ...state, rawWeight: action.value, weightWasEdited: true, result: null };
  }
  if (action.type === 'energy') {
    return { ...state, rawEnergy: action.value, energyWasEdited: true, result: null };
  }
  return { ...state, weightWasEdited: true, energyWasEdited: true, result: action.result };
}

function weightErrorFor(state: CalculatorState): string | null {
  if (!state.weightWasEdited) return null;
  const validation = validateWeightInKilograms(state.rawWeight, state.species);
  return validation.valid ? null : weightViolationMessage(validation.violation, state.species);
}

function energyErrorFor(state: CalculatorState): string | null {
  if (!state.energyWasEdited) return null;
  const validation = validateMetabolizableEnergy(state.rawEnergy);
  return validation.valid ? null : metabolizableEnergyViolationMessage(validation.violation);
}

function speciesChangeFor(
  dispatch: Dispatch<CalculatorAction>,
): (event: ChangeEvent<HTMLSelectElement>) => void {
  return (event: ChangeEvent<HTMLSelectElement>): void => {
    if (!isSpecies(event.currentTarget.value)) return;
    dispatch({ type: 'species', value: event.currentTarget.value });
  };
}

function profileChangeFor(
  dispatch: Dispatch<CalculatorAction>,
): (event: ChangeEvent<HTMLSelectElement>) => void {
  return (event: ChangeEvent<HTMLSelectElement>): void => {
    if (!isPetProfile(event.currentTarget.value)) return;
    dispatch({ type: 'profile', value: event.currentTarget.value });
  };
}

function numericFieldChangeFor(
  type: 'weight' | 'energy',
  dispatch: Dispatch<CalculatorAction>,
): (event: ChangeEvent<HTMLInputElement>) => void {
  return (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type, value: event.currentTarget.value });
  };
}

function submissionFor(
  state: CalculatorState,
  dispatch: Dispatch<CalculatorAction>,
): (event: FormEvent<HTMLFormElement>) => void {
  return (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const weight = validateWeightInKilograms(state.rawWeight, state.species);
    const energy = validateMetabolizableEnergy(state.rawEnergy);
    const result = weight.valid && energy.valid ? calculateFrom(state) : null;
    dispatch({ type: 'submission', result });
  };
}

function calculateFrom(state: CalculatorState): DailyPortionResult {
  return calculateDailyPortion({
    species: state.species,
    profile: state.profile,
    weightInKilograms: state.rawWeight,
    metabolizableEnergyKcalPerKilogram: state.rawEnergy,
  });
}
