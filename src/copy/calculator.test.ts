import { describe, expect, it } from 'vitest';
import {
  ESTIMATE_NOTICE,
  formatDailyCalories,
  formatDailyPortion,
  formatMaintenanceEnergyStep,
  formatPortionStep,
  formatRestingEnergyStep,
  IDEAL_WEIGHT_DIRECTION,
  IDEAL_WEIGHT_HELP,
  OUT_OF_SCOPE_NOTICE,
  OVERWEIGHT_GUIDANCE,
  profileLabelFor,
  PROFILE_GUIDANCE,
  speciesOptionLabelFor,
} from './calculator';

describe('calculator product copy', () => {
  it('explains that ideal weight is defined with a veterinarian', () => {
    expect(IDEAL_WEIGHT_HELP).toBe(
      'Use o peso ideal definido com o médico-veterinário, não uma estimativa feita em casa.',
    );
  });

  it('describes direction toward ideal weight without promising a timeframe', () => {
    expect(IDEAL_WEIGHT_DIRECTION).toBe(
      'Servir esta quantidade tende a levar o animal em direção ao peso ideal informado.',
    );
    expect(IDEAL_WEIGHT_DIRECTION).not.toMatch(/dias|semanas|meses|prazo/u);
  });

  it('sends an overweight animal to veterinary care and names the feline risk', () => {
    expect(OVERWEIGHT_GUIDANCE).toContain('visivelmente acima do peso');
    expect(OVERWEIGHT_GUIDANCE).toContain('médico-veterinário');
    expect(OVERWEIGHT_GUIDANCE).toContain('lipidose hepática');
  });

  it('defines obesity prone as healthy weight maintenance and directs senior pets to it', () => {
    expect(PROFILE_GUIDANCE).toContain('está no peso saudável');
    expect(PROFILE_GUIDANCE).toContain('não é um perfil de emagrecimento');
    expect(PROFILE_GUIDANCE).toContain('animal idoso');
  });

  it('states the unsupported profiles and the clinical limit', () => {
    expect(OUT_OF_SCOPE_NOTICE).toMatch(/filhotes|gestantes|lactantes|doentes/u);
    expect(ESTIMATE_NOTICE).toContain('não substitui avaliação veterinária');
  });

  it('provides species and profile labels for domain values', () => {
    expect(speciesOptionLabelFor('dog')).toBe('Cão');
    expect(speciesOptionLabelFor('cat')).toBe('Gato');
    expect(profileLabelFor('neutered')).toBe('Castrado');
    expect(profileLabelFor('intact')).toBe('Inteiro (não castrado)');
    expect(profileLabelFor('obesityProne')).toBe('Propenso à obesidade');
  });

  it('formats result values and the three calculation steps', () => {
    expect(formatDailyPortion(180)).toBe('180 g/dia');
    expect(formatDailyCalories(630)).toBe('630 kcal/dia');
    expect(formatRestingEnergyStep('10', 393.6389)).toBe('RER = 70 × 10^0,75 = 393,6 kcal/dia');
    expect(formatMaintenanceEnergyStep(393.6389, 1.6, 629.8222)).toBe(
      'MER = 393,6 × 1,6 = 629,8 kcal/dia',
    );
    expect(formatPortionStep(629.8222, '3500', 180)).toBe(
      'Porção = 629,8 ÷ (3500 ÷ 1.000) = 180 g/dia',
    );
  });
});
