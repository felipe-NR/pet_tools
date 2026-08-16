import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import {
  APP_TITLE,
  ATYPICAL_ENERGY_NOTICE,
  CALCULATION_STEPS_TITLE,
  DAILY_CALORIES_LABEL,
  DAILY_PORTION_LABEL,
  ENERGY_FIELD_LABEL,
  ESTIMATE_NOTICE,
  formatDailyCalories,
  formatDailyPortion,
  FORM_SUBMIT_LABEL,
  IDEAL_WEIGHT_DIRECTION,
  IDEAL_WEIGHT_FIELD_LABEL,
  OUT_OF_SCOPE_NOTICE,
  OVERWEIGHT_GUIDANCE,
  PROFILE_FIELD_LABEL,
  PROFILE_GUIDANCE,
  RESULT_TITLE,
  SPECIES_FIELD_LABEL,
} from './copy/calculator';
import { metabolizableEnergyViolationMessage, weightViolationMessage } from './copy/fieldMessages';
import { validateMetabolizableEnergy } from './domain/metabolizableEnergy';
import { validateWeightInKilograms } from './domain/weightRange';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('App calculator flow', () => {
  it('renders the calculator immediately with all four labelled fields', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(APP_TITLE);
    expect(screen.getByLabelText(SPECIES_FIELD_LABEL)).toBeVisible();
    expect(screen.getByLabelText(IDEAL_WEIGHT_FIELD_LABEL)).toBeVisible();
    expect(screen.getByLabelText(PROFILE_FIELD_LABEL)).toBeVisible();
    expect(screen.getByLabelText(ENERGY_FIELD_LABEL)).toBeVisible();
  });

  it('calculates the daily portion and shows every rounded calculation step', async () => {
    const user = userEvent.setup();
    render(<App />);

    await fillNeuteredDogExample(user);
    await user.click(screen.getByRole('button', { name: FORM_SUBMIT_LABEL }));

    const result = screen.getByRole('region', { name: RESULT_TITLE });
    expect(within(result).getByText(DAILY_PORTION_LABEL)).toBeVisible();
    expect(within(result).getByText(formatDailyPortion(180))).toBeVisible();
    expect(within(result).getByText(DAILY_CALORIES_LABEL)).toBeVisible();
    expect(within(result).getByText(formatDailyCalories(630))).toBeVisible();
    expect(within(result).getByRole('heading', { name: CALCULATION_STEPS_TITLE })).toBeVisible();
    expect(within(result).getAllByRole('listitem')).toHaveLength(3);
  });

  it('shows the estimate warning and ideal-weight direction inside the result', async () => {
    const user = userEvent.setup();
    render(<App />);

    await fillNeuteredDogExample(user);
    await user.click(screen.getByRole('button', { name: FORM_SUBMIT_LABEL }));

    const result = screen.getByRole('region', { name: RESULT_TITLE });
    expect(within(result).getByText(ESTIMATE_NOTICE)).toBeVisible();
    expect(within(result).getByText(IDEAL_WEIGHT_DIRECTION)).toBeVisible();
  });

  it('revalidates a typed weight when the species changes', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(IDEAL_WEIGHT_FIELD_LABEL), '20');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText(SPECIES_FIELD_LABEL), 'cat');

    expect(screen.getByRole('alert')).toHaveTextContent(invalidCatWeightMessage('20'));
  });

  it('blocks an invalid energy value with the domain-backed field message', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(IDEAL_WEIGHT_FIELD_LABEL), '10');
    await user.type(screen.getByLabelText(ENERGY_FIELD_LABEL), '100');
    await user.click(screen.getByRole('button', { name: FORM_SUBMIT_LABEL }));

    expect(screen.getByRole('alert')).toHaveTextContent(invalidEnergyMessage('100'));
    expect(screen.queryByRole('region', { name: RESULT_TITLE })).not.toBeInTheDocument();
  });

  it('calculates with an atypical energy value and asks for a label check', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(IDEAL_WEIGHT_FIELD_LABEL), '10');
    await user.type(screen.getByLabelText(ENERGY_FIELD_LABEL), '900');
    await user.click(screen.getByRole('button', { name: FORM_SUBMIT_LABEL }));

    expect(screen.getByRole('region', { name: RESULT_TITLE })).toBeVisible();
    expect(screen.getByText(ATYPICAL_ENERGY_NOTICE)).toBeVisible();
  });

  it('keeps the scope, overweight, and obesity-prone guidance visible', () => {
    render(<App />);

    expect(screen.getByText(OUT_OF_SCOPE_NOTICE)).toBeVisible();
    expect(screen.getByText(OVERWEIGHT_GUIDANCE)).toBeVisible();
    expect(screen.getByText(PROFILE_GUIDANCE)).toBeVisible();
  });
});

describe('App acceptance boundaries', () => {
  it('is fully operable using only the keyboard', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab();
    expect(screen.getByLabelText(SPECIES_FIELD_LABEL)).toHaveFocus();
    await user.tab();
    await user.keyboard('4');
    await user.tab();
    expect(screen.getByLabelText(PROFILE_FIELD_LABEL)).toHaveFocus();
    await user.tab();
    await user.keyboard('4000');
    await user.tab();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('region', { name: RESULT_TITLE })).toBeVisible();
  });

  it('renders the complete form in a 360 pixel viewport', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 360 });
    render(<App />);

    expect(screen.getByRole('form')).toBeVisible();
    expect(screen.getByRole('button', { name: FORM_SUBMIT_LABEL })).toBeVisible();
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(360);
  });

  it('makes no network request after the initial page load', async () => {
    const user = userEvent.setup();
    render(<App />);
    const fetchSpy = vi.fn();
    const xhrSendSpy = vi.spyOn(XMLHttpRequest.prototype, 'send');
    vi.stubGlobal('fetch', fetchSpy);

    await fillNeuteredDogExample(user);
    await user.click(screen.getByRole('button', { name: FORM_SUBMIT_LABEL }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrSendSpy).not.toHaveBeenCalled();
  });
});

async function fillNeuteredDogExample(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  await user.type(screen.getByLabelText(IDEAL_WEIGHT_FIELD_LABEL), '10');
  await user.type(screen.getByLabelText(ENERGY_FIELD_LABEL), '3500');
}

function invalidCatWeightMessage(rawWeight: string): string {
  const validation = validateWeightInKilograms(rawWeight, 'cat');
  if (validation.valid) {
    throw new Error(`Expected cat weight ${rawWeight} to be rejected by the domain`);
  }

  return weightViolationMessage(validation.violation, 'cat');
}

function invalidEnergyMessage(rawEnergy: string): string {
  const validation = validateMetabolizableEnergy(rawEnergy);
  if (validation.valid) {
    throw new Error(`Expected energy ${rawEnergy} to be rejected by the domain`);
  }

  return metabolizableEnergyViolationMessage(validation.violation);
}
