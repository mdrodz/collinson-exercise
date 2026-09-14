import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useTrimmedString from '.';

describe('useTrimmedString', () => {
    it('trims the initial value and future updates', () => {
        const { result } = renderHook(() => useTrimmedString('  São Paulo  '));

        expect(result.current[0]).toBe('São Paulo');

        act(() => {
            result.current[1]('   Rio de Janeiro   ');
        });

        expect(result.current[0]).toBe('Rio de Janeiro');

        act(() => {
            result.current[1]((currentValue) => `  ${currentValue}  `);
        });

        expect(result.current[0]).toBe('Rio de Janeiro');
    });
});
